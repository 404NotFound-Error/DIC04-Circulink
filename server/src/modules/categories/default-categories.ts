export interface DefaultCategory {
  name: string;
  slug: string;
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  { name: "Clothing", slug: "clothing" },
  { name: "Furniture", slug: "furniture" },
  { name: "Electronics", slug: "electronics" },
  { name: "Office Supplies", slug: "office-supplies" },
  { name: "Food & Snacks", slug: "food-snacks" },
  { name: "Daily Essentials", slug: "daily-essentials" },
  { name: "Art & Decor", slug: "art-decor" },
];
