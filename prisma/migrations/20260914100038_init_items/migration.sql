-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "rating" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);
