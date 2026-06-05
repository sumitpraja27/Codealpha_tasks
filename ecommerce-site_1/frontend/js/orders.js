// Orders Page

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    loadOrders();
});

async function loadOrders() {
    try {
        const orders = await ordersAPI.getAll();
        const container = document.getElementById('orders-list');

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty-orders">
                    <p>You haven't placed any orders yet</p>
                    <a href="products.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            return;
        }

        container.innerHTML = orders.map(order => `
            <div class="order-card" onclick="showOrderDetails(${order.id})">
                <div class="order-header">
                    <span class="order-number">Order #${order.id}</span>
                    <span class="order-status ${order.status}">${order.status.toUpperCase()}</span>
                </div>
                <div class="order-details">
                    <div class="order-detail-item">
                        <div class="order-detail-label">Order Date</div>
                        <div>${new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                    <div class="order-detail-item">
                        <div class="order-detail-label">Total Amount</div>
                        <div>$${order.total_amount.toFixed(2)}</div>
                    </div>
                    <div class="order-detail-item">
                        <div class="order-detail-label">Items</div>
                        <div>Click to view</div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('orders-list').innerHTML = '<p>Error loading orders</p>';
    }
}

async function showOrderDetails(orderId) {
    try {
        const order = await ordersAPI.getById(orderId);
        const modal = document.getElementById('order-modal');
        const modalBody = document.getElementById('order-modal-body');

        const itemsHTML = order.items.map(item => `
            <div class="order-item">
                <div>
                    <img src="${item.image_url}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 1rem;">
                    ${item.name} x ${item.quantity}
                </div>
                <div>$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');

        modalBody.innerHTML = `
            <h2>Order #${order.id}</h2>
            <div style="margin-bottom: 1.5rem;">
                <p><strong>Status:</strong> <span class="order-status ${order.status}">${order.status.toUpperCase()}</span></p>
                <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
                <p><strong>Total Amount:</strong> $${order.total_amount.toFixed(2)}</p>
            </div>
            <h3>Items</h3>
            <div class="order-items">
                ${itemsHTML}
            </div>
        `;

        modal.style.display = 'block';
    } catch (error) {
        console.error('Error loading order details:', error);
        alert('Error loading order details');
    }
}
