export type Status = 'open' | 'doing' | 'done'

export type Item = {
  id: number
  title: string
  note: string
  rating: number
  status: Status
}
