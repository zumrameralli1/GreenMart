const firebaseConfig = {
    apiKey: "AIzaSyCtAZiw_SgB6L3hkwguliUv0tDVJJMDAZs",
    authDomain: "final-project-36941.firebaseapp.com",
    projectId: "final-project-36941",
    storageBucket: "final-project-36941.firebasestorage.app",
    messagingSenderId: "258118320596",
    appId: "1:258118320596:web:b1a4f34459fa0a3e63d641",
    measurementId: "G-N9X3CZKB8Q"
};

// Initialize Firebase
let auth;
let provider;

if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    provider = new firebase.auth.GoogleAuthProvider();
} else {
    console.error("Firebase SDK not found! Make sure to include scripts in HTML.");
}


let cart = JSON.parse(localStorage.getItem('cartGreen')) || [];

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.textContent = cart.length;
    }
}

// Product Database (With Images)
const productsData = [
    { id: 1, name: "Monstera Deliciosa", price: "450.00", category: "Plant", image: "monstera.png", desc: "The easy-to-care-for and showy elephant's foot plant will add a tropical touch to your home. Its leaves are notable for their perforated structure." },
    { id: 2, name: "Handmade Ceramic Vase", price: "320.00", category: "Decor", image: "vazoel.jpg", desc: "A ceramic vase, entirely handcrafted, with a modern and minimalist design. An elegant way to present your flowers." },
    { id: 3, name: "Wooden Side Table", price: "850.00", category: "Furniture", image: "sehpa.jpg", desc: "A durable and aesthetically pleasing side table made from natural wood. It adds a warm touch to your living room." },
    { id: 4, name: "Natural Soy Wax", price: "120.00", category: "Accessory", image: "soya-mumu.png", desc: "Made using 100% natural soy wax. It has a long burn time and a relaxing natural scent." },
    { id: 5, name: "Mini Cactus Set", price: "180.00", category: "Plant", image: "kaktus.jpg", desc: "A decorative set of three mini cacti that are easy to care for. The perfect green corner for your desk." },
    { id: 6, name: "Botanical Wall Painting", price: "250.00", category: "Decor", image: "tablo.jpg", desc: "An elegant wall art piece in a wooden frame, inspired by vintage botanical illustrations." },
    { id: 7, name: "Wicker Basket", price: "150.00", category: "Accessory", image: "sepet.jpg", desc: "A durable storage basket made from natural wicker, ideal for multi-purpose use." },
    { id: 8, name: "Bamboo Kitchen Set", price: "400.00", category: "Accessory", image: "bambu.jpg", desc: "A healthy and durable kitchen utensil set made from sustainably sourced bamboo." },
    { id: 9, name: "Japanese Lantern", price: "280.00", category: "Decor", image: "fener.jpg", desc: "An oriental touch for your garden or balcony. Traditional Japanese lantern design." },
    { id: 10, name: "Macrame Wall Hanging", price: "220.00", category: "Accessory", image: "sus.jpg", desc: "Hand-knitted bohemian-style macrame wall hanging. Adds a natural touch to your walls." },
    { id: 11, name: "Natural Lavender Soap", price: "80.00", category: "Care", image: "lavanta.jpg", desc: "A natural soap enriched with real lavender extracts, gently cleansing the skin" },
    { id: 12, name: "Bamboo Decor", price: "150.00", category: "Plant", image: "bambusus.jpg", desc: "An easy-to-care-for and stylish bamboo plant arrangement believed to bring good luck." }
];

function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const product = productsData.find(p => p.id == productId);

    if (product) {
        document.title = `${product.name} - GreenMart`;
        document.getElementById('breadcrumb-current').textContent = product.name;
        document.getElementById('detail-image').innerHTML = `<img src="${product.image}" alt="${product.name}">`;
        document.getElementById('detail-title').textContent = product.name;

        // Translate category for display if needed, or map it
        document.getElementById('detail-category').textContent = product.category;

        document.getElementById('detail-price').textContent = `${product.price} TL`;
        document.getElementById('detail-desc').textContent = product.desc;

        const btn = document.getElementById('detail-add-btn');
        btn.onclick = () => addToCart(product.name, product.price, product.image);
    } else {
        const container = document.getElementById('product-detail');
        if (container) container.innerHTML = "<h2>Product not found.</h2><a href='shop.html'>Return to Store</a>";
    }
}

