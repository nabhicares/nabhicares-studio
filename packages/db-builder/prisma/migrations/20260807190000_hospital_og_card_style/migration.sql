-- Share card image source preference (hero photo | brand color | custom URL).
ALTER TABLE "Hospital" ADD COLUMN IF NOT EXISTS "ogCardStyle" TEXT DEFAULT 'hero';
