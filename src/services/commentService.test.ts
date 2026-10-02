import { describe, it, expect, vi, beforeEach } from "vitest";
import { commentService } from "./commentService.js";
import { commentRepository } from "../repositories/commentRepository.js";
import { itemRepository } from "../repositories/itemRepository.js";
import { NotFoundError } from "../errors.js";

vi.mock("../repositories/commentRepository.js", () => ({
  commentRepository: {
    findManyByItemId: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../repositories/itemRepository.js", () => ({
  itemRepository: {
    findById: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("commentService.list", () => {
  it("アイテムのコメント一覧を返す", async () => {
    const comments = [
      { id: 1, itemId: 1, author: "ninah", content: "面白かった" },
    ];
    vi.mocked(itemRepository.findById).mockResolvedValue({ id: 1 } as never);
    vi.mocked(commentRepository.findManyByItemId).mockResolvedValue(comments);

    const result = await commentService.list(1);

    expect(result).toEqual(comments);
    expect(commentRepository.findManyByItemId).toHaveBeenCalledWith(1);
  });

  it("存在しないアイテムならNotFoundErrorを投げる", async () => {
    vi.mocked(itemRepository.findById).mockResolvedValue(null);

    await expect(commentService.list(999)).rejects.toThrow(NotFoundError);
  });
});

describe("commentService.create", () => {
  it("itemIdを付けてrepositoryのcreateに渡す", async () => {
    const created = { id: 1, itemId: 1, author: "ninah", content: "面白かった" };
    vi.mocked(itemRepository.findById).mockResolvedValue({ id: 1 } as never);
    vi.mocked(commentRepository.create).mockResolvedValue(created);

    const result = await commentService.create(1, {
      author: "ninah",
      content: "面白かった",
    });

    expect(result).toEqual(created);
    expect(commentRepository.create).toHaveBeenCalledWith({
      itemId: 1,
      author: "ninah",
      content: "面白かった",
    });
  });

  it("存在しないアイテムならNotFoundErrorを投げ、コメントは作らない", async () => {
    vi.mocked(itemRepository.findById).mockResolvedValue(null);

    await expect(
      commentService.create(999, { author: "ninah", content: "面白かった" }),
    ).rejects.toThrow(NotFoundError);
    expect(commentRepository.create).not.toHaveBeenCalled();
  });
});
