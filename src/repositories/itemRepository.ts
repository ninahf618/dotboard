import { prisma } from "../db.js";
import type { Item, Prisma, Tag } from "../generated/prisma/client.js";

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
  findMany(tag?: string): Promise<ItemWithTags[]> {
    return prisma.item.findMany({
      where: tag ? { tags: { some: { name: tag } } } : undefined,
      orderBy: { id: "asc" },
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
  async replaceTags(itemId: number, tagIds: number[]): Promise<void> {
    await prisma.$transaction([
      prisma.item.update({
        where: { id: itemId },
        data: { tags: { set: [] } },
      }),
      prisma.item.update({
        where: { id: itemId },
        data: { tags: { connect: tagIds.map((id) => ({ id })) } },
      }),
    ]);
  },

  delete(id: number): Promise<Item> {
    return prisma.item.delete({ where: { id } });
  },
};
