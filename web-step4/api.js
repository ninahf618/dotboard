export const API_URL = 'http://localhost:3000/items'

export async function fetchItems() {
  const res = await fetch(API_URL)
  return res.json()
}

export async function createItem(item) {
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
}
