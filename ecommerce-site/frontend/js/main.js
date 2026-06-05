// Main Navigation and Common Functions

// Update UI based on authentication
function updateAuthUI() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const loginNav = document.getElementById('login-nav');
    const cartNav = document.getElementById('cart-nav');
    const ordersNav = document.getElementById('orders-nav');
    const logoutNav = document.getElementById('logout-nav');

    if (token && user.id) {
        loginNav.style.display = 'none';
        cartNav.style.display = 'block';
        ordersNav.style.display = 'block';
        logoutNav.style.display = 'block';
    } else {
        loginNav.style.display = 'block';
        cartNav.style.display = 'none';
        ordersNav.style.display = 'none';
        logoutNav.style.display = 'none';
    }

    updateCartCount();
}

// Update cart count in navigation
async function updateCartCount() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const cart = await cartAPI.getCart();
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').textContent = `(${count})`;
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Determine correct path to index.html based on current page depth
    const isInPages = window.location.pathname.includes('/pages/');
    window.location.href = isInPages ? '../index.html' : 'index.html';
}

// SVG Icons for Sun and Moon
const SUN_SVG = `<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>`;
const MOON_SVG = `<svg viewBox="0 0 24 24"><path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10 0-4.2 2.6-7.9 6.6-9.3.5-.2 1 .1 1.1.6.2.5-.1 1.1-.6 1.3-3 1.1-5 4-5 7.4 0 4.4 3.6 8 8 8 3.4 0 6.3-2 7.4-5 .2-.5.8-.8 1.3-.6.5.2.8.8.6 1.3-1.4 4-5.1 6.3-9.3 6.3z"/></svg>`;

// Initialize theme toggle button in navbar
function initThemeToggle() {
    const navbarContainer = document.querySelector('.navbar-container');
    const hamburger = document.getElementById('hamburger');
    if (!navbarContainer) return;

    // Remove existing if any
    const existingToggle = document.querySelector('.theme-toggle-container');
    if (existingToggle) existingToggle.remove();

    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'theme-toggle-container';

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.className = 'theme-toggle-btn';
    btn.setAttribute('aria-label', 'Toggle theme');
    btn.innerHTML = currentTheme === 'dark' ? SUN_SVG : MOON_SVG;

    toggleContainer.appendChild(btn);

    if (hamburger) {
        navbarContainer.insertBefore(toggleContainer, hamburger);
    } else {
        navbarContainer.appendChild(toggleContainer);
    }

    btn.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = activeTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        btn.innerHTML = newTheme === 'dark' ? SUN_SVG : MOON_SVG;
    });
}

// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Theme Toggle UI
    initThemeToggle();

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    updateAuthUI();

    // Load featured products on home page
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        loadFeaturedProducts();
    }
});

// Load featured products
async function loadFeaturedProducts() {
    try {
        const products = await productsAPI.getAll();
        const container = document.getElementById('featured-products');

        if (!container) return;

        container.innerHTML = products.slice(0, 6).map(product => `
            <div class="product-card" onclick="showProductDetails(${product.id})">
                <img src="${product.image_url}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-category">${product.category}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-stock">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

// Show product details modal
async function showProductDetails(productId) {
    try {
        const product = await productsAPI.getById(productId);
        const modal = document.getElementById('product-modal');
        const modalBody = document.getElementById('modal-body');

        const token = localStorage.getItem('token');
        const isLoggedIn = !!token;

        modalBody.innerHTML = `
            <div class="product-details-modal">
                <img src="${product.image_url}" alt="${product.name}" class="product-details-image">
                <div class="product-details-info">
                    <h2>${product.name}</h2>
                    <div class="product-details-price">$${product.price.toFixed(2)}</div>
                    <p class="product-details-description">${product.description}</p>
                    <div class="product-details-stock">
                        ${product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                    </div>
                    ${isLoggedIn ? `
                        <div class="product-details-quantity">
                            <label>Quantity:</label>
                            <input type="number" id="product-quantity" min="1" max="${product.stock}" value="1">
                        </div>
                        <button class="btn btn-primary" onclick="addToCartFromModal(${product.id}, ${product.stock})">
                            Add to Cart
                        </button>
                    ` : `
                        <p style="color: #e74c3c; margin: 1rem 0;">Please <a href="pages/login.html">login</a> to add items to cart</p>
                    `}
                </div>
            </div>
        `;

        modal.style.display = 'block';
    } catch (error) {
        console.error('Error loading product details:', error);
        alert('Error loading product details');
    }
}

// Add to cart from modal
async function addToCartFromModal(productId, maxStock) {
    const quantityInput = document.getElementById('product-quantity');
    const quantity = parseInt(quantityInput.value);

    if (quantity < 1 || quantity > maxStock) {
        alert('Invalid quantity');
        return;
    }

    try {
        await cartAPI.addItem(productId, quantity);
        alert('Item added to cart!');
        updateCartCount();

        const modal = document.getElementById('product-modal');
        modal.style.display = 'none';
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert(error.message);
    }
}

// Close modal
window.addEventListener('click', (e) => {
    const productModal = document.getElementById('product-modal');
    const orderModal = document.getElementById('order-modal');

    if (productModal && e.target === productModal) {
        productModal.style.display = 'none';
    }

    if (orderModal && e.target === orderModal) {
        orderModal.style.display = 'none';
    }
});

// Close button in modal
document.addEventListener('DOMContentLoaded', () => {
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
});
