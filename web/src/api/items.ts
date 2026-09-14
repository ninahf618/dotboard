const BASE_URL = "http://localhost:3000";

export type Status = "open" | "doing" | "done";

export type Item = {
  id: number;
  title: string;
  note: string;
  rating: number;
  status: Status;
  allowedTransitions: Status[];
};

export type NewItem = {
  title: string;
  note: string;
  rating: number;
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`リクエストに失敗しました (status: ${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${BASE_URL}/items`);
  return handleResponse<Item[]>(res);
}

export async function createItem(input: NewItem): Promise<Item> {
  const res = await fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, status: "open" }),
  });
  return handleResponse<Item>(res);
}

export async function updateItemStatus(
  id: number,
  status: Status,
): Promise<Item> {
  const res = await fetch(`${BASE_URL}/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return handleResponse<Item>(res);
}

export async function deleteItem(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/items/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`削除に失敗しました (status: ${res.status})`);
  }
}
