// Shopping Cart Page

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    loadCart();

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});

async function loadCart() {
    try {
        const cart = await cartAPI.getCart();
        const container = document.getElementById('cart-items');

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            document.getElementById('checkout-btn').disabled = true;
            return;
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image_url}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <input type="number" min="1" value="${item.quantity}" 
                           onchange="updateCartItem(${item.id}, this.value)">
                </div>
                <div class="cart-item-price">
                    <div class="price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');

        document.getElementById('subtotal').textContent = `$${total.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        document.getElementById('checkout-btn').disabled = false;

        updateCartCount();
    } catch (error) {
        console.error('Error loading cart:', error);
        document.getElementById('cart-items').innerHTML = '<p>Error loading cart</p>';
    }
}

async function updateCartItem(cartItemId, quantity) {
    const qty = parseInt(quantity);
    if (qty < 1) {
        alert('Quantity must be at least 1');
        loadCart();
        return;
    }

    try {
        await cartAPI.updateItem(cartItemId, qty);
        loadCart();
    } catch (error) {
        console.error('Error updating cart:', error);
        alert(error.message);
    }
}

async function removeFromCart(cartItemId) {
    try {
        await cartAPI.removeItem(cartItemId);
        loadCart();
    } catch (error) {
        console.error('Error removing item:', error);
        alert(error.message);
    }
}

async function checkout() {
    try {
        const result = await ordersAPI.checkout();
        alert('Order placed successfully! Order ID: ' + result.order.id);
        window.location.href = 'orders.html';
    } catch (error) {
        console.error('Error during checkout:', error);
        alert(error.message);
    }
}
