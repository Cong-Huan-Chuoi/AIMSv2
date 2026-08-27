/*
  Warnings:

  - A unique constraint covering the columns `[provider,provider_account_id]` on the table `social_account` will be added. If there are existing duplicate values, this will fail.
  - Made the column `provider` on table `social_account` required. This step will fail if there are existing NULL values in that column.
  - Made the column `provider_account_id` on table `social_account` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "social_account" ALTER COLUMN "provider" SET NOT NULL,
ALTER COLUMN "provider_account_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "fullname" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "avatar_url" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password_hash" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "uq_sa_provider_account" ON "social_account"("provider", "provider_account_id");
