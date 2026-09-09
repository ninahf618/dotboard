import type { Item } from './types.js'
import type { Status } from './types.js'

const allowedTransitions: Record<Status, Status[]> = {
  open: ['doing'],
  doing: ['open', 'done'],
  done: ['doing'],
}

export const canTransition = (from: Status, to: Status): boolean => {
  if (from === to) return true
  return allowedTransitions[from].includes(to)
}

export const nextStatuses = (status: Status): Status[] => allowedTransitions[status]

export const items: Item[] = []
export let nextId = 1

export const generateId = (): number => {
  const id = nextId
  nextId += 1
  return id
}
