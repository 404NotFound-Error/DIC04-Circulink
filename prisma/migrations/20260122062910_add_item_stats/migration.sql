/*
  Warnings:

  - The values [available,sold,reserved] on the enum `ItemStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [pending,accepted,paid,canceled,completed] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updatedAt` on the `Category` table. All the data in the column will be lost.
  - The primary key for the `Favorite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `Message` table. All the data in the column will be lost.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `price` on the `Order` table. All the data in the column will be lost.
  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `description` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `condition` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `body` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `threadId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('NEW', 'LIKE_NEW', 'GOOD', 'FAIR');

-- AlterEnum
BEGIN;
CREATE TYPE "ItemStatus_new" AS ENUM ('DRAFT', 'ACTIVE', 'SOLD', 'ARCHIVED');
ALTER TABLE "Item" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Item" ALTER COLUMN "status" TYPE "ItemStatus_new" USING ("status"::text::"ItemStatus_new");
ALTER TYPE "ItemStatus" RENAME TO "ItemStatus_old";
ALTER TYPE "ItemStatus_new" RENAME TO "ItemStatus";
DROP TYPE "ItemStatus_old";
ALTER TABLE "Item" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED');
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropIndex
DROP INDEX "Category_name_key";

-- DropIndex
DROP INDEX "Favorite_itemId_idx";

-- DropIndex
DROP INDEX "Favorite_userId_idx";

-- DropIndex
DROP INDEX "Message_itemId_idx";

-- DropIndex
DROP INDEX "Message_sender_receiver_idx";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "updatedAt",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "itemId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Item" DROP CONSTRAINT "Item_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2),
DROP COLUMN "condition",
ADD COLUMN     "condition" "Condition" NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
ALTER COLUMN "sellerId" SET DATA TYPE TEXT,
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey",
DROP COLUMN "content",
DROP COLUMN "itemId",
DROP COLUMN "readAt",
DROP COLUMN "receiverId",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "threadId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "senderId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "price",
ADD COLUMN     "total" DECIMAL(12,2) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "itemId" SET DATA TYPE TEXT,
ALTER COLUMN "buyerId" SET DATA TYPE TEXT,
ALTER COLUMN "sellerId" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "university" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "ItemCondition";

-- CreateTable
CREATE TABLE "MessageThread" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemView" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "viewerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemStats" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "lastViewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessageThread_itemId_buyerId_sellerId_key" ON "MessageThread"("itemId", "buyerId", "sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "ItemView_itemId_idx" ON "ItemView"("itemId");

-- CreateIndex
CREATE INDEX "ItemView_viewerId_idx" ON "ItemView"("viewerId");

-- CreateIndex
CREATE INDEX "ItemView_createdAt_idx" ON "ItemView"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ItemStats_itemId_key" ON "ItemStats"("itemId");

-- CreateIndex
CREATE INDEX "Item_condition_idx" ON "Item"("condition");

-- CreateIndex
CREATE INDEX "Item_price_idx" ON "Item"("price");

-- CreateIndex
CREATE INDEX "Item_categoryId_status_createdAt_idx" ON "Item"("categoryId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Message_threadId_idx" ON "Message"("threadId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageThread" ADD CONSTRAINT "MessageThread_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageThread" ADD CONSTRAINT "MessageThread_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageThread" ADD CONSTRAINT "MessageThread_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "MessageThread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemView" ADD CONSTRAINT "ItemView_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemView" ADD CONSTRAINT "ItemView_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemStats" ADD CONSTRAINT "ItemStats_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
