import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { env, serverConfig } from "../../config/env.js";
import { logger } from "../../lib/logger.js";
import { listCategories } from "../categories/service.js";

type Locale = "zh" | "en";
type Condition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR";

type SuggestInput = {
  imagePaths: string[];
  locale?: Locale;
  userHint?: string;
};

type SuggestResult = {
  title: string;
  description: string;
  condition: Condition;
  suggestedPrice: number;
  minimumAcceptablePrice: number;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  confidence: number;
  warnings: string[];
  source: "llm" | "heuristic";
  model?: string;
};

const llmResponseSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(1000),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR"]).default("GOOD"),
  suggestedPrice: z.coerce.number().positive(),
  minimumAcceptablePrice: z.coerce.number().positive(),
  categorySlug: z.string().min(1),
  confidence: z.coerce.number().min(0).max(1).default(0.5),
  warnings: z.array(z.string()).default([])
});

const mimeByExt: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif"
};

const round2 = (num: number) => Math.round(num * 100) / 100;
const clamp = (num: number, min: number, max: number) => Math.min(max, Math.max(min, num));
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const LLM_REQUEST_TIMEOUT_MS = 45_000;
const LLM_MAX_RETRIES = 2;

const isStandaloneMarker = (marker: number) =>
  marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9);

const stripJpegAppSegments = (buffer: Buffer): Buffer => {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return buffer;

  const chunks: Buffer[] = [buffer.subarray(0, 2)]; // SOI
  let i = 2;
  while (i < buffer.length) {
    if (buffer[i] !== 0xff) {
      chunks.push(buffer.subarray(i));
      break;
    }

    let markerPos = i;
    while (markerPos < buffer.length && buffer[markerPos] === 0xff) markerPos += 1;
    if (markerPos >= buffer.length) break;

    const marker = buffer[markerPos];
    const markerStart = markerPos - 1;

    if (marker === 0xda) {
      chunks.push(buffer.subarray(markerStart));
      break;
    }

    if (isStandaloneMarker(marker)) {
      chunks.push(buffer.subarray(markerStart, markerPos + 1));
      i = markerPos + 1;
      continue;
    }

    if (markerPos + 2 >= buffer.length) break;
    const segmentLength = buffer.readUInt16BE(markerPos + 1);
    const segmentEnd = markerPos + 1 + segmentLength;
    if (segmentEnd > buffer.length || segmentLength < 2) break;

    const isAppSegment = marker >= 0xe0 && marker <= 0xef;
    if (!isAppSegment) {
      chunks.push(buffer.subarray(markerStart, segmentEnd));
    }
    i = segmentEnd;
  }

  return Buffer.concat(chunks);
};

const resolveUploadFilePath = (imagePath: string) => {
  const uploadRoot = path.resolve(serverConfig.uploadDir);
  let pathname = imagePath;
  if (/^https?:\/\//i.test(imagePath)) {
    try {
      pathname = new URL(imagePath).pathname;
    } catch {
      pathname = imagePath;
    }
  }
  const cleanPath = pathname.split("?")[0];
  const uploadsPrefix = "/uploads/";
  const relative = cleanPath.startsWith(uploadsPrefix)
    ? cleanPath.slice(uploadsPrefix.length)
    : cleanPath.replace(/^\/+/, "");
  const normalized = path.normalize(relative);
  const resolved = path.resolve(uploadRoot, normalized);
  // Prevent path traversal out of upload root.
  if (!resolved.startsWith(`${uploadRoot}${path.sep}`) && resolved !== uploadRoot) {
    return null;
  }
  return resolved;
};

const toDataUrl = async (imagePath: string): Promise<string | null> => {
  try {
    const filePath = resolveUploadFilePath(imagePath);
    if (!filePath) return null;
    const ext = path.extname(filePath).toLowerCase();
    const mime = mimeByExt[ext] ?? "image/jpeg";
    const buffer = await fs.readFile(filePath);
    const payload =
      mime === "image/jpeg"
        ? stripJpegAppSegments(buffer)
        : buffer;
    return `data:${mime};base64,${payload.toString("base64")}`;
  } catch {
    return null;
  }
};

