import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ItemList } from "./ItemList";
import type { Item } from "../api/items";
import { fetchComments } from "../api/comments";

vi.mock("../api/comments", () => ({
  fetchComments: vi.fn(),
  createComment: vi.fn(),
}));

const items: Item[] = [
  {
    id: 1,
    title: "テスト用のアイテム",
    note: "",
    rating: 3,
    status: "open",
    tags: [],
    allowedTransitions: ["doing"],
  },
];

describe("ItemList", () => {
  it("渡されたアイテムのタイトルが画面に表示される", () => {
    render(
      <ItemList items={items} onChangeStatus={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText("テスト用のアイテム")).toBeInTheDocument();
  });

  it("アイテムをクリックするまでコメントは取得も表示もしない", () => {
    render(
      <ItemList items={items} onChangeStatus={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(fetchComments).not.toHaveBeenCalled();
    expect(screen.queryByText("コメント")).not.toBeInTheDocument();
  });

  it("アイテムをクリックするとそのアイテムのコメントが表示される", async () => {
    vi.mocked(fetchComments).mockResolvedValue([
      { id: 1, itemId: 1, author: "ninah", content: "面白かった" },
    ]);
    render(
      <ItemList items={items} onChangeStatus={vi.fn()} onDelete={vi.fn()} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "テスト用のアイテム" }));

    expect(await screen.findByText("面白かった")).toBeInTheDocument();
    expect(fetchComments).toHaveBeenCalledWith(1);
  });
});
