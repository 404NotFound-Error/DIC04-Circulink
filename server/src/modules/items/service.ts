import { Condition, ItemStatus, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { normalizePagination } from "../../utils/pagination.js";
import { ForbiddenError, NotFoundError } from "../../utils/errors.js";

export type ListItemsInput = {
  categoryId?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: Condition;
  status?: ItemStatus;
  sellerId?: string;
  sort?: "price" | "createdAt";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export const listItems = async (filters: ListItemsInput) => {
  const { page, pageSize, skip, take } = normalizePagination(filters);
  const where: Prisma.ItemWhereInput = {};

  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.sellerId) where.sellerId = filters.sellerId;
  if (filters.condition) where.condition = filters.condition;
  if (filters.status) where.status = filters.status;
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } }
    ];
  }
  if (filters.minPrice || filters.maxPrice) {
    where.price = {
      gte: filters.minPrice !== undefined ? new Prisma.Decimal(filters.minPrice) : undefined,
      lte: filters.maxPrice !== undefined ? new Prisma.Decimal(filters.maxPrice) : undefined
    };
  }

  const orderBy = filters.sort ? { [filters.sort]: filters.order ?? "desc" } : { createdAt: "desc" };

  const [items, total] = await prisma.$transaction([
    prisma.item.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        category: true,
        seller: { select: { id: true, email: true, name: true } }
      }
    }),
    prisma.item.count({ where })
  ]);

  return { items, total, page, pageSize };
};

export const getItemById = async (id: string) => {
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      category: true,
      seller: { select: { id: true, email: true, name: true } }
    }
  });
  if (!item) throw new NotFoundError("Item not found");
  return item;
};

export type CreateItemInput = {
  title: string;
  description: string;
  price: number;
  condition: Condition;
  status: ItemStatus;
  categoryId: string;
  images: string[];
};

export const createItem = async (sellerId: string, data: CreateItemInput) => {
  return prisma.item.create({
    data: {
      ...data,
      price: new Prisma.Decimal(data.price),
      sellerId
    }
  });
};

export const updateItem = async (id: string, userId: string, data: Partial<CreateItemInput>) => {
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) throw new NotFoundError("Item not found");
  if (item.sellerId !== userId) throw new ForbiddenError("Only the seller can update this item");

  return prisma.item.update({
    where: { id },
    data: {
      ...data,
      price: data.price !== undefined ? new Prisma.Decimal(data.price) : undefined
    }
  });
};

export const deleteItem = async (id: string, userId: string) => {
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) throw new NotFoundError("Item not found");
  if (item.sellerId !== userId) throw new ForbiddenError("Only the seller can delete this item");
  await prisma.$transaction([
    prisma.favorite.deleteMany({ where: { itemId: id } }),
    prisma.message.deleteMany({ where: { thread: { itemId: id } } }),
    prisma.messageThread.deleteMany({ where: { itemId: id } }),
    prisma.order.deleteMany({ where: { itemId: id } }),
    prisma.itemView.deleteMany({ where: { itemId: id } }),
    prisma.itemStats.deleteMany({ where: { itemId: id } }),
    prisma.item.delete({ where: { id } })
  ]);
};
