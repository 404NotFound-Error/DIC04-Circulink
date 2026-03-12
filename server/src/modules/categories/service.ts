import { prisma } from "../../lib/prisma.js";
import { DEFAULT_CATEGORIES } from "./default-categories.js";

const ensureDefaultCategories = async () => {
  await Promise.all(
    DEFAULT_CATEGORIES.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: { name: category.name },
        create: { name: category.name, slug: category.slug },
      })
    )
  );
};

export const listCategories = async () => {
  await ensureDefaultCategories();
  return prisma.category.findMany({ orderBy: { name: "asc" } });
};
