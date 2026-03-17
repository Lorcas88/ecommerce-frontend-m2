const cart = [] // List to build the cart
let services = []

const cardTemplate = (data) => {
  return `
    <div class="col">
      <article class="card h-100" id="service-card-${data.id}">
        <img src=${data.img} class="card-img-top" />
        <div class="card-body">
          <h5 class="card-title">${data.title}</h5>
          <p class="card-text">${data.description}</p>
          <div class="d-flex justify-content-center gap-4">
            <button class="btn btn-primary btn-add" data-service-id=${data.id}>
              Agregar
            </button>
            <a href="producto.html" class="btn btn-outline-light"> Ver más </a>
          </div>
        </div>
      </article>
    </div>
  `
}

function addToCart(id) {
  const indexService = services.findIndex((s) => s.id === id)
  if (indexService !== -1) {
    // Retrieves the index if the service was already clicked.
    // This is to update the amount on the cart object.
    // If the index searched not exist, returns -1. If not
    // it will create tje object on the cart
    const index = cart.findIndex((c) => c.id === id)
    if (index !== -1) {
      cart[index].amount += 1
    } else {
      cart.push({
        id: services[indexService].id,
        name: services[indexService].title,
        price: services[indexService].price,
        amount: 1,
      })
    }
  }
}

function updateBadge() {
  const cartBadge = document.querySelector('.nav-item .badge')

  const amountsList = cart.map((service) => service.amount)
  const totalCart = amountsList.reduce((accumulator, current) => {
    return accumulator + current
  }, 0)

  cartBadge.innerHTML = totalCart
}

function render(container) {
  const cardsHTML = services.map(cardTemplate).join('')
  container.innerHTML = cardsHTML
}

// This functions was created to emulate the fetch to a real DB
async function fetchServices() {
  const url = '../data/data.json'

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const result = await response.json()
    services = result.services
  } catch (error) {
    console.error(error.message)
  }
}

async function init() {
  await fetchServices()
  const cardsContainer = document.getElementById('cards_container')

  render(cardsContainer)

  cardsContainer.addEventListener('click', (e) => {
    if (e.target.matches('.btn-add')) {
      const id = Number(e.target.dataset.serviceId)
      addToCart(id)
      updateBadge()
    }
  })
}

init()
