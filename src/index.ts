import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { items, generateId } from './store.js'
import { createItemSchema } from './schema.js'

const app = new Hono()

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
  return c.json(items)
})

app.get('/items/:id', (c) => {
  const id = Number(c.req.param('id'))
  const item = items.find((i) => i.id === id)

  if (!item) {
    return c.json({ error: 'Not Found' }, 404)
  }

  return c.json(item)
})

app.post('/items', async (c) => {
  const body = await c.req.json()
  const result = createItemSchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: 'Bad Request', issues: result.error.issues }, 400)
  }

  const item = {
    id: generateId(),
    ...result.data,
  }
  items.push(item)

  return c.json(item, 201)
})

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`listening on http://localhost:${info.port}`)
})
