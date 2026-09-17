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

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems()
      .then(setItems)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "読み込みに失敗しました"),
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(input: NewItem) {
    try {
      const created = await createItem(input);
      setItems((prev) => [...prev, created]);
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
