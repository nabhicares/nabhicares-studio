-- Social share card image (WhatsApp / Meta / Twitter). Optional override URL.
ALTER TABLE "Hospital" ADD COLUMN IF NOT EXISTS "ogImage" TEXT;
