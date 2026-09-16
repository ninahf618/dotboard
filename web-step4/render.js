export function renderItems(items) {
  const list = document.getElementById('item-list')
  list.textContent = ''

  items.forEach((item) => {
    const li = document.createElement('li')
    li.className = 'item-card'

    const title = document.createElement('p')
    title.className = 'item-title'
    title.textContent = item.title
    li.appendChild(title)

    const note = document.createElement('p')
    note.className = 'item-note'
    note.textContent = item.note
    li.appendChild(note)

    const rating = document.createElement('p')
    rating.className = 'item-rating'
    rating.textContent = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating)
    li.appendChild(rating)

    list.appendChild(li)
  })
}
