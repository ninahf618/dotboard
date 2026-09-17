import type { Item, Status } from "../api/items";

type Props = {
  items: Item[];
  onChangeStatus: (id: number, status: Status) => void;
  onDelete: (id: number) => void;
};

const STATUS_LABEL: Record<Status, string> = {
  open: "未着手",
  doing: "作業中",
  done: "完了",
};

function renderStars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export function ItemList({ items, onChangeStatus, onDelete }: Props) {
  if (items.length === 0) {
    return <p>タスクはまだありません。</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm mb-2"
        >
          <p className="font-bold mb-1">{item.title}</p>
          <p className="text-amber-500">{renderStars(item.rating)}</p>
          <p className="text-gray-600">{item.note}</p>
          <p>{STATUS_LABEL[item.status]}</p>
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
        </li>
      ))}
    </ul>
  );
}
