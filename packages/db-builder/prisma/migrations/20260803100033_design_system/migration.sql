-- CreateTable
CREATE TABLE "DesignSystem" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "tokens" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignSystem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DesignSystem_hospitalId_key" ON "DesignSystem"("hospitalId");

-- AddForeignKey
ALTER TABLE "DesignSystem" ADD CONSTRAINT "DesignSystem_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
