import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { normalizePagination } from "../../utils/pagination.js";
import { NotFoundError } from "../../utils/errors.js";
import { serializeImages, withParsedImages } from "../../utils/images.js";
import {
  DONATION_DESCRIPTION_PREFIX,
  isDonationDescription,
  toDonationDescription,
  toDonationTitle
} from "./utils.js";

type DonationListInput = {
  q?: string;
  categoryId?: string;
  sellerId?: string;
  page?: number;
  pageSize?: number;
};

type CreateDonationInput = {
  description: string;
  categoryId: string;
  images: string[];
};

export const listDonations = async (filters: DonationListInput) => {
  const { page, pageSize, skip, take } = normalizePagination(filters);
  const where: Prisma.ItemWhereInput = {
    description: { startsWith: DONATION_DESCRIPTION_PREFIX }
  };

  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.sellerId) where.sellerId = filters.sellerId;
  if (filters.q) {
    where.OR = [{ title: { contains: filters.q } }, { description: { contains: filters.q } }];
  }

  const [items, total] = await prisma.$transaction([
    prisma.item.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        category: true,
        seller: { select: { id: true, email: true, name: true } }
      }
    }),
    prisma.item.count({ where })
  ]);

  return {
    items: items.map(withParsedImages),
    total,
    page,
    pageSize
  };
};

export const getDonationById = async (id: string) => {
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      category: true,
      seller: { select: { id: true, email: true, name: true } }
    }
  });

  if (!item || !isDonationDescription(item.description)) {
    throw new NotFoundError("Donation not found");
  }

  return withParsedImages(item);
};

export const createDonation = async (sellerId: string, data: CreateDonationInput) => {
  const description = data.description.trim();
  const item = await prisma.item.create({
    data: {
      title: toDonationTitle(description),
      description: toDonationDescription(description),
      price: 0,
      condition: "GOOD",
      status: "ACTIVE",
      categoryId: data.categoryId,
      images: serializeImages(data.images),
      sellerId
    },
    include: {
      category: true,
      seller: { select: { id: true, email: true, name: true } }
    }
  });

  return withParsedImages(item);
};

