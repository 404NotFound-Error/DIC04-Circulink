import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { normalizePagination } from "../../utils/pagination.js";
import { withParsedImages } from "../../utils/images.js";
import { isDonationDescription } from "../donations/utils.js";

// Define OrderStatus as string constants since SQLite doesn't support enums
type OrderStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";

const allowedTransitions: Record<OrderStatus, { buyer: OrderStatus[]; seller: OrderStatus[] }> = {
  PENDING: { buyer: ["CANCELLED"], seller: ["ACCEPTED", "REJECTED"] },
  ACCEPTED: { buyer: ["PAID", "CANCELLED"], seller: [] },
  REJECTED: { buyer: [], seller: [] },
  PAID: { buyer: ["CANCELLED"], seller: ["SHIPPED"] },
  SHIPPED: { buyer: ["COMPLETED"], seller: [] },
  COMPLETED: { buyer: [], seller: [] },
  CANCELLED: { buyer: [], seller: [] }
};

const getRole = (order: { buyerId: string; sellerId: string }, userId: string) => {
  if (order.buyerId === userId) return "buyer" as const;
  if (order.sellerId === userId) return "seller" as const;
  throw new ForbiddenError();
};

export const createOrder = async (buyerId: string, data: { itemId: string; total?: number }) => {
  const item = await prisma.item.findUnique({ where: { id: data.itemId } });
  if (!item) throw new NotFoundError("Item not found");
  if (isDonationDescription(item.description)) throw new ForbiddenError("Donation item is not for sale");
  if (item.sellerId === buyerId) throw new ForbiddenError("Cannot order own item");
  if (item.status !== "ACTIVE") throw new ForbiddenError("Item not available");

  const total = data.total ?? Number(item.price);
  return prisma.order.create({
    data: {
      itemId: item.id,
      buyerId,
      sellerId: item.sellerId,
      status: "PENDING",
      total
    }
  });
};

export const listOrders = async (
  userId: string,
  params: { role?: "buyer" | "seller"; status?: OrderStatus; page?: number; pageSize?: number }
) => {
  const { skip, take, page, pageSize } = normalizePagination(params);
  const where: Prisma.OrderWhereInput = {
    OR:
      params.role === "buyer"
        ? [{ buyerId: userId }]
        : params.role === "seller"
          ? [{ sellerId: userId }]
          : [{ buyerId: userId }, { sellerId: userId }],
    ...(params.status ? { status: params.status } : {})
  };

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        item: { select: { id: true, title: true, price: true, images: true } },
        buyer: { select: { id: true, email: true, name: true } },
        seller: { select: { id: true, email: true, name: true } }
      }
    }),
    prisma.order.count({ where })
  ]);

  return {
    orders: orders.map((order) => ({
      ...order,
      item: withParsedImages(order.item)
    })),
    total,
    page,
    pageSize
  };
};

export const updateOrderStatus = async (userId: string, orderId: string, nextStatus: OrderStatus) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new NotFoundError("Order not found");

  const role = getRole(order, userId);
  const allowed = allowedTransitions[order.status as OrderStatus][role];
  if (!allowed.includes(nextStatus)) {
    throw new ForbiddenError(`Cannot change status from ${order.status} to ${nextStatus} as ${role}`);
  }

  return prisma.order.update({ where: { id: orderId }, data: { status: nextStatus } });
};

export const getOrderById = async (userId: string, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      item: { select: { id: true, title: true, price: true, images: true } },
      buyer: { select: { id: true, email: true, name: true } },
      seller: { select: { id: true, email: true, name: true } }
    }
  });

  if (!order) throw new NotFoundError("Order not found");
  if (order.buyerId !== userId && order.sellerId !== userId) throw new ForbiddenError();

  return {
    ...order,
    item: withParsedImages(order.item)
  };
};
