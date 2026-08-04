-- Content schema version + SEO + publish attestation
ALTER TABLE "Hospital" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT;
ALTER TABLE "Hospital" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;

ALTER TABLE "Page" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT;
ALTER TABLE "Page" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;

ALTER TABLE "Section" ADD COLUMN IF NOT EXISTS "contentSchemaVersion" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Publish" ADD COLUMN IF NOT EXISTS "approvedBy" TEXT;
ALTER TABLE "Publish" ADD COLUMN IF NOT EXISTS "reviewNote" TEXT;
