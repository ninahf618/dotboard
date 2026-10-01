import { prisma } from "../db.js";
import type { Item, Prisma, Tag } from "../generated/prisma/client.js";
import type { Status } from "../types.js";

export type ItemWithTags = Item & { tags: Tag[] };

function toTagConnect(tags: string[] | undefined) {
  if (!tags) return undefined;
  return {
    connectOrCreate: tags.map((name) => ({
      where: { name },
      create: { name },
    })),
  };
}

export const itemRepository = {
  findMany(params?: {
    tag?: string;
    status?: Status;
    sort?: "id" | "rating";
  }): Promise<ItemWithTags[]> {
    const { tag, status, sort } = params ?? {};
    return prisma.item.findMany({
      where: {
        ...(tag ? { tags: { some: { name: tag } } } : {}),
        ...(status ? { status } : {}),
      },
      orderBy: sort === "rating" ? { rating: "desc" } : { id: "asc" },
      include: { tags: true },
    });
  },
  findById(id: number): Promise<ItemWithTags | null> {
    return prisma.item.findUnique({ where: { id }, include: { tags: true } });
  },
  create(
    data: Prisma.ItemUncheckedCreateInput & { tags?: string[] },
  ): Promise<ItemWithTags> {
    const { tags, ...rest } = data;
    return prisma.item.create({
      data: { ...rest, tags: toTagConnect(tags) },
      include: { tags: true },
    });
  },
  update(
    id: number,
    data: Prisma.ItemUpdateInput & { tags?: string[] },
  ): Promise<ItemWithTags> {
    const { tags, ...rest } = data;
    return prisma.item.update({
      where: { id },
      data: {
        ...rest,
        tags: tags ? { set: [], ...toTagConnect(tags) } : undefined,
      },
      include: { tags: true },
    });
  },
  delete(id: number): Promise<Item> {
    return prisma.item.delete({ where: { id } });
  },
};
