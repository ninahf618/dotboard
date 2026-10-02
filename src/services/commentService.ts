import { commentRepository } from "../repositories/commentRepository.js";
import { itemRepository } from "../repositories/itemRepository.js";
import { NotFoundError } from "../errors.js";
import type { CreateCommentInput } from "../schema.js";

// 存在しないアイテムへのコメントは404にする。確認しないと一覧は空配列、投稿は外部キー違反の500になる
async function assertItemExists(itemId: number) {
  const item = await itemRepository.findById(itemId);
  if (!item) throw new NotFoundError(`Item ${itemId} not found`);
}

export const commentService = {
  async list(itemId: number) {
    await assertItemExists(itemId);
    return commentRepository.findManyByItemId(itemId);
  },

  async create(itemId: number, data: CreateCommentInput) {
    await assertItemExists(itemId);
    return commentRepository.create({ itemId, ...data });
  },
};
