import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { fetchComments, createComment } from "../api/comments";
import type { Comment } from "../api/comments";

type Props = {
  itemId: number;
};

const INPUT_CLASS =
  "rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900";

export function CommentSection({ itemId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchComments(itemId)
      .then(setComments)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "読み込みに失敗しました"),
      )
      .finally(() => setLoading(false));
  }, [itemId]);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (author.trim() === "" || content.trim() === "") return;

    try {
      const created = await createComment(itemId, { author, content });
      setComments((prev) => [...prev, created]);
      // 続けて投稿しやすいよう、名前は残してコメント文だけ消す
      setContent("");
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "投稿に失敗しました");
    }
  }

  return (
    <div className="mt-3 border-t border-gray-200 pt-3">
      <p className="text-sm font-bold mb-1">コメント</p>
      {error && <p className="text-sm text-red-600">失敗しました: {error}</p>}
      {loading ? (
        <p className="text-sm">読み込み中...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-600">コメントはまだありません。</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {comments.map((comment) => (
            <li key={comment.id} className="text-sm">
              <span className="font-bold">{comment.author}</span>
              <span className="text-gray-600">: </span>
              <span className="whitespace-pre-wrap">{comment.content}</span>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-3">
        <label className="text-sm text-gray-700" htmlFor={`author-${itemId}`}>
          名前
        </label>
        <input
          id={`author-${itemId}`}
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className={INPUT_CLASS}
        />
        <label className="text-sm text-gray-700" htmlFor={`content-${itemId}`}>
          コメント
        </label>
        <textarea
          id={`content-${itemId}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          className={INPUT_CLASS}
        />
        <button
          type="submit"
          className="self-start rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
        >
          コメントする
        </button>
      </form>
    </div>
  );
}
