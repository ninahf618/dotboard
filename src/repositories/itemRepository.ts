import { prisma } from "../db.js";
import type { Item, Prisma } from "../generated/prisma/client.js";

export const itemRepository = {
  findMany(): Promise<Item[]> {
    return prisma.item.findMany({ orderBy: { id: "asc" } });
  },
  findById(id: number): Promise<Item | null> {
    return prisma.item.findUnique({ where: { id } });
  },
  create(data: Prisma.ItemCreateInput): Promise<Item> {
    return prisma.item.create({ data });
  },
  update(id: number, data: Prisma.ItemUpdateInput): Promise<Item> {
    return prisma.item.update({ where: { id }, data });
  },
  delete(id: number): Promise<Item> {
    return prisma.item.delete({ where: { id } });
  },
};
