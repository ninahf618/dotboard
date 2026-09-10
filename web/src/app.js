import './index.css'
import { fetchItems, createItem } from './api.js'
import { renderItems } from './render.js'

async function loadItems() {
  const items = await fetchItems()
  renderItems(items)
}

const form = document.getElementById('item-form')

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const formData = new FormData(form)
  await createItem({
    title: formData.get('title'),
    note: formData.get('note'),
    rating: Number(formData.get('rating')),
    status: 'open',
  })

  form.reset()
  loadItems()
})

loadItems()
