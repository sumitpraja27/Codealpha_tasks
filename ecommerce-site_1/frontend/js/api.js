const API_BASE_URL = 'http://localhost:5000/api';

let token = localStorage.getItem('token');

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth API
const authAPI = {
    register: (username, email, password) =>
        apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        }),

    login: (email, password) =>
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        })
};

// Products API
const productsAPI = {
    getAll: () => apiRequest('/products'),

    getById: (id) => apiRequest(`/products/${id}`),

    getByCategory: (category) => apiRequest(`/products/category/${category}`)
};

// Cart API
const cartAPI = {
    getCart: () => apiRequest('/cart'),

    addItem: (product_id, quantity) =>
        apiRequest('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ product_id, quantity })
        }),

    updateItem: (id, quantity) =>
        apiRequest(`/cart/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        }),

    removeItem: (id) =>
        apiRequest(`/cart/remove/${id}`, {
            method: 'DELETE'
        }),

    clear: () =>
        apiRequest('/cart/clear', {
            method: 'DELETE'
        })
};

// Orders API
const ordersAPI = {
    getAll: () => apiRequest('/orders'),

    getById: (id) => apiRequest(`/orders/${id}`),

    checkout: () =>
        apiRequest('/orders/checkout', {
            method: 'POST',
            body: JSON.stringify({})
        })
};
