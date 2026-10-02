import { handleResponse } from "./items";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type Comment = {
  id: number;
  itemId: number;
  author: string;
  content: string;
};

export type NewComment = {
  author: string;
  content: string;
};

export async function fetchComments(itemId: number): Promise<Comment[]> {
  const res = await fetch(`${BASE_URL}/items/${itemId}/comments`);
  return handleResponse<Comment[]>(res);
}

export async function createComment(
  itemId: number,
  input: NewComment,
): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/items/${itemId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<Comment>(res);
}
