/* ===================================================
   NUWAFANA PIZZA — Shared JavaScript
   Handles: Nav, Cart (localStorage), Toast, Validation
   =================================================== */

// ─── Pizza Product Data ──────────────────────────────────────────────────────
const PIZZA_DATA = [
    // Classic
    { id: 1, name: "Margherita Classic", category: "classic", price: 12.99, image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600&q=80", desc: "San Marzano tomato, fresh mozzarella, basil, extra virgin olive oil.", badge: "Best Seller" },
    { id: 2, name: "Pepperoni Supreme", category: "classic", price: 15.99, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80", desc: "Loaded with premium pepperoni, mozzarella, and our signature tomato sauce.", badge: null },
    { id: 3, name: "Four Cheese", category: "classic", price: 14.50, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80", desc: "Mozzarella, cheddar, parmesan, and ricotta cheese blend.", badge: null },
    // Chicken
    { id: 4, name: "BBQ Chicken", category: "chicken", price: 16.99, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80", desc: "Grilled chicken strips, smoky BBQ sauce, red onions, and cilantro.", badge: "Popular" },
    { id: 5, name: "Chicken Tikka", category: "chicken", price: 17.50, image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&q=80", desc: "Spiced tikka chicken, jalapeños, onions, and yogurt drizzle.", badge: null },
    { id: 6, name: "Buffalo Chicken", category: "chicken", price: 16.50, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80", desc: "Crispy buffalo chicken, blue cheese, celery, and ranch drizzle.", badge: null },
    // Beef
    { id: 7, name: "Beef Feast", category: "beef", price: 18.99, image: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=600&q=80", desc: "Seasoned ground beef, mushrooms, peppers, black olives, and mozzarella.", badge: "New" },
    { id: 8, name: "Meatball Deluxe", category: "beef", price: 17.99, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80", desc: "Homemade beef meatballs, marinara, provolone, and fresh basil.", badge: null },
    // Vegetarian
    { id: 9, name: "Garden Fresh", category: "vegetarian", price: 13.99, image: "https://images.unsplash.com/photo-1548369937-47519962c11a?w=600&q=80", desc: "Bell peppers, mushrooms, zucchini, cherry tomatoes, and olives.", badge: null },
    { id: 10, name: "Spinach & Artichoke", category: "vegetarian", price: 14.99, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80", desc: "Creamy garlic base, fresh spinach, artichoke hearts, and feta.", badge: "Healthy" },
    // Special
    { id: 11, name: "Nuwafana Special", category: "special", price: 22.99, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80", desc: "Our signature pizza: premium beef, chicken, three cheeses, and house sauce.", badge: "Chef's Pick" },
    { id: 12, name: "Seafood Sensation", category: "special", price: 21.99, image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600&q=80", desc: "Shrimp, calamari, olives, capers, and garlic white wine sauce.", badge: "Limited" }
];

// ─── Cart Utilities ──────────────────────────────────────────────────────────

/**
 * Load cart from localStorage
 * @returns {Array} cart items array
 */
function getCart() {
    return JSON.parse(localStorage.getItem('nuwafana_cart') || '[]');
}

/**
 * Save cart array to localStorage
 * @param {Array} cart
 */
function saveCart(cart) {
    localStorage.setItem('nuwafana_cart', JSON.stringify(cart));
}

/**
 * Add a pizza to the cart (or increment qty)
 * @param {number} id - pizza ID
 * @param {number} qty - quantity to add
 * @param {string} size - pizza size
 */
function addToCart(id, qty = 1, size = 'Medium') {
    const pizza = PIZZA_DATA.find(p => p.id === id);
    if (!pizza) return;

    let cart = getCart();
    const existIdx = cart.findIndex(i => i.id === id && i.size === size);

    if (existIdx > -1) {
        cart[existIdx].qty += qty;
    } else {
        cart.push({ id, name: pizza.name, price: pizza.price, image: pizza.image, qty, size });
    }

    saveCart(cart);
    updateCartBadge();
    showToast(`🍕 ${pizza.name} added to cart!`);
}

/**
 * Update the cart count badge on the nav button
 */
function updateCartBadge() {
    const cart = getCart();
    const total = cart.reduce((sum, i) => sum + i.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = total;
    });
}

/**
 * Get total price of cart
 * @returns {number}
 */
function getCartTotal() {
    return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

// ─── Toast Notification ──────────────────────────────────────────────────────

/**
 * Show a toast notification
 * @param {string} msg
 */
function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        toast.innerHTML = '<span class="toast-icon">✓</span><span class="toast-msg"></span>';
        document.body.appendChild(toast);
    }
    toast.querySelector('.toast-msg').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ─── Navigation ──────────────────────────────────────────────────────────────

function initNav() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('open');
            // Animate hamburger
            toggle.classList.toggle('active');
        });

        // Close menu when a link is clicked (mobile)
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => menu.classList.remove('open'));
        });
    }

    // Set active link based on current page
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === page || (page === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });

    updateCartBadge();
}

// ─── Form Validation ─────────────────────────────────────────────────────────

/**
 * Validate a single field. Returns true if valid.
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} field
 * @returns {boolean}
 */
function validateField(field) {
    const val = field.value.trim();
    let valid = true;

    if (field.hasAttribute('required') && !val) {
        valid = false;
    } else if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        valid = false;
    } else if (field.type === 'tel' && val && !/^[\d\s+\-()]{7,}$/.test(val)) {
        valid = false;
    }

    if (!valid) {
        field.classList.add('error');
    } else {
        field.classList.remove('error');
    }

    return valid;
}

/**
 * Validate an entire form. Returns true if all fields are valid.
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
function validateForm(form) {
    const fields = form.querySelectorAll('[required], input[type="email"], input[type="tel"]');
    let allValid = true;
    fields.forEach(f => { if (!validateField(f)) allValid = false; });
    return allValid;
}

// ─── Init on DOM Ready ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initNav();

    // Live validation on blur
    document.querySelectorAll('.form-control').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => field.classList.remove('error'));
    });
});
