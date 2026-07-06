markdown
# CircuLink AI 功能接入指南

> 基于 AWS Bedrock (Claude 3 Haiku) 的 AI 功能集成，提供商品描述生成、价格估算和自然语言搜索能力。

## 📦 安装依赖

在项目根目录（包含 `package.json` 的位置）执行：

```bash
npm install @aws-sdk/client-bedrock-runtime dotenv
🧩 核心功能
功能	描述
生成商品描述	根据商品名称和成色生成标题、描述、分类和建议价格
二手价格估算	基于原价和成色估算合理的二手价格
自然语言搜索	将自然语言查询转换为结构化搜索参数
🗂️ 文件结构
text
server/
├── services/
│   └── bedrock.service.ts      # AI 服务核心逻辑
├── routes/
│   └── ai.routes.ts            # AI API 路由
└── index.ts (或 app.ts)        # 主应用文件
⚙️ 配置步骤
1. 创建服务文件
创建 server/services/bedrock.service.ts：

typescript
// server/services/bedrock.service.ts
import dotenv from "dotenv";

dotenv.config();

const BEDROCK_API_KEY = process.env.AWS_BEARER_TOKEN_BEDROCK;
const BEDROCK_REGION = process.env.AWS_REGION || "us-east-2";

// 模型配置
const MODELS = {
  HAIKU: "anthropic.claude-3-haiku-20240307-v1:0", // 便宜，适合测试
  SONNET: "anthropic.claude-3-5-sonnet-20241022-v2:0", // 强，适合生产
};

interface ListingResult {
  title: string;
  description: string;
  category: "Electronics" | "Furniture" | "Books" | "Clothing" | "Other";
  suggested_price: number;
}

/**
 * 调用 Bedrock API
 */
async function invokeBedrock(prompt: string, maxTokens: number = 500): Promise<string> {
  const response = await fetch(
    `https://bedrock-runtime.${BEDROCK_REGION}.amazonaws.com/model/${MODELS.HAIKU}/invoke`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BEDROCK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: maxTokens,
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Bedrock API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * 生成商品描述
 */
export async function generateListing(
  itemName: string,
  condition: string = "good"
): Promise<ListingResult> {
  const prompt = `You are a helpful assistant for a secondhand marketplace. Generate a listing for the following item:

Item: ${itemName}
Condition: ${condition}

Return ONLY a valid JSON object (no markdown, no extra text) with exactly these fields:
- title: a catchy short title (max 60 characters)
- description: a detailed 2-3 sentence description
- category: one of ["Electronics", "Furniture", "Books", "Clothing", "Other"]
- suggested_price: a reasonable secondhand price in RMB (integer)

Example response format:
{"title":"iPhone 12 128GB - Like New","description":"Selling my iPhone 12...","category":"Electronics","suggested_price":3200}`;

  const response = await invokeBedrock(prompt, 400);

  // 提取 JSON
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Failed to parse AI response:", response);
    }
  }

  // 降级返回
  return {
    title: itemName,
    description: response.slice(0, 200),
    category: "Other",
    suggested_price: 0,
  };
}

/**
 * 估算二手价格
 */
export async function estimatePrice(
  itemName: string,
  originalPrice: number,
  condition: string
): Promise<number> {
  const prompt = `Estimate the fair secondhand price for:

Item: ${itemName}
Original price: ${originalPrice} RMB
Condition: ${condition} (new/good/fair/poor)

Return ONLY a number (the price in RMB), no other text or explanation.`;

  const response = await invokeBedrock(prompt, 20);

  // 提取数字
  const priceMatch = response.match(/\d+/);
  if (priceMatch) {
    return parseInt(priceMatch[0]);
  }

  // 降级：原价的 50%
  return Math.floor(originalPrice * 0.5);
}

/**
 * 自然语言搜索
 */
export async function searchFromNaturalLanguage(query: string): Promise<{
  keyword: string;
  category: string;
  min_price: number | null;
  max_price: number | null;
}> {
  const prompt = `Convert this natural language search query into structured search parameters:

Query: "${query}"

Return ONLY a JSON object with these fields:
- keyword: main search keyword
- category: one of ["Electronics", "Furniture", "Books", "Clothing", "Other", "Any"]
- min_price: minimum price in RMB (integer, or null if not specified)
- max_price: maximum price in RMB (integer, or null if not specified)

Example: {"keyword":"Arduino","category":"Electronics","min_price":null,"max_price":100}`;

  const response = await invokeBedrock(prompt, 200);

  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Failed to parse search response:", response);
    }
  }

  return {
    keyword: query,
    category: "Any",
    min_price: null,
    max_price: null,
  };
}
2. 添加 API 路由
创建 server/routes/ai.routes.ts：

