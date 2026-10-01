import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";
import { fetchItems } from "./api/items";

vi.mock("./api/items", async () => {
  const actual =
    await vi.importActual<typeof import("./api/items")>("./api/items");
  return {
    ...actual,
    fetchItems: vi.fn(),
  };
});

describe("App", () => {
  it("取得したアイテムのタイトルが一覧に表示される", async () => {
    vi.mocked(fetchItems).mockResolvedValue([
      {
        id: 1,
        title: "テスト用のアイテム",
        note: "",
        rating: 3,
        status: "open",
        tags: [],
        allowedTransitions: ["doing"],
      },
    ]);

    render(<App />);

    expect(await screen.findByText("テスト用のアイテム")).toBeInTheDocument();
  });
});
