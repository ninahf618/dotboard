export function renderItems(items) {
  const list = document.getElementById('item-list')
  list.textContent = ''

  items.forEach((item) => {
    const li = document.createElement('li')
    li.className = 'rounded-lg border border-gray-200 bg-white p-4 shadow-sm mb-2'

    const title = document.createElement('p')
    title.className = 'font-bold mb-1'
    title.textContent = item.title
    li.appendChild(title)

    const note = document.createElement('p')
    note.className = 'text-gray-600 mb-1'
    note.textContent = item.note
    li.appendChild(note)

    const rating = document.createElement('p')
    rating.className = 'text-amber-500'
    rating.textContent = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating)
    li.appendChild(rating)

    list.appendChild(li)
  })
}
