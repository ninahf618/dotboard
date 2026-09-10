import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { items, generateId, canTransition, nextStatuses } from './store.js'
import { createItemSchema, updateItemSchema } from './schema.js'
import { notFoundError, badRequestError } from './errors.js'
import type { Item } from './types.js'

const app = new Hono()

// APIに出す形に詰め替える。次に行ける状態は遷移の表から引いて付ける
const toItem = (item: Item) => ({ ...item, allowedTransitions: nextStatuses(item.status) })

items.push({
  id: generateId(),
  title: '設計docを書く',
  note: 'docs/api.md にエンドポイント一覧をまとめる',
  rating: 3,
  status: 'open',
})

app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

app.get('/items', (c) => {
  return c.json(items.map(toItem))
})

app.get('/items/:id', (c) => {
  const id = Number(c.req.param('id'))
  const item = items.find((i) => i.id === id)

  if (!item) {
    return notFoundError(c)
  }

  return c.json(toItem(item))
})

app.post('/items', async (c) => {
  const body = await c.req.json()
  const result = createItemSchema.safeParse(body)

  if (!result.success) {
    return badRequestError(c, result.error.issues)
  }

  const item = {
    id: generateId(),
    ...result.data,
  }
  items.push(item)

  return c.json(toItem(item), 201)
})

app.patch('/items/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const item = items.find((i) => i.id === id)

  if (!item) {
    return notFoundError(c)
  }

  const body = await c.req.json()
  const result = updateItemSchema.safeParse(body)

  if (!result.success) {
    return badRequestError(c, result.error.issues)
  }

  if (result.data.status && !canTransition(item.status, result.data.status)) {
    return badRequestError(c, [
      { path: ['status'], message: `${item.status} から ${result.data.status} には変更できません` },
    ])
  }

  Object.assign(item, result.data)

  return c.json(toItem(item))
})

app.delete('/items/:id', (c) => {
  const id = Number(c.req.param('id'))
  const index = items.findIndex((i) => i.id === id)

  if (index === -1) {
    return c.body(null, 204)
  }

  items.splice(index, 1)

  return c.body(null, 204)
})

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`listening on http://localhost:${info.port}`)
})
