
// PRODUCT DATA
const products = [
    {
        id: 1,
        name: "Classic White Shirt",
        category: "Shirts",
        price: 2500,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"
    },
    {
        id: 2,
        name: "Premium Black Hoodie",
        category: "Hoodies",
        price: 3500,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600"
    },
    {
        id: 3,
        name: "Urban Sneakers",
        category: "Shoes",
        price: 5500,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
    },
    {
        id: 4,
        name: "Luxury Classic Watch",
        category: "Watches",
        price: 8500,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
    },
    {
        id: 5,
        name: "Casual Denim Jacket",
        category: "Jackets",
        price: 4500,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"
    },
    {
        id: 6,
        name: "Premium Black T-Shirt",
        category: "T-Shirts",
        price: 1800,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"
    },
    {
        id: 7,
        name: "Modern Blue Jeans",
        category: "Jeans",
        price: 3200,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"
    },
    {
        id: 8,
        name: "Classic Sunglasses",
        category: "Accessories",
        price: 2200,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"
    }
];

// CART AND WISHLIST
let cart = JSON.parse(localStorage.getItem("vantorCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("vantorWishlist")) || [];


// FORMAT PRICE
function formatPrice(price) {
    return "Rs. " + price.toLocaleString("en-PK");
}


// SAVE DATA
function saveData() {
    localStorage.setItem("vantorCart", JSON.stringify(cart));
    localStorage.setItem("vantorWishlist", JSON.stringify(wishlist));
}


// DISPLAY PRODUCTS
function displayProducts(items = products) {

    const productList = document.getElementById("productList");

    if (items.length === 0) {
        productList.innerHTML =
            `<div class="col-12 no-products">No products found!</div>`;
        return;
    }

    productList.innerHTML = items.map(product => {

        const isWishlisted = wishlist.includes(product.id);

        return `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="product-card">

                <div class="product-image">
                    <img src="${product.image}"
                         alt="${product.name}"
                         loading="lazy">

                    <button class="wishlist-btn"
                        onclick="toggleWishlist(${product.id})"
                        aria-label="Add to wishlist">
                        <i class="bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}"
                           style="color:${isWishlisted ? '#c9a45c' : '#111'}"></i>
                    </button>
                </div>

                <div class="product-info">

                    <div class="rating">
                        ★★★★★
                    </div>

                    <h5>${product.name}</h5>

                    <p>${formatPrice(product.price)}</p>

                    <button class="add-cart"
                        onclick="addToCart(${product.id})">
                        <i class="bi bi-bag-plus"></i>
                        ADD TO CART
                    </button>

                </div>
            </div>
        </div>
        `;
    }).join("");
}


// ADD TO CART
function addToCart(id) {

    const product = products.find(item => item.id === id);

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveData();
    updateCounts();

    alert(product.name + " added to your cart!");
}


// REMOVE FROM CART
function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    saveData();
    updateCounts();
    showCart();
}


// UPDATE COUNTS
function updateCounts() {

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity, 0
    );

    document.getElementById("cartCount").textContent = totalItems;

    document.getElementById("wishCount").textContent =
        wishlist.length;
}


// SHOW CART
function showCart() {

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty. Start shopping!</p>";

        cartTotal.textContent = "Total: Rs. 0";

    } else {

        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <p>${formatPrice(item.price)} × ${item.quantity}</p>
                </div>

                <button onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </div>
        `).join("");

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        cartTotal.textContent = "Total: " + formatPrice(total);
    }

    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("cartModal")
    ).show();
}


// WISHLIST
function toggleWishlist(id) {

    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
    } else {
        wishlist.push(id);
    }

    saveData();
    updateCounts();
    displayProducts();
}


// SHOW WISHLIST
function showWishlist() {

    const wishlistItems = document.getElementById("wishlistItems");

    if (wishlist.length === 0) {

        wishlistItems.innerHTML = "<p>Your wishlist is empty!</p>";

    } else {

        wishlistItems.innerHTML = wishlist.map(id => {

            const product = products.find(item => item.id === id);

            return `
                <div class="cart-item">
                    <div>
                        <strong>${product.name}</strong>
                        <p>${formatPrice(product.price)}</p>
                    </div>

                    <button onclick="toggleWishlist(${id}); showWishlist();">
                        Remove
                    </button>
                </div>
            `;

        }).join("");
    }

    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("wishlistModal")
    ).show();
}


// SEARCH PRODUCTS
document.getElementById("searchInput").addEventListener("input", function() {

    const searchValue = this.value.toLowerCase();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue)
    );

    const category = document.getElementById("categoryFilter").value;

    const finalProducts = category === "All"
        ? filteredProducts
        : filteredProducts.filter(p => p.category === category);

    displayProducts(finalProducts);
});


// CATEGORY FILTER
document.getElementById("categoryFilter").addEventListener("change", function() {

    const category = this.value;
    const searchValue = document.getElementById("searchInput").value.toLowerCase();

    let filtered = products;

    if (category !== "All") {
        filtered = filtered.filter(p => p.category === category);
    }

    filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchValue) ||
        p.category.toLowerCase().includes(searchValue)
    );

    displayProducts(filtered);
});


// CATEGORY CARDS
function filterCategory(category) {

    document.getElementById("categoryFilter").value = category;
    document.getElementById("searchInput").value = "";

    displayProducts(
        products.filter(product => product.category === category)
    );

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}


// LOGIN MODAL
function openLogin() {

    const message = document.getElementById("loginMessage");

    message.textContent = "";

    const savedUser = JSON.parse(
        localStorage.getItem("vantorUser") || "null"
    );

    if (savedUser) {
        document.getElementById("loginName").value = savedUser.name;
        document.getElementById("loginEmail").value = savedUser.email;
    }

    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("loginModal")
    ).show();
}


// LOGIN FORM
document.getElementById("loginForm").addEventListener("submit", function(e) {

    e.preventDefault();

    const name = document.getElementById("loginName").value.trim();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!name || !email || !password) {
        return;
    }

    localStorage.setItem("vantorUser", JSON.stringify({
        name: name,
        email: email
    }));

    document.querySelector(".login-btn").textContent = name;

    document.getElementById("loginMessage").textContent =
        "Welcome to VANTOR, " + name + "!";

    document.getElementById("loginPassword").value = "";
});


// LOGOUT
function logout() {

    localStorage.removeItem("vantorUser");

    document.querySelector(".login-btn").textContent = "Login";

    document.getElementById("loginForm").reset();

    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("loginModal")
    ).hide();
}


// CHECKOUT
function checkout() {

    if (cart.length === 0) {
        alert("Your shopping cart is empty!");
        return;
    }

    const user = JSON.parse(
        localStorage.getItem("vantorUser") || "null"
    );

    if (!user) {
        alert("Please login before checkout!");
        showCart();
        openLogin();
        return;
    }

    alert(
        "Thank you " + user.name +
        "! Your demo order has been prepared."
    );

    cart = [];

    saveData();
    updateCounts();

    bootstrap.Modal.getInstance(
        document.getElementById("cartModal")
    ).hide();
}


// CONTACT FORM
document.getElementById("contactForm").addEventListener("submit", function(e) {

    e.preventDefault();

    alert("Thank you for contacting VANTOR!");

    this.reset();
});


// RESTORE USER
function restoreUser() {

    const user = JSON.parse(
        localStorage.getItem("vantorUser") || "null"
    );

    if (user) {
        document.querySelector(".login-btn").textContent = user.name;
    }
}


// INITIALIZE WEBSITE
displayProducts();
updateCounts();
restoreUser();
