-- CreateEnum
CREATE TYPE "PipelineStatus" AS ENUM ('DEMO', 'ACCEPTED', 'DECLINED', 'TRASHED');

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "placeLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtensionToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT 'Chrome extension',
    "tokenHash" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "ExtensionToken_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN "pipelineStatus" "PipelineStatus" NOT NULL DEFAULT 'DEMO';
ALTER TABLE "Hospital" ADD COLUMN "trashedAt" TIMESTAMP(3);
ALTER TABLE "Hospital" ADD COLUMN "campaignId" TEXT;
ALTER TABLE "Hospital" ADD COLUMN "mapsUrl" TEXT;
ALTER TABLE "Hospital" ADD COLUMN "notes" TEXT;
ALTER TABLE "Hospital" ADD COLUMN "contactedAt" TIMESTAMP(3);

-- Demo sites should not index by default going forward (existing rows keep their value)
ALTER TABLE "Hospital" ALTER COLUMN "seoIndex" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "ExtensionToken_tokenHash_key" ON "ExtensionToken"("tokenHash");
CREATE INDEX "ExtensionToken_userId_idx" ON "ExtensionToken"("userId");
CREATE INDEX "Hospital_pipelineStatus_trashedAt_idx" ON "Hospital"("pipelineStatus", "trashedAt");
CREATE INDEX "Hospital_campaignId_idx" ON "Hospital"("campaignId");

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ExtensionToken" ADD CONSTRAINT "ExtensionToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
