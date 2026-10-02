import { describe, it, expect, vi, beforeEach } from "vitest";
import { itemService } from "./itemService.js";
import { itemRepository } from "../repositories/itemRepository.js";
import { NotFoundError, TransitionError } from "../errors.js";

vi.mock("../repositories/itemRepository.js", () => ({
  itemRepository: {
    findMany: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("itemService.list", () => {
  it("各アイテムにallowedTransitionsを付けて返す", async () => {
    const found = [
      { id: 1, title: "a", note: "", rating: 3, status: "open", tags: [] },
      { id: 2, title: "b", note: "", rating: 4, status: "done", tags: [] },
    ];
    vi.mocked(itemRepository.findMany).mockResolvedValue(found as never);

    const result = await itemService.list();

    expect(result).toEqual([
      { ...found[0], allowedTransitions: ["doing"] },
      { ...found[1], allowedTransitions: ["doing"] },
    ]);
  });
});

describe("itemService.create", () => {
  it("repositoryのcreateにそのままdataを渡す", async () => {
    const created = {
      id: 1,
      title: "test",
      note: "",
      rating: 3,
      status: "open",
      tags: [],
    };
    vi.mocked(itemRepository.create).mockResolvedValue(created as never);

    const result = await itemService.create({
      title: "test",
      note: "",
      rating: 3,
      status: "open",
    } as never);

    expect(result).toEqual({ ...created, allowedTransitions: ["doing"] });
  });
});

describe("itemService.update", () => {
  it("存在しないIDならNotFoundErrorを投げる", async () => {
    vi.mocked(itemRepository.findById).mockResolvedValue(null);

    await expect(
      itemService.update(999, { status: "doing" } as never),
    ).rejects.toThrow(NotFoundError);
  });

  it("許可されない遷移ならTransitionErrorを投げる", async () => {
    vi.mocked(itemRepository.findById).mockResolvedValue({
      id: 1,
      status: "open",
    } as never);

    await expect(
      itemService.update(1, { status: "done" } as never),
    ).rejects.toThrow(TransitionError);
  });
});