const pickCategoryByKeywords = (
  text: string,
  categories: Array<{ id: string; name: string; slug: string }>
) => {
  const lower = text.toLowerCase();
  const keywordMap: Record<string, string[]> = {
    electronics: ["laptop", "keyboard", "mouse", "monitor", "phone", "ipad", "earphone", "charger", "camera"],
    furniture: ["chair", "desk", "table", "shelf", "cabinet", "sofa", "bed"],
    clothing: ["shirt", "jacket", "hoodie", "pants", "dress", "shoe", "coat", "hat"],
    "office-supplies": ["notebook", "pen", "book", "stapler", "folder", "calculator", "stationery"],
    "food-snacks": ["snack", "drink", "coffee", "tea", "food"],
    "daily-essentials": ["bottle", "umbrella", "bag", "towel", "detergent", "toothbrush"],
    "art-decor": ["paint", "poster", "frame", "decor", "sculpture", "art"]
  };
  const scored = categories.map((category) => {
    const keywords = keywordMap[category.slug] ?? [];
    const score = keywords.reduce((acc, keyword) => acc + (lower.includes(keyword) ? 1 : 0), 0);
    return { category, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].score > 0 ? scored[0].category : categories[0];
};

const inferConditionByKeywords = (text: string): Condition => {
  const lower = text.toLowerCase();
  if (lower.includes("brand new") || lower.includes("unused") || lower.includes("sealed")) return "NEW";
  if (lower.includes("like new") || lower.includes("almost new")) return "LIKE_NEW";
  if (lower.includes("worn") || lower.includes("old") || lower.includes("scratch")) return "FAIR";
  return "GOOD";
};

const heuristicPrice = (categorySlug: string, condition: Condition) => {
  const baseByCategory: Record<string, number> = {
    electronics: 120,
    furniture: 80,
    clothing: 30,
    "office-supplies": 20,
    "food-snacks": 8,
    "daily-essentials": 18,
    "art-decor": 35
  };
  const multiplierByCondition: Record<Condition, number> = {
    NEW: 1,
    LIKE_NEW: 0.9,
    GOOD: 0.75,
    FAIR: 0.55
  };
  const base = baseByCategory[categorySlug] ?? 40;
  return round2(base * multiplierByCondition[condition]);
};

const heuristicSuggest = async (input: SuggestInput): Promise<Omit<SuggestResult, "categoryId" | "categorySlug" | "categoryName"> & { categorySlug: string }> => {
  const locale: Locale = input.locale ?? "zh";
  const mergedText = `${input.userHint ?? ""} ${input.imagePaths.join(" ")}`.replace(/[_/-]+/g, " ").trim();
  const condition = inferConditionByKeywords(mergedText);
  const inferredCategorySlug = pickCategoryByKeywords(mergedText, [
    { id: "", name: "Electronics", slug: "electronics" },
    { id: "", name: "Furniture", slug: "furniture" },
    { id: "", name: "Clothing", slug: "clothing" },
    { id: "", name: "Office Supplies", slug: "office-supplies" },
    { id: "", name: "Food & Snacks", slug: "food-snacks" },
    { id: "", name: "Daily Essentials", slug: "daily-essentials" },
    { id: "", name: "Art & Decor", slug: "art-decor" }
  ]).slug;
  const suggestedPrice = heuristicPrice(inferredCategorySlug, condition);
  const minimumAcceptablePrice = round2(suggestedPrice * 0.8);
  const title = locale === "zh" ? "二手闲置物品" : "Pre-owned item";
  const description =
    locale === "zh"
      ? "根据图片自动生成的商品描述，请在发布前手动确认并补充细节。"
      : "Auto-generated description from images. Please review and refine before publishing.";

  return {
    title,
    description,
    condition,
    suggestedPrice,
    minimumAcceptablePrice,
    categorySlug: inferredCategorySlug,
    confidence: 0.35,
    warnings: [
      locale === "zh" ? "当前使用启发式识别，建议人工确认结果。" : "Using heuristic recognition. Please verify manually."
    ],
    source: "heuristic"
  };
};

const extractOutputText = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as {
    output_text?: unknown;
    output?: Array<{ content?: Array<{ text?: string }> }>;
  };
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text;
  if (Array.isArray(data.output_text)) {
    const joined = data.output_text.filter((v): v is string => typeof v === "string").join("\n").trim();
    if (joined) return joined;
  }
  if (Array.isArray(data.output)) {
    for (const item of data.output) {
      if (!Array.isArray(item.content)) continue;
      for (const content of item.content) {
        if (typeof content.text === "string" && content.text.trim()) return content.text;
      }
    }
  }
  return null;
};

const extractChatMessageText = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  return typeof content === "string" && content.trim() ? content : null;
};

const sanitizeJsonControlChars = (raw: string) => {
  let result = "";
  let inString = false;
  let escaped = false;
  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i];
    if (escaped) {
      result += ch;
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      result += ch;
      escaped = true;
      continue;
    }
    if (ch === "\"") {
      inString = !inString;
      result += ch;
      continue;
    }
    if (inString) {
      const code = ch.charCodeAt(0);
      // Replace unescaped control chars in strings with safe escapes.
      if (code <= 0x1f) {
        if (ch === "\n") {
          result += "\\n";
        } else if (ch === "\r") {
          result += "\\r";
        } else if (ch === "\t") {
          result += "\\t";
        } else {
          result += " ";
        }
        continue;
      }
    }
    result += ch;
  }
  return result;
};

