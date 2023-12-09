// Header Scroll
let header = document.querySelector("header");

window.addEventListener("scroll", () => {
  header.classList.toggle("shadow", window.scrollY > 0);
});
// Products Array
const products = [
  {
    id: 1,
    title: "Beats Headphone",
    price: 264.9,
    image:
      "https://www.jbhifi.com.au/cdn/shop/products/475942-Product-0-I-637649741549605053_46716149-d304-4784-9799-f8444bae4b87.jpg?v=1657500225",
  },
  {
    id: 2,
    title: "Beats Pro Fit",
    price: 350,
    image:
      "https://www.jbhifi.com.au/cdn/shop/products/580274-Product-0-I-637776808958718058.jpg?v=1642045046",
  },
  {
    id: 3,
    title: "Airpods 2nd Gen",
    price: 150,
    image:
      "https://www.jbhifi.com.au/cdn/shop/products/381102-Product-0-I.jpg?v=1572322936",
  },
  {
    id: 4,
    title: "Airpods Pro",
    price: 400,
    image:
      "https://www.jbhifi.com.au/cdn/shop/products/664070-Product-1-I-638301556812443596.jpg?v=1694558893",
  },
  {
    id: 5,
    title: "Airpods Pro Max",
    price: 899,
    image:
      "https://www.jbhifi.com.au/cdn/shop/products/502140-Product-0-I-637431229336643133.jpg?v=1607903394",
  },
  {
    id: 6,
    title: "MacBook Air",
    price: 1500,
    image:
      "https://www.jbhifi.com.au/cdn/shop/products/494995-Product-0-I-637406991736141585.jpg?v=1649907466",
  },
  {
    id: 7,
    title: "Iphone 15Pro",
    price: 2000,
    image:
      "https://www.jbhifi.com.au/cdn/shop/products/639208-Product-0-I-638301466208518307.jpg?v=1698811949",
  },
  {
    id: 8,
    title: "Iphone 12",
    price: 900,
    image:
      "https://www.jbhifi.com.au/cdn/shop/products/481750-Product-0-I-637382637839048634.jpg?v=1698728606",
  },
];

// Get the products list and elements
const productList = document.getElementById("productList");
const cartItemsElement = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");

// Store Cart Items In Local Storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render Products On Page
function renderProducts() {
  productList.innerHTML = products
    .map(
      (product) => `
    <div class="product">
    <img src="${product.image}" alt="${product.title}" class="product-img" />
    <div class="product-info">
      <h2 class="product-title">${product.title}</h2>
      <p class="product-price">$${product.price.toFixed(2)}</p>
      <a class="add-to-cart" data-id="${product.id}">Add to cart</a>
    </div>
  </div>
    `
    )
    .join("");
  // Add to cart
  const addToCartButtons = document.getElementsByClassName("add-to-cart");
  for (let i = 0; i < addToCartButtons.length; i++) {
    const addToCartButton = addToCartButtons[i];
    addToCartButton.addEventListener("click", addToCart);
  }
}

// Add to cart
function addToCart(event) {
  const productID = parseInt(event.target.dataset.id);
  const product = products.find((product) => product.id === productID);

  if (product) {
    // If product already in cart
    const exixtingItem = cart.find((item) => item.id === productID);

    if (exixtingItem) {
      exixtingItem.quantity++;
    } else {
      const cartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      };
      cart.push(cartItem);
    }
    // Change Add to cart text to added
    event.target.textContent = "Added";
    updateCartIcon();
    saveToLocalStorage();
    renderCartItems();
    calculateCartTotlal();
  }
}

// Remove from cart
function removeFromCart(event) {
  const productID = parseInt(event.target.dataset.id);
  cart = cart.filter((item) => item.id !== productID);
  saveToLocalStorage();
  renderCartItems();
  calculateCartTotlal();
  updateCartIcon();
}
// Quantity Change
function changeQuantity(event) {
  const productID = parseInt(event.target.dataset.id);
  const quantity = parseInt(event.target.value);

  if (quantity > 0) {
    const cartItem = cart.find((item) => item.id === productID);
    if (cartItem) {
      cartItem.quantity = quantity;
      saveToLocalStorage();
      calculateCartTotlal();
      updateCartIcon();
    }
  }
}
// SaveToLocalStorage
function saveToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Render Prodcuts On Cart Page
function renderCartItems() {
  cartItemsElement.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
    <img src="${item.image}" alt="${item.title}" />
    <div class="cart-item-info">
      <h2 class="cart-item-title">${item.title}</h2>
      <input
        class="cart-item-quantity"
        type="number"
        name=""
        min="1"
        value="${item.quantity}"
        data-id="${item.id}"
      />
    </div>
    <h2 class="cart-item-price">$${item.price}</h2>
    <button class="remove-from-cart" data-id="${item.id}">Remove</button>
  </div>
    `
    )
    .join("");
  // Remove From Cart
  const removeButtons = document.getElementsByClassName("remove-from-cart");
  for (let i = 0; i < removeButtons.length; i++) {
    const removeButton = removeButtons[i];
    removeButton.addEventListener("click", removeFromCart);
  }
  // Quantity Change
  const quantityInputs = document.querySelectorAll(".cart-item-quantity");
  quantityInputs.forEach((input) => {
    input.addEventListener("change", changeQuantity);
  });
}

// Claculate Total
function calculateCartTotlal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Check If On Cart Page
if (window.location.pathname.includes("cart.html")) {
  renderCartItems();
  calculateCartTotlal();
} else if (window.location.pathname.includes("success.html")) {
  clearCart();
} else {
  renderProducts();
}
// Empty Cart on successfull payment
function clearCart() {
  cart = [];
  saveToLocalStorage();
  updateCartIcon;
}
// Cart Icon Quantity
const cartIcon = document.getElementById("cart-icon");

function updateCartIcon() {
  const totalQuantity = cart.reduce((sum, item) => sum + iyem.quantity, 0);
  cartIcon.setAttribute("data-quantity", totalQuantity);
}

updateCartIcon();

function updateCartIconOnCartChange() {
  updateCartIcon();
}

window.addEventListener("storage", updateCartIconOnCartChange);

function updateCartIcon() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartIcon = document.getElementById("cart-icon");
  cartIcon.setAttribute("data-quantity", totalQuantity);
}

renderProducts();
renderCartItems();
calculateCartTotlal();
