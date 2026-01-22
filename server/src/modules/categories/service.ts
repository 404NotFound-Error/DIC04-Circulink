import { prisma } from "../../lib/prisma.js";

export const listCategories = async () => {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
};