const parseSuggestionFromText = (text: string) => {
  const normalized = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = normalized.indexOf("{");
  const end = normalized.lastIndexOf("}");
  const jsonText = start >= 0 && end > start ? normalized.slice(start, end + 1) : normalized;

  try {
    return llmResponseSchema.parse(JSON.parse(jsonText));
  } catch {
    const sanitized = sanitizeJsonControlChars(jsonText);
    return llmResponseSchema.parse(JSON.parse(sanitized));
  }
};

const buildPrompt = (
  input: SuggestInput,
  categories: Array<{ id: string; name: string; slug: string }>
) => {
  const categoryHint = categories.map((c) => `- ${c.slug} (${c.name})`).join("\n");
  const userHint = input.userHint?.trim();
  const locale: Locale = input.locale ?? "zh";
  const localeHint = locale === "zh" ? "请输出中文标题与描述。" : "Please output English title and description.";

  return [
    "Analyze the product images for a campus second-hand marketplace.",
    localeHint,
    "Return JSON only and match this schema exactly.",
    "Condition must be one of: NEW, LIKE_NEW, GOOD, FAIR.",
    "Pricing rule: minimumAcceptablePrice must be <= suggestedPrice and both > 0.",
    "Pick categorySlug from this list only:",
    categoryHint,
    userHint ? `Seller hint: ${userHint}` : ""
  ]
    .filter(Boolean)
    .join("\n");
};

const normalizeBaseUrl = (url: string) =>
  url
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/responses$/i, "")
    .replace(/\/chat\/completions$/i, "");

const shouldSkipResponsesEndpoint = (baseUrl: string) => /siliconflow\.(cn|com)/i.test(baseUrl);

const isRetriableNetworkError = (err: unknown) => {
  if (!(err instanceof Error)) return false;
  const message = err.message.toLowerCase();
  if (
    message.includes("fetch failed") ||
    message.includes("other side closed") ||
    message.includes("socket") ||
    message.includes("timeout")
  ) {
    return true;
  }
  const cause = (err as { cause?: unknown }).cause;
  if (cause && typeof cause === "object") {
    const code = (cause as { code?: unknown }).code;
    if (typeof code === "string" && ["ECONNRESET", "ETIMEDOUT", "EPIPE", "UND_ERR_SOCKET"].includes(code)) {
      return true;
    }
  }
  return false;
};

const fetchWithRetry = async (
  url: string,
  init: RequestInit
) => {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= LLM_MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(LLM_REQUEST_TIMEOUT_MS)
      });
      if ((response.status >= 500 || response.status === 429 || response.status === 408) && attempt < LLM_MAX_RETRIES) {
        logger.warn(
          { url, status: response.status, attempt: attempt + 1 },
          "LLM request got retriable HTTP status, retrying"
        );
        await sleep(400 * (attempt + 1));
        continue;
      }
      return response;
    } catch (err) {
      lastErr = err;
      if (attempt < LLM_MAX_RETRIES && isRetriableNetworkError(err)) {
        logger.warn({ err, url, attempt: attempt + 1 }, "LLM request network error, retrying");
        await sleep(400 * (attempt + 1));
        continue;
      }
      throw err;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("LLM request failed after retries");
};

