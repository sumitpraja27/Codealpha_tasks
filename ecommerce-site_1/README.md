# E-Commerce Site

A modern, full-stack e-commerce application built with Node.js/Express (backend) and HTML/CSS/JavaScript (frontend).

## Features

- ✅ **Product Listings** - Browse all products with details and images
- ✅ **Shopping Cart** - Add/remove items, update quantities
- ✅ **Order Processing** - Checkout and place orders
- ✅ **User Authentication** - Register and login with JWT
- ✅ **Order History** - View past orders and details
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **SQLite Database** - Store products, users, and orders

## Project Structure

```
ecommerce-site/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # User authentication endpoints
│   │   ├── products.js      # Product listing endpoints
│   │   ├── cart.js          # Shopping cart endpoints
│   │   └── orders.js        # Order management endpoints
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── server.js            # Express server setup
│   ├── db.js                # Database initialization & seeding
│   ├── package.json         # Backend dependencies
│   ├── .env                 # Environment variables
│   └── ecommerce.db         # SQLite database (generated)
│
└── frontend/
    ├── pages/
    │   ├── products.html    # Products page
    │   ├── cart.html        # Shopping cart page
    │   ├── orders.html      # Order history page
    │   └── login.html       # Login & register page
    ├── js/
    │   ├── api.js           # API client functions
    │   ├── main.js          # Common navigation & utilities
    │   ├── products.js      # Products page logic
    │   ├── cart.js          # Cart page logic
    │   ├── orders.js        # Orders page logic
    │   └── auth.js          # Authentication logic
    ├── css/
    │   └── style.css        # All styling
    └── index.html           # Home page
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

You can use `npm run dev` for development with automatic reload using nodemon.

### Frontend Setup

1. Open a terminal in the frontend directory or navigate to:
```bash
cd frontend
```

2. Start a local web server. You can use Python's built-in server:

**For Python 3:**
```bash
python -m http.server 8000
```

**For Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

Or use Node's `http-server`:
```bash
npm install -g http-server
http-server
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

## Usage

### Registration & Login
1. Click "Login/Register" in the navigation
2. Create a new account or login with existing credentials
3. Once logged in, you'll see "Cart" and "Orders" in the navigation

### Shopping
1. Click "Products" or "Shop Now" to browse all products
2. Click on a product to view details and add to cart
3. Adjust quantities in the shopping cart
4. Click "Proceed to Checkout" to place an order

### View Orders
1. Click "Orders" in the navigation to see your order history
2. Click on an order to view its details

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category

### Cart (Requires Authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:id` - Update cart item quantity
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders (Requires Authentication)
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/checkout` - Create order from cart

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Orders Table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
)
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY(order_id) REFERENCES orders(id),
  FOREIGN KEY(product_id) REFERENCES products(id)
)
```

### Cart Table
```sql
CREATE TABLE cart (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(product_id) REFERENCES products(id),
  UNIQUE(user_id, product_id)
)
```

## Sample Products

The database is automatically seeded with the following products:
- Laptop - $999.99
- Wireless Mouse - $29.99
- USB-C Cable - $14.99
- Mechanical Keyboard - $89.99
- Monitor - $349.99
- Headphones - $199.99

## Security Notes

⚠️ **Important for Production:**
- Change the `JWT_SECRET` in `.env` to a strong, random string
- Use HTTPS in production
- Add input validation and sanitization
- Implement rate limiting
- Use environment variables for sensitive data
- Add CORS restrictions
- Hash passwords with bcrypt (already implemented)

## Technologies Used

### Backend
- **Express.js** - Web framework
- **SQLite3** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling (responsive design)
- **JavaScript (ES6+)** - Client-side logic
- **Fetch API** - HTTP requests

## Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Search and filtering
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Order tracking
- [ ] User profile management
- [ ] Wishlist feature
- [ ] Coupon codes

## License

MIT License - Feel free to use this project for learning and personal projects.

## Support

For issues or questions, please create an issue in the repository.

---

Happy Shopping! 🛍️
