import type { Context } from 'hono'

export const notFoundError = (c: Context) => c.json({ error: 'Not Found' }, 404)

export const badRequestError = (c: Context, issues: unknown) =>
  c.json({ error: 'Bad Request', issues }, 400)
