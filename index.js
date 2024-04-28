const db = new Dexie('ChlistApp')

db.version(1).stores({
  items: '++id, name, quantity, isPurchased'
})

const itemForm = document.getElementById('itemForm')
const itemDiv = document.getElementById('itemsDiv')
const totalItems = document.getElementById('totalItems')

const populateItemsDiv = async () => {
  const allItems = await db.items.reverse().toArray()

  itemDiv.innerHTML = allItems.map(item => `
  <div class="item ${item.isPurchased && 'purchased'}">
    <label>
      <input type="checkbox"
      class="checkbox"
      ${item.isPurchased && 'checked'}
      onchange="toggleItemStatus(event, ${item.id})"
      >
    </label>

    <div class="itemInfo">
      <p>${item.name}</p>
      <p>${item.quantity}</p>
    </div>

    <button class="deleteButton" onclick="removeItem(${item.id})">X</button>
  </div>
  `).join('')
}

window.onload = populateItemsDiv

itemForm.onsubmit = async (event) => {
  event.preventDefault()

  const name = document.getElementById('nameInput').value
  const quantity = document.getElementById('quantityInput').value

  await db.items.add({ name, quantity })

  populateItemsDiv()

  itemForm.reset()
}

const toggleItemStatus = async (event, id) => {
  await db.items.update(id, { isPurchased: !!event.target.checked})
  await populateItemsDiv()
}

const removeItem = async (id) => {
  await db.items.delete(id)
  await populateItemsDiv()
}
 