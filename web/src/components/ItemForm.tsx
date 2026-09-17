import { useState } from "react";
import type { SubmitEvent } from "react";
import type { NewItem } from "../api/items";

type Props = {
  onCreate: (input: NewItem) => void;
};

export function ItemForm({ onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [rating, setRating] = useState(3);
  const [tagsInput, setTagsInput] = useState("");

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (title.trim() === "") return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    onCreate({ title, note, rating, tags });
    setTitle("");
    setNote("");
    setRating(3);
    setTagsInput("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-2 mb-6"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="メモ"
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
      <input
        type="text"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        placeholder="ラベル（カンマ区切り）"
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
      >
        追加する
      </button>
    </form>
  );
}
