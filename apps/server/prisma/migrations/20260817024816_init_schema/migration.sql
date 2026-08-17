-- CreateEnum
CREATE TYPE "category_enum" AS ENUM ('Book', 'DVDs', 'LP', 'CDs');

-- CreateEnum
CREATE TYPE "cover_type_enum" AS ENUM ('hardcover', 'paperback');

-- CreateEnum
CREATE TYPE "disc_type_enum" AS ENUM ('blu-ray', 'hd-dvd');

-- CreateEnum
CREATE TYPE "gender_enum" AS ENUM ('male', 'female', 'unknown');

-- CreateEnum
CREATE TYPE "order_status_enum" AS ENUM ('unpaid', 'processed', 'canceled', 'completed', 'pending');

-- CreateEnum
CREATE TYPE "payment_method_enum" AS ENUM ('cash', 'vnpay');

-- CreateEnum
CREATE TYPE "role_enum" AS ENUM ('Admin', 'Product Manager', 'Customer');

-- CreateEnum
CREATE TYPE "user_status_enum" AS ENUM ('Active', 'Blocked');

-- CreateTable
CREATE TABLE "book" (
    "id" UUID NOT NULL,
    "authors" VARCHAR(50) NOT NULL,
    "cover_type" "cover_type_enum" NOT NULL,
    "publisher" VARCHAR(50) NOT NULL,
    "publish_date" DATE,
    "pages" INTEGER,
    "language" VARCHAR(20),

    CONSTRAINT "pk_book" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_price" INTEGER,

    CONSTRAINT "pk_cart" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_detail" (
    "cart_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity" INTEGER,

    CONSTRAINT "pk_cart_detail" PRIMARY KEY ("cart_id","product_id")
);

