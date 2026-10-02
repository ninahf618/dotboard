import { useState } from "react";
import type { Item, Status } from "../api/items";
import { CommentSection } from "./CommentSection";

type Props = {
  items: Item[];
  onChangeStatus: (id: number, status: Status) => void;
  onDelete: (id: number) => void;
};

const STATUS_LABEL: Record<Status, string> = {
  open: "未視聴",
  doing: "視聴中",
  done: "視聴済み",
};

function renderStars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export function ItemList({ items, onChangeStatus, onDelete }: Props) {
  // コメントを開いているアイテム。一覧が混雑しないよう、開くのは一度に1件だけにする
  const [openItemId, setOpenItemId] = useState<number | null>(null);

  if (items.length === 0) {
    return <p>タイトルはまだありません。</p>;
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <button
            type="button"
            onClick={() =>
              setOpenItemId((prev) => (prev === item.id ? null : item.id))
            }
            aria-expanded={openItemId === item.id}
            className="font-bold mb-1 text-left hover:underline"
          >
            {item.title}
          </button>
          <p className="text-amber-500">{renderStars(item.rating)}</p>
          <p className="text-gray-600">{item.note}</p>
          <p>{STATUS_LABEL[item.status]}</p>
          <div className="flex flex-wrap gap-1 mb-1">
            {item.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
              >
                {tag.name}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {item.allowedTransitions.map((next) => (
              <button
                key={next}
                type="button"
                onClick={() => onChangeStatus(item.id, next)}
                className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-sm hover:bg-gray-100"
              >
                {STATUS_LABEL[next]}にする
              </button>
            ))}
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-sm hover:bg-gray-100 text-red-600"
            >
              削除
            </button>
          </div>
          {openItemId === item.id && <CommentSection itemId={item.id} />}
        </li>
      ))}
    </ul>
  );
}
