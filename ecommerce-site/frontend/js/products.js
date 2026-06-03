// Products Page

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

async function loadProducts() {
    try {
        const products = await productsAPI.getAll();
        const container = document.getElementById('products-grid');

        container.innerHTML = products.map(product => `
            <div class="product-card" onclick="showProductDetails(${product.id})">
                <img src="${product.image_url}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-category">${product.category}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-stock">${product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}</div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products-grid').innerHTML = '<p>Error loading products</p>';
    }
}