-- CreateTable
CREATE TABLE "cds" (
    "id" UUID NOT NULL,
    "artist" VARCHAR(50) NOT NULL,
    "record_label" VARCHAR(30) NOT NULL,
    "track_count" INTEGER,
    "runtime" INTEGER,
    "release_date" DATE,

    CONSTRAINT "pk_cds" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dvds" (
    "id" UUID NOT NULL,
    "disc_type" "disc_type_enum" NOT NULL,
    "director" VARCHAR(50) NOT NULL,
    "runtime" INTEGER NOT NULL,
    "studio" VARCHAR(50) NOT NULL,
    "language" VARCHAR(20) NOT NULL,
    "subtitle" VARCHAR(20) NOT NULL,
    "release_date" DATE,

    CONSTRAINT "pk_dvds" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genre" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(20) NOT NULL,

    CONSTRAINT "pk_genre" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lp" (
    "id" UUID NOT NULL,
    "artist" VARCHAR(50) NOT NULL,
    "record_label" VARCHAR(30) NOT NULL,
    "track_count" INTEGER,
    "runtime" INTEGER,
    "release_date" DATE,

    CONSTRAINT "pk_lp" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity" INTEGER,
    "price" INTEGER,

    CONSTRAINT "pk_order_detail" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "recipient_name" VARCHAR(30),
    "phone_num" VARCHAR(15),
    "email" VARCHAR(30),
    "province" VARCHAR(20),
    "delivery_address" VARCHAR(50),
    "is_rush_order" BOOLEAN DEFAULT false,
    "rush_delivery_intruction" VARCHAR(100),
    "rush_delivery_time" TIMESTAMPTZ(6),
    "total_price_excl_vat" INTEGER,
    "total_price_incl_vat" INTEGER,
    "regular_delivery_fee" INTEGER,
    "rush_delivery_fee" INTEGER,
    "delivery_fee" INTEGER,
    "total_amount" INTEGER,
    "payment_method" "payment_method_enum",
    "payment_status" "order_status_enum",
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipient_name_tsv" tsvector,

    CONSTRAINT "pk_orders" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(100),
    "product_value" INTEGER,
    "price" INTEGER,
    "category" "category_enum",
    "quantity" INTEGER,
    "warehouse_entry_date" DATE,
    "dimensions" VARCHAR(30),
    "barcode" INTEGER,
    "image_url" VARCHAR(100),
    "description" VARCHAR(500),
    "weight" INTEGER,
    "vat" INTEGER DEFAULT 10,
    "support_rush_delivery" BOOLEAN DEFAULT false,
    "title_tsv" tsvector,

    CONSTRAINT "pk_product" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_genres" (
    "product_id" UUID NOT NULL,
    "genre_id" UUID NOT NULL,

    CONSTRAINT "pk_product_genres" PRIMARY KEY ("product_id","genre_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name_role" "role_enum" NOT NULL,
    "role_num" INTEGER,

    CONSTRAINT "pk_roles" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "refresh_token" VARCHAR(128),
    "device_info" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_session" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_account" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "provider" VARCHAR(20),
    "provider_account_id" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_social_account" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "song_tile" VARCHAR(50),
    "length" INTEGER,

    CONSTRAINT "pk_track" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "transaction_no" VARCHAR(15) NOT NULL,
    "txn_ref" VARCHAR(100) NOT NULL,
    "bank_code" VARCHAR(20),
    "bank_trans_no" VARCHAR(50),
    "card_type" VARCHAR(15),
    "order_info" VARCHAR(255),
    "pay_date" VARCHAR(14),
    "transaction_status" VARCHAR(20),
    "response_code" VARCHAR(10),
    "customer_name" VARCHAR(30),
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_transactions" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "pk_user_roles" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fullname" VARCHAR(30) NOT NULL,
    "date_of_birth" DATE,
    "phone_num" VARCHAR(20),
    "gender" "gender_enum",
    "status" BOOLEAN DEFAULT false,
    "avatar_url" VARCHAR(100),
    "email" VARCHAR(50),
    "password_hash" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_search_tsv" tsvector,

    CONSTRAINT "pk_users" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_cart_session_id" ON "cart"("session_id");

-- CreateIndex
CREATE INDEX "idx_cd_cart_id" ON "cart_detail"("cart_id");

-- CreateIndex
CREATE INDEX "idx_cd_product_id" ON "cart_detail"("product_id");

-- CreateIndex
CREATE INDEX "idx_od_order_id" ON "order_detail"("order_id");

-- CreateIndex
CREATE INDEX "idx_orders_email" ON "orders"("email");

-- CreateIndex
CREATE INDEX "idx_orders_recipient_tsv" ON "orders" USING GIN ("recipient_name_tsv");

-- CreateIndex
CREATE INDEX "idx_orders_session_id" ON "orders"("session_id");

-- CreateIndex
CREATE INDEX "idx_product_title_tsv" ON "product" USING GIN ("title_tsv");

-- CreateIndex
CREATE INDEX "idx_pg_genre_id" ON "product_genres"("genre_id");

-- CreateIndex
CREATE INDEX "idx_pg_product_id" ON "product_genres"("product_id");

-- CreateIndex
CREATE INDEX "idx_session_user_id" ON "session"("user_id");

-- CreateIndex
CREATE INDEX "idx_sa_user_id" ON "social_account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_txn_ref_key" ON "transactions"("txn_ref");

-- CreateIndex
CREATE INDEX "idx_trans_order_id" ON "transactions"("order_id");

-- CreateIndex
CREATE INDEX "idx_ur_role_id" ON "user_roles"("role_id");

-- CreateIndex
CREATE INDEX "idx_ur_user_id" ON "user_roles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_search_tsv" ON "users" USING GIN ("user_search_tsv");

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "fk_book_product" FOREIGN KEY ("id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "fk_cart_session" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_detail" ADD CONSTRAINT "fk_cd_cart" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_detail" ADD CONSTRAINT "fk_cd_product" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cds" ADD CONSTRAINT "fk_cds_product" FOREIGN KEY ("id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dvds" ADD CONSTRAINT "fk_dvds_product" FOREIGN KEY ("id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lp" ADD CONSTRAINT "fk_lp_product" FOREIGN KEY ("id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_detail" ADD CONSTRAINT "fk_od_order" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_detail" ADD CONSTRAINT "fk_od_product" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_session" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_genres" ADD CONSTRAINT "fk_pg_genre" FOREIGN KEY ("genre_id") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_genres" ADD CONSTRAINT "fk_pg_product" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "fk_session_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "social_account" ADD CONSTRAINT "fk_sa_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "track" ADD CONSTRAINT "fk_track_product" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "fk_trans_order" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "fk_ur_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "fk_ur_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
