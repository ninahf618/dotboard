import { useEffect, useState } from "react";
import {
  fetchItems,
  createItem,
  updateItemStatus,
  deleteItem,
} from "./api/items";
import type { Item, NewItem, Status } from "./api/items";
import { ItemList } from "./components/ItemList";
import { ItemForm } from "./components/ItemForm";
import { TagFilter } from "./components/TagFilter";

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | undefined>(undefined);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchItems().then((all) => {
      const names = all.flatMap((item) => item.tags.map((t) => t.name));
      setAllTags(Array.from(new Set(names)));
    });
  }, []);

  function handleSelectTag(tag: string | undefined) {
    setLoading(true);
    setActiveTag(tag);
  }
  useEffect(() => {
    fetchItems(activeTag)
      .then(setItems)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "読み込みに失敗しました"),
      )
      .finally(() => setLoading(false));
  }, [activeTag]);

  async function handleCreate(input: NewItem) {
    try {
      const created = await createItem(input);
      setItems((prev) => [...prev, created]);
      setAllTags((prev) =>
        Array.from(new Set([...prev, ...created.tags.map((t) => t.name)])),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "作成に失敗しました");
    }
  }

  async function handleChangeStatus(id: number, status: Status) {
    try {
      const updated = await updateItemStatus(id, status);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "更新に失敗しました");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "削除に失敗しました");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-4">タスクボード</h1>
      {error && <p>失敗しました: {error}</p>}
      <ItemForm onCreate={handleCreate} />
      <TagFilter
        tags={allTags}
        activeTag={activeTag}
        onSelect={handleSelectTag}
      />
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <ItemList
          items={items}
          onChangeStatus={handleChangeStatus}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;