function addToCart(productName, price, image) {
    cart.push({ name: productName, price: price, image: image });
    localStorage.setItem('cartGreen', JSON.stringify(cart));
    updateCartCount();
    alert(productName + " added to cart!");
}

function filterProducts() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const title = product.querySelector('.product-title').textContent.toLowerCase();
        

        const category = product.querySelector('.product-category').textContent;

        const matchesSearch = title.includes(searchInput);
        const matchesCategory = categoryFilter === 'all' || category === categoryFilter;

        if (matchesSearch && matchesCategory) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkAuth(); // Check for user login
    fetchWeather(); // Fetch weather data
    loadProductDetails(); // Try loading details if on detail page
    console.log("GreenMart Loaded");

    // Add event listeners for buttons if they exist
    const addButtons = document.querySelectorAll('.add-btn');
    addButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const name = this.dataset.name;
            const price = this.dataset.price;
            // Find parent card to get image
            const card = this.closest('.product-card');
            let image = '📦';
            if (card) {
                const imgElement = card.querySelector('.product-image img');
                if (imgElement) {
                    image = imgElement.src;
                }
            }

            addToCart(name, price, image);
        });
    });
    // Checkout Button Logic
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your cart is empty! Please add products first.");
                return;
            }

            
            alert("Your order has been successfully received! Thank you.");
            cart = [];
            localStorage.setItem('cartGreen', JSON.stringify(cart));
            updateCartCount();
            
            
            window.location.href = 'index.html';
        });
    }
});

// Weather API
async function fetchWeather() {
    const weatherWidget = document.getElementById('weather-widget');
    if (!weatherWidget) return;

    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.0082&longitude=28.9784&current_weather=true');
        const data = await response.json();

        const temp = data.current_weather.temperature;
        const code = data.current_weather.weathercode;

        let icon = '☀️';
        if (code > 3) icon = '☁️';
        if (code > 50) icon = '🌧️';
        if (code > 70) icon = '❄️';
        if (code > 95) icon = '⛈️';

        document.getElementById('weather-icon').textContent = icon;
        document.getElementById('weather-temp').textContent = `${temp}°C`;
    } catch (error) {
        console.error("Weather data fetch error:", error);
        weatherWidget.style.display = 'none';
    }
}

// Authentication Logic
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const navIcons = document.querySelector('.nav-icons');
    if (user && navIcons) {
        // Find existing login link
        const loginLink = navIcons.querySelector('a[href="login.html"]');
        if (loginLink) {
            if (user.photo) {
                // If user has a photo (e.g. from Google), display it
                loginLink.innerHTML = `<img src="${user.photo}" alt="${user.name}" style="width: 24px; height: 24px; border-radius: 50%; vertical-align: middle; margin-right: 5px;"> ${user.name}`;
            } else {
                loginLink.textContent = `👤 ${user.name}`;
            }
            loginLink.href = "#";
            loginLink.onclick = (e) => {
                e.preventDefault();
                if (confirm("Do you want to log out?")) {
                    logout();
                }
            };
        }
    }
}

function register() {
    const name = document.getElementById('name-input').value;
    const email = document.getElementById('register-email-input').value;
    const password = document.getElementById('register-password-input').value;
    const confirmPassword = document.getElementById('confirm-password-input').value;

    if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("The passwords don't match.");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(u => u.email === email)) {
        alert("This email address is already registered.");
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert("Registration successful! You can log in.");
    window.location.href = 'login.html';
}

function login() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert(`Welcome, ${user.name}!`);
        window.location.href = 'index.html';
    } else {
        alert("Incorrect email address or password.");
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

function loginWithGoogle() {
    if (!auth) {
        alert("Google login is currently unavailable (Firebase failed to load).");
        return;
    }

    auth.signInWithPopup(provider)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;

            
            const appUser = {
                name: user.displayName || user.email.split('@')[0], 
                email: user.email,
                photo: user.photoURL
            };

            
            localStorage.setItem('currentUser', JSON.stringify(appUser));

            alert(`Welcome, ${appUser.name}!`);
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error(error);
            alert("Login failed: " + error.message);
        });

}