typescript
// server/routes/ai.routes.ts
import { Router, Request, Response } from "express";
import { generateListing, estimatePrice, searchFromNaturalLanguage } from "../services/bedrock.service";

const router = Router();

// 健康检查
router.get("/ai/health", (req: Request, res: Response) => {
  res.json({ status: "ok", service: "Bedrock AI", region: "us-east-2" });
});

// 生成商品描述
router.post("/ai/generate-listing", async (req: Request, res: Response) => {
  try {
    const { itemName, condition } = req.body;

    if (!itemName) {
      return res.status(400).json({ error: "itemName is required" });
    }

    const result = await generateListing(itemName, condition || "good");
    res.json(result);
  } catch (error) {
    console.error("Generate listing error:", error);
    res.status(500).json({ error: "AI service failed" });
  }
});

// 价格估算
router.post("/ai/estimate-price", async (req: Request, res: Response) => {
  try {
    const { itemName, originalPrice, condition } = req.body;

    if (!itemName || !originalPrice) {
      return res.status(400).json({ error: "itemName and originalPrice are required" });
    }

    const price = await estimatePrice(itemName, originalPrice, condition || "good");
    res.json({ suggested_price: price });
  } catch (error) {
    console.error("Estimate price error:", error);
    res.status(500).json({ error: "AI service failed" });
  }
});

// 自然语言搜索
router.post("/ai/search", async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "query is required" });
    }

    const result = await searchFromNaturalLanguage(query);
    res.json(result);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "AI service failed" });
  }
});

export default router;
3. 注册路由到主应用
在主应用文件（server/index.ts 或 app.ts）中添加：

typescript
import aiRoutes from "./routes/ai.routes";

// ... 现有代码 ...

// 注册 AI 路由
app.use("/api", aiRoutes);
🔐 环境变量配置
更新 .env.example
env
# AWS Bedrock AI 配置
AWS_BEARER_TOKEN_BEDROCK=your-bedrock-api-key-here
AWS_REGION=us-east-2
创建本地 .env 文件
bash
# 复制模板
cp .env.example .env

# 编辑 .env，填入真实的 API Key
.env 文件内容：

env
AWS_BEARER_TOKEN_BEDROCK=ABSKQmVkcm9ja0FQSUtleS0wN281LWF0LTU5MDc3MTM0MTk2MDpYWUVSNGZrd2R5WWcyT0RuUng3NnIxRUxYTUR1TUNnZUxBUzQ2SHMweStvejhoYTZiTVg5c2F6MHlUTT0=
AWS_REGION=us-east-2
⚠️ 此仓库为私有，API Key 仅供内部开发使用。

🧪 API 使用示例
生成商品描述
bash
POST /api/ai/generate-listing
Content-Type: application/json

{
  "itemName": "iPhone 12",
  "condition": "like new"
}
响应：

json
{
  "title": "iPhone 12 128GB - Like New",
  "description": "Selling my iPhone 12 in excellent condition...",
  "category": "Electronics",
  "suggested_price": 3200
}
价格估算
bash
POST /api/ai/estimate-price
Content-Type: application/json

{
  "itemName": "MacBook Pro 14",
  "originalPrice": 15000,
  "condition": "good"
}
响应：

json
{
  "suggested_price": 7500
}
自然语言搜索
bash
POST /api/ai/search
Content-Type: application/json

{
  "query": "Arduino under 100 yuan"
}
响应：

json
{
  "keyword": "Arduino",
  "category": "Electronics",
  "min_price": null,
  "max_price": 100
}
🛠️ 降级策略
当 AI 服务不可用或返回异常时，系统提供降级方案：

功能	降级行为
商品描述	返回原始商品名，截取 AI 响应前 200 字符
价格估算	返回原价的 50%
搜索解析	返回原始查询字符串，分类为 "Any"
📝 模型说明
模型	用途	特点
claude-3-haiku-20240307-v1:0	测试/轻量任务	便宜、快速
claude-3-5-sonnet-20241022-v2:0	生产环境	能力更强
当前默认使用 Haiku 模型，可在 MODELS 对象中切换。

🔧 技术栈
AWS Bedrock Runtime - AI 模型调用

Claude 3 Haiku - 轻量级模型

Express.js - API 路由

dotenv - 环境变量管理

TypeScript - 类型安全

📋 故障排查
常见问题
1. API Key 无效

text
Error: Bedrock API error: 401 - Unauthorized
检查 .env 中的 AWS_BEARER_TOKEN_BEDROCK 是否正确。

2. 区域错误

text
Error: Bedrock API error: 404 - Not Found
确认 AWS_REGION 设置为 us-east-2 或其他支持 Bedrock 的区域。

3. 模型不可用

text
Error: Bedrock API error: 403 - Access Denied
确保 AWS 账号已开通 Claude 模型的访问权限。

📄 License
内部项目，仅供 CircuLink 开发使用。