const requestByResponsesApi = async (
  baseUrl: string,
  apiKey: string,
  model: string,
  prompt: string,
  imageDataUrls: string[]
) => {
  const response = await fetchWithRetry(`${baseUrl}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            ...imageDataUrls.map((image_url) => ({ type: "input_image", image_url }))
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "item_suggestion",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              condition: { type: "string", enum: ["NEW", "LIKE_NEW", "GOOD", "FAIR"] },
              suggestedPrice: { type: "number", exclusiveMinimum: 0 },
              minimumAcceptablePrice: { type: "number", exclusiveMinimum: 0 },
              categorySlug: { type: "string" },
              confidence: { type: "number", minimum: 0, maximum: 1 },
              warnings: { type: "array", items: { type: "string" } }
            },
            required: [
              "title",
              "description",
              "condition",
              "suggestedPrice",
              "minimumAcceptablePrice",
              "categorySlug",
              "confidence",
              "warnings"
            ]
          }
        }
      }
    })
  });
  if (!response.ok) {
    const bodyText = await response.text();
    if (response.status === 401) {
      throw new Error(
        `responses API failed: 401 Unauthorized. Check OPENAI_API_KEY and OPENAI_BASE_URL pair. Raw: ${bodyText}`
      );
    }
    throw new Error(`responses API failed: ${response.status} ${bodyText}`);
  }
  const payload = (await response.json()) as unknown;
  const rawText = extractOutputText(payload);
  if (!rawText) {
    throw new Error("responses API returned empty content");
  }
  return parseSuggestionFromText(rawText);
};

const requestByChatCompletionsApi = async (
  baseUrl: string,
  apiKey: string,
  model: string,
  prompt: string,
  imageDataUrls: string[]
) => {
  const response = await fetchWithRetry(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            ...imageDataUrls.map((image_url) => ({ type: "image_url", image_url: { url: image_url } }))
          ]
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "item_suggestion",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              condition: { type: "string", enum: ["NEW", "LIKE_NEW", "GOOD", "FAIR"] },
              suggestedPrice: { type: "number", exclusiveMinimum: 0 },
              minimumAcceptablePrice: { type: "number", exclusiveMinimum: 0 },
              categorySlug: { type: "string" },
              confidence: { type: "number", minimum: 0, maximum: 1 },
              warnings: { type: "array", items: { type: "string" } }
            },
            required: [
              "title",
              "description",
              "condition",
              "suggestedPrice",
              "minimumAcceptablePrice",
              "categorySlug",
              "confidence",
              "warnings"
            ]
          }
        }
      }
    })
  });
  if (!response.ok) {
    const bodyText = await response.text();
    if (response.status === 401) {
      throw new Error(
        `chat/completions API failed: 401 Unauthorized. Check OPENAI_API_KEY and OPENAI_BASE_URL pair. Raw: ${bodyText}`
      );
    }
    throw new Error(`chat/completions API failed: ${response.status} ${bodyText}`);
  }
  const payload = (await response.json()) as unknown;
  const rawText = extractChatMessageText(payload);
  if (!rawText) {
    throw new Error("chat/completions API returned empty content");
  }
  return parseSuggestionFromText(rawText);
};

const callLlmSuggest = async (
  input: SuggestInput,
  categories: Array<{ id: string; name: string; slug: string }>
): Promise<Omit<SuggestResult, "categoryId" | "categoryName">> => {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const imageDataUrls = (
    await Promise.all(input.imagePaths.slice(0, 4).map((imagePath) => toDataUrl(imagePath)))
  ).filter((url): url is string => Boolean(url));
  if (imageDataUrls.length === 0) {
    throw new Error("No readable images for AI recognition");
  }

  const baseUrl = normalizeBaseUrl(env.OPENAI_BASE_URL);
  const prompt = buildPrompt(input, categories);
  let parsed: z.infer<typeof llmResponseSchema>;
  if (shouldSkipResponsesEndpoint(baseUrl)) {
    parsed = await requestByChatCompletionsApi(baseUrl, env.OPENAI_API_KEY, env.OPENAI_MODEL, prompt, imageDataUrls);
  } else {
    try {
      parsed = await requestByResponsesApi(baseUrl, env.OPENAI_API_KEY, env.OPENAI_MODEL, prompt, imageDataUrls);
    } catch (responsesErr) {
      logger.warn({ err: responsesErr, baseUrl }, "responses API failed, trying chat/completions");
      parsed = await requestByChatCompletionsApi(baseUrl, env.OPENAI_API_KEY, env.OPENAI_MODEL, prompt, imageDataUrls);
    }
  }

  return {
    title: parsed.title,
    description: parsed.description,
    condition: parsed.condition,
    suggestedPrice: round2(parsed.suggestedPrice),
    minimumAcceptablePrice: round2(Math.min(parsed.minimumAcceptablePrice, parsed.suggestedPrice)),
    categorySlug: parsed.categorySlug,
    confidence: clamp(parsed.confidence, 0, 1),
    warnings: parsed.warnings,
    source: "llm",
    model: env.OPENAI_MODEL
  };
};

export const suggestItemByImages = async (input: SuggestInput): Promise<SuggestResult> => {
  const categories = await listCategories();
  if (categories.length === 0) {
    throw new Error("No categories configured");
  }

  let suggested: Omit<SuggestResult, "categoryId" | "categoryName">;
  try {
    suggested = await callLlmSuggest(input, categories);
  } catch (err) {
    logger.warn({ err }, "AI recognition failed, fallback to heuristic");
    suggested = await heuristicSuggest(input);
  }

  const matchedCategory =
    categories.find((category) => category.slug === suggested.categorySlug) ??
    pickCategoryByKeywords(`${suggested.title} ${suggested.description}`, categories);

  const warnings = [...suggested.warnings];
  if (matchedCategory.slug !== suggested.categorySlug) {
    warnings.push("Category remapped to closest available option.");
  }

  const suggestedPrice = round2(Math.max(suggested.suggestedPrice, 0.01));
  const minimumAcceptablePrice = round2(
    Math.max(0.01, Math.min(suggested.minimumAcceptablePrice, suggestedPrice))
  );

  return {
    ...suggested,
    suggestedPrice,
    minimumAcceptablePrice,
    categoryId: matchedCategory.id,
    categorySlug: matchedCategory.slug,
    categoryName: matchedCategory.name,
    warnings
  };
};
