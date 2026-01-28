import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { normalizePagination } from "../../utils/pagination.js";
import { ForbiddenError, NotFoundError } from "../../utils/errors.js";

// Define types as string constants since SQLite doesn't support enums
type Condition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR";
type ItemStatus = "DRAFT" | "ACTIVE" | "SOLD" | "ARCHIVED";

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
      { title: { contains: filters.q } },
      { description: { contains: filters.q } }
    ];
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {
      ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
      ...(filters.maxPrice !== undefined && { lte: filters.maxPrice })
    };
  }

  const orderBy: Prisma.ItemOrderByWithRelationInput = filters.sort 
    ? (filters.sort === "price" 
        ? { price: filters.order ?? "desc" } 
        : { createdAt: filters.order ?? "desc" })
    : { createdAt: "desc" };

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
      title: data.title,
      description: data.description,
      price: data.price,
      condition: data.condition,
      status: data.status,
      categoryId: data.categoryId,
      images: JSON.stringify(data.images),
      sellerId
    }
  });
};

export const updateItem = async (id: string, userId: string, data: Partial<CreateItemInput>) => {
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) throw new NotFoundError("Item not found");
  if (item.sellerId !== userId) throw new ForbiddenError("Only the seller can update this item");

  const updateData: Prisma.ItemUpdateInput = {
    ...(data.title && { title: data.title }),
    ...(data.description && { description: data.description }),
    ...(data.price !== undefined && { price: data.price }),
    ...(data.condition && { condition: data.condition }),
    ...(data.status && { status: data.status }),
    ...(data.categoryId && { categoryId: data.categoryId }),
    ...(data.images && { images: JSON.stringify(data.images) })
  };

  return prisma.item.update({
    where: { id },
    data: updateData
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
