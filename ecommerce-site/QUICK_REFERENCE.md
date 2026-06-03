# ⚡ QUICK REFERENCE CARD

## 🚀 Quick Start (2 minutes)

### Terminal 1
```powershell
cd "d:\PROGRAMMING\Internship Projects\ecommerce-site\backend"
npm install
npm start
```

### Terminal 2
```powershell
cd "d:\PROGRAMMING\Internship Projects\ecommerce-site\frontend"
python -m http.server 8000
```

### Browser
```
http://localhost:8000
```

---

## 📍 Key Locations

```
Project Root:
d:\PROGRAMMING\Internship Projects\ecommerce-site

Backend:
d:\PROGRAMMING\Internship Projects\ecommerce-site\backend
├── server.js (START HERE for backend)
├── db.js (Database setup)
└── routes/ (API endpoints)

Frontend:
d:\PROGRAMMING\Internship Projects\ecommerce-site\frontend
├── index.html (START HERE for frontend)
├── pages/ (Other pages)
├── js/ (JavaScript logic)
└── css/ (Styling)

Database:
d:\PROGRAMMING\Internship Projects\ecommerce-site\backend\ecommerce.db
```

---

## 🔗 API Endpoints

### Users
```
POST   /api/auth/register
POST   /api/auth/login
```

### Products
```
GET    /api/products
GET    /api/products/:id
GET    /api/products/category/:category
```

### Cart (Protected)
```
GET    /api/cart
POST   /api/cart/add
PUT    /api/cart/update/:id
DELETE /api/cart/remove/:id
DELETE /api/cart/clear
```

### Orders (Protected)
```
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders/checkout
```

---

## 🔑 Test Credentials

Create your own or use:
- Email: `test@example.com`
- Password: `password123`

---

## 📦 Dependencies

**Backend:**
- express
- sqlite3
- bcryptjs
- jsonwebtoken
- cors
- body-parser

**Frontend:**
- None! Pure HTML/CSS/JS

---

## 🎨 Color Codes

```
#2c3e50 - Dark navigation
#3498db - Button blue
#667eea - Hero purple (start)
#764ba2 - Hero purple (end)
#27ae60 - Green (success)
#e74c3c - Red (danger)
#f39c12 - Orange (warning)
```

---

## 📊 Project Stats

- 32 Files
- 2,800+ Lines of Code
- 5,000+ Lines of Documentation
- 14 API Endpoints
- 5 Database Tables
- 6 Sample Products
- 4 HTML Pages
- 6 JavaScript Files
- 1 CSS File

---

## ✨ Features Checklist

- ✅ Product Listings
- ✅ Shopping Cart
- ✅ Product Details
- ✅ Order Processing
- ✅ User Auth
- ✅ Order History
- ✅ Database
- ✅ Responsive Design
- ✅ Security
- ✅ Documentation

---

## 🐛 If Something Breaks

### Port Already in Use
```powershell
# Kill process on port 5000
Get-Process | Where-Object {$_.Port -eq 5000} | Stop-Process

# Kill process on port 8000
Get-Process | Where-Object {$_.Port -eq 8000} | Stop-Process
```

### npm Issues
```powershell
rm -r node_modules
npm install
npm start
```

### Database Error
```powershell
# Delete database and restart
rm backend\ecommerce.db
npm start  # Will recreate
```

### CORS Error
- Make sure backend is running on 5000
- Check browser console (F12)

---

## 📚 Documentation Map

| File | Use |
|------|-----|
| START_HERE.md | Project overview |
| QUICKSTART.md | Setup instructions |
| README.md | Full documentation |
| PROJECT_SUMMARY.md | Features list |
| FILE_STRUCTURE.md | Code navigation |
| TESTING_GUIDE.md | Test procedures |
| COMPLETE_GUIDE.md | Full reference |
| VISUAL_GUIDE.md | UI mockups |
| DOCUMENTATION_INDEX.md | Doc navigation |
| QUICK_REFERENCE.md | This file! |

---

## 🔐 Security Keys

In `backend/.env`:
```
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

⚠️ **CHANGE THIS FOR PRODUCTION!**

---

## 📱 Responsive Breakpoints

```
Desktop: 1200px+
Tablet:  768px - 1199px
Mobile:  320px - 767px
```

---

## 🔄 User Journey

```
Homepage
  ↓
Register/Login
  ↓
Browse Products
  ↓
View Product Details
  ↓
Add to Cart
  ↓
View Cart
  ↓
Checkout
  ↓
View Orders
```

---

## ⚙️ Configuration

**Backend (.env):**
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_key
DB_PATH=./ecommerce.db
```

**Frontend (api.js):**
```
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 📋 File Quick Links

**Backend Files:**
- `server.js` - Express setup
- `db.js` - Database
- `routes/auth.js` - User auth
- `routes/products.js` - Products
- `routes/cart.js` - Cart
- `routes/orders.js` - Orders

**Frontend Files:**
- `index.html` - Home
- `pages/products.html` - Products
- `pages/cart.html` - Cart
- `pages/orders.html` - Orders
- `pages/login.html` - Auth
- `js/api.js` - API client
- `js/main.js` - Navigation
- `css/style.css` - All styles

---

## 🧪 Test Flow

1. Register account
2. Browse products
3. Add to cart
4. Checkout
5. View orders
6. View order details

All should work smoothly!

---

## 💾 Data Storage

**Browser localStorage:**
```javascript
localStorage.token      // JWT token
localStorage.user       // User object
```

**Database:**
```
ecommerce.db (SQLite)
├── users
├── products
├── orders
├── order_items
└── cart
```

---

## 🎯 Common Tasks

### Clear Cache
F12 → Application → Clear Storage

### Check Database
Open `backend/ecommerce.db` with SQLite viewer

### View Logs
Backend: Terminal output
Frontend: F12 → Console

### Reset Data
Delete `ecommerce.db` and restart backend

---

## 🚀 Deploy Tips

1. Change JWT_SECRET
2. Use HTTPS
3. Use PostgreSQL instead of SQLite
4. Add environment variables
5. Set NODE_ENV=production
6. Enable CORS for your domain only

---

## 📞 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | Kill process / use different port |
| npm not found | Install Node.js |
| CORS error | Check backend is running |
| 404 on pages | Use http-server, not file:// |
| Database error | Delete .db file and restart |
| Cart not working | Check localStorage permission |

---

## ✅ Quick Verification

```powershell
# Backend running?
curl http://localhost:5000/api/health

# Frontend running?
curl http://localhost:8000

# Database exists?
Test-Path backend/ecommerce.db

# All dependencies?
npm list
```

---

## 🎓 Learning Resources

**Backend Concepts:**
- Express.js routing
- SQLite queries
- JWT authentication
- REST API design

**Frontend Concepts:**
- DOM manipulation
- Fetch API
- localStorage
- Responsive CSS

---

## 🌟 Pro Tips

1. Use browser DevTools (F12)
2. Check Network tab for API calls
3. Use Application tab to view localStorage
4. Console tab shows all errors
5. Responsive design mode (Ctrl+Shift+M)
6. Use format on save (VSCode)
7. Git commit your changes
8. Test on mobile view

---

## 📞 Support

- Documentation: Read `.md` files
- Code: Comments in source files
- Errors: Check browser console
- Issues: Review TESTING_GUIDE.md

---

## 🎉 Ready?

1. Start backend: `npm start` (backend folder)
2. Start frontend: `python -m http.server 8000` (frontend folder)
3. Open http://localhost:8000
4. Have fun! 🛍️

---

**Last Updated:** 2026-06-03
**Status:** Ready to Use ✅
**Version:** 1.0
