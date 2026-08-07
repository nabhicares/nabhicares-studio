-- Allow/deny search indexing via Social settings (robots.txt).
ALTER TABLE "Hospital" ADD COLUMN IF NOT EXISTS "seoIndex" BOOLEAN NOT NULL DEFAULT true;
