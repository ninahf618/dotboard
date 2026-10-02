import { prisma } from "../db.js";
import type { Comment } from "../generated/prisma/client.js";

export const commentRepository = {
  findManyByItemId(itemId: number): Promise<Comment[]> {
    return prisma.comment.findMany({
      where: { itemId },
      orderBy: { id: "asc" },
    });
  },
  create(data: {
    itemId: number;
    author: string;
    content: string;
  }): Promise<Comment> {
    return prisma.comment.create({ data });
  },
};
