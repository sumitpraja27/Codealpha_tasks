const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'ecommerce.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Create tables sequentially with error handling
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating users table:', err);
      else console.log('Users table ready');
    });

    // Products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        image_url TEXT,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating products table:', err);
      else console.log('Products table ready');
    });

    // Orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) console.error('Error creating orders table:', err);
      else console.log('Orders table ready');
    });

    // Order items table
    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY(order_id) REFERENCES orders(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
      )
    `, (err) => {
      if (err) console.error('Error creating order_items table:', err);
      else console.log('Order items table ready');
    });

    // Cart table
    db.run(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(product_id) REFERENCES products(id),
        UNIQUE(user_id, product_id)
      )
    `, (err) => {
      if (err) console.error('Error creating cart table:', err);
      else console.log('Cart table ready');
    });
  });

  console.log('Database initialization started');

  // Seed sample products after a short delay to ensure tables are created
  setTimeout(() => {
    seedProducts();
  }, 500);
}

function seedProducts() {
  const products = [
    { name: 'Laptop', description: 'High-performance laptop', price: 999.99, stock: 10, category: 'Electronics', image_url: 'http://localhost:3000/images/laptop.png' },
    { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 29.99, stock: 50, category: 'Electronics', image_url: 'http://localhost:3000/images/mouse.png' },
    { name: 'USB-C Cable', description: 'Fast charging cable', price: 14.99, stock: 100, category: 'Accessories', image_url: 'http://localhost:3000/images/cable.png' },
    { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', price: 89.99, stock: 25, category: 'Electronics', image_url: 'http://localhost:3000/images/keyboard.png' },
    { name: 'Monitor', description: '4K UltraHD Monitor', price: 349.99, stock: 15, category: 'Electronics', image_url: 'http://localhost:3000/images/monitor.png' },
    { name: 'Headphones', description: 'Noise-cancelling headphones', price: 199.99, stock: 30, category: 'Audio', image_url: 'http://localhost:3000/images/headphones.png' }
  ];

  let inserted = 0;
  
  products.forEach(product => {
    db.run(
      `INSERT OR IGNORE INTO products (name, description, price, stock, category, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [product.name, product.description, product.price, product.stock, product.category, product.image_url],
      function(err) {
        if (err) {
          console.error('Error inserting product:', err);
        } else if (this.changes > 0) {
          inserted++;
          console.log(`✓ Product inserted: ${product.name}`);
        }
      }
    );
  });

  // Check product count after seeding
  setTimeout(() => {
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (err) {
        console.error('Error checking products:', err);
      } else {
        console.log(`✓ Database ready with ${row.count} products`);
      }
    });
  }, 300);
}

module.exports = db;
