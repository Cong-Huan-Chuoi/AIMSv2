/*
  Warnings:

  - Changed the type of `provider` on the `social_account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `status` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "social_provier_enum" AS ENUM ('facebook', 'google');

-- AlterTable
ALTER TABLE "social_account" DROP COLUMN "provider",
ADD COLUMN     "provider" "social_provier_enum" NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "status" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "uq_sa_provider_account" ON "social_account"("provider", "provider_account_id");
