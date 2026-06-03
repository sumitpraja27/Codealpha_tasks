# File Structure and Paths

## All Files Created

### Backend Files

**Main Server:**
- `backend/server.js` - Express server setup and route configuration
- `backend/db.js` - SQLite database initialization and seeding
- `backend/package.json` - Node.js dependencies
- `backend/.env` - Environment variables

**Routes:**
- `backend/routes/auth.js` - User registration and login endpoints
- `backend/routes/products.js` - Product listing endpoints
- `backend/routes/cart.js` - Shopping cart management endpoints
- `backend/routes/orders.js` - Order processing endpoints

**Middleware:**
- `backend/middleware/auth.js` - JWT authentication middleware

---

### Frontend Files

**HTML Pages:**
- `frontend/index.html` - Home page with featured products
- `frontend/pages/products.html` - All products page
- `frontend/pages/cart.html` - Shopping cart page
- `frontend/pages/orders.html` - Order history page
- `frontend/pages/login.html` - Login and registration page

**JavaScript:**
- `frontend/js/api.js` - API client with all endpoints
- `frontend/js/main.js` - Navigation and common functions
- `frontend/js/auth.js` - Authentication page logic
- `frontend/js/products.js` - Products page logic
- `frontend/js/cart.js` - Shopping cart logic
- `frontend/js/orders.js` - Orders page logic

**Styling:**
- `frontend/css/style.css` - All CSS styling (responsive)

---

### Documentation

- `README.md` - Full project documentation
- `QUICKSTART.md` - Quick start guide for Windows PowerShell
- `PROJECT_SUMMARY.md` - Project overview and summary
- `.gitignore` - Git configuration for version control

---

## Full Directory Tree

```
d:\PROGRAMMING\Internship Projects\ecommerce-site\
│
├── backend\
│   ├── middleware\
│   │   └── auth.js
│   ├── routes\
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── products.js
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── ecommerce.db (generated on first run)
│
├── frontend\
│   ├── pages\
│   │   ├── cart.html
│   │   ├── login.html
│   │   ├── orders.html
│   │   └── products.html
│   ├── js\
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── main.js
│   │   ├── orders.js
│   │   └── products.js
│   ├── css\
│   │   └── style.css
│   └── index.html
│
├── README.md
├── QUICKSTART.md
├── PROJECT_SUMMARY.md
└── .gitignore
```

## Key Files Overview

### Backend Entry Point
**`backend/server.js`** - Start here for backend
- Sets up Express server
- Configures middleware
- Initializes database
- Maps all routes

### Frontend Entry Point
**`frontend/index.html`** - Start here for frontend
- Home page
- Links to all other pages
- Featured products display

### Database Setup
**`backend/db.js`** - Database initialization
- Creates all tables
- Sets up relationships
- Seeds sample products

### API Endpoints
**`backend/routes/*.js`** - Four main route files
- `auth.js` - User authentication
- `products.js` - Browse products
- `cart.js` - Cart management
- `orders.js` - Order processing

### Client-Side
**`frontend/js/api.js`** - All API calls
- Central place for API communication
- Handles authentication headers
- Error handling

---

## Installation Locations

All files are located at:
```
Base Path: d:\PROGRAMMING\Internship Projects\ecommerce-site
```

Backend:
```
d:\PROGRAMMING\Internship Projects\ecommerce-site\backend
```

Frontend:
```
d:\PROGRAMMING\Internship Projects\ecommerce-site\frontend
```

---

## How to Navigate

1. **To modify backend logic**: Edit files in `backend/routes/`
2. **To modify frontend layout**: Edit files in `frontend/pages/`
3. **To modify styling**: Edit `frontend/css/style.css`
4. **To modify API calls**: Edit `frontend/js/api.js`
5. **To modify database**: Edit `backend/db.js`
6. **To update dependencies**: Edit `backend/package.json` then run `npm install`

---

## File Sizes

Frontend files are lightweight (~5KB total CSS, ~10KB total JS)
Backend is also minimal (~20KB total code)
Database is generated at runtime

---

All files are well-commented and follow best practices! 📝
