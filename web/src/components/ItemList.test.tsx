import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ItemList } from "./ItemList";
import type { Item } from "../api/items";

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
});
