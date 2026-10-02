import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CommentSection } from "./CommentSection";
import { fetchComments, createComment } from "../api/comments";

vi.mock("../api/comments", () => ({
  fetchComments: vi.fn(),
  createComment: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CommentSection", () => {
  it("取得したコメントの名前と本文が表示される", async () => {
    vi.mocked(fetchComments).mockResolvedValue([
      { id: 1, itemId: 1, author: "ninah", content: "面白かった" },
    ]);

    render(<CommentSection itemId={1} />);

    expect(await screen.findByText("ninah")).toBeInTheDocument();
    expect(screen.getByText("面白かった")).toBeInTheDocument();
    expect(fetchComments).toHaveBeenCalledWith(1);
  });

  it("コメントがなければその旨を表示する", async () => {
    vi.mocked(fetchComments).mockResolvedValue([]);

    render(<CommentSection itemId={1} />);

    expect(
      await screen.findByText("コメントはまだありません。"),
    ).toBeInTheDocument();
  });

  it("投稿したコメントが一覧に追加される", async () => {
    vi.mocked(fetchComments).mockResolvedValue([]);
    vi.mocked(createComment).mockResolvedValue({
      id: 2,
      itemId: 1,
      author: "ninah",
      content: "また観たい",
    });

    render(<CommentSection itemId={1} />);
    await screen.findByText("コメントはまだありません。");

    fireEvent.change(screen.getByLabelText("名前"), {
      target: { value: "ninah" },
    });
    fireEvent.change(screen.getByLabelText("コメント"), {
      target: { value: "また観たい" },
    });
    fireEvent.click(screen.getByRole("button", { name: "コメントする" }));

    expect(await screen.findByText("また観たい")).toBeInTheDocument();
    expect(createComment).toHaveBeenCalledWith(1, {
      author: "ninah",
      content: "また観たい",
    });
  });

  it("名前が空なら投稿しない", async () => {
    vi.mocked(fetchComments).mockResolvedValue([]);

    render(<CommentSection itemId={1} />);
    await screen.findByText("コメントはまだありません。");

    fireEvent.change(screen.getByLabelText("コメント"), {
      target: { value: "また観たい" },
    });
    fireEvent.click(screen.getByRole("button", { name: "コメントする" }));

    expect(createComment).not.toHaveBeenCalled();
  });
});
