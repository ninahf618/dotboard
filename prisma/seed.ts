import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.item.deleteMany();
  await prisma.item.createMany({
    data: [
      {
        title: "千と千尋の神隠し",
        note: "週末に家族と観る",
        rating: 3,
        status: "open",
      },
      { title: "ブレイキング・バッド", note: "", rating: 4, status: "doing" },
      {
        title: "パラサイト 半地下の家族",
        note: "後半の展開が予想外だった",
        rating: 5,
        status: "done",
      },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
