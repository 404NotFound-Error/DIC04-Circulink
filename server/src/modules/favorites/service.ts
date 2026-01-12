import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { normalizePagination } from "../../utils/pagination.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../../utils/errors.js";

export const listFavorites = async (userId: string, page?: number, pageSize?: number) => {
  const { skip, take, page: currentPage, pageSize: currentSize } = normalizePagination({ page, pageSize });
  const where = { userId };
  const [favorites, total] = await prisma.$transaction([
    prisma.favorite.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        item: {
          include: {
            category: true,
            seller: { select: { id: true, email: true, name: true } }
          }
        }
      }
    }),
    prisma.favorite.count({ where })
  ]);
  return { favorites, total, page: currentPage, pageSize: currentSize };
};

export const addFavorite = async (userId: string, itemId: string) => {
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) throw new NotFoundError("Item not found");
  try {
    return await prisma.favorite.create({ data: { userId, itemId } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new ConflictError("Item already in favorites");
    }
    throw err;
  }
};

export const removeFavorite = async (userId: string, favoriteId: string) => {
  const favorite = await prisma.favorite.findUnique({ where: { id: favoriteId } });
  if (!favorite) throw new NotFoundError("Favorite not found");
  if (favorite.userId !== userId) throw new ForbiddenError();
  await prisma.favorite.delete({ where: { id: favoriteId } });
};
