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
        title: "設計docを書く",
        note: "docs/api.md にエンドポイント一覧をまとめる",
        rating: 3,
        status: "open",
      },
      { title: "CORSを解決する", note: "", rating: 4, status: "doing" },
      {
        title: "READMEを書く",
        note: "起動手順を書く",
        rating: 2,
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
