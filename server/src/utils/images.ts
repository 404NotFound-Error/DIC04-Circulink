export const parseImages = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
      }
      if (typeof parsed === "string" && parsed.length > 0) {
        return [parsed];
      }
    } catch {
      // Keep backward compatibility for legacy rows that stored a raw URL string.
    }

    return [trimmed];
  }

  return [];
};

export const serializeImages = (value: string[] = []) => JSON.stringify(value);

export const withParsedImages = <T extends { images: unknown }>(entity: T): Omit<T, "images"> & { images: string[] } => {
  return {
    ...entity,
    images: parseImages(entity.images)
  };
};
