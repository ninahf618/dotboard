import type { Item } from './types.js'

export const items: Item[] = []
export let nextId = 1

export const generateId = (): number => {
  const id = nextId
  nextId += 1
  return id
}
