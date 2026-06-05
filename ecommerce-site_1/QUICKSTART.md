# Quick Start Guide

## Start Backend Server

Open PowerShell and run:

```powershell
# Navigate to backend directory
cd "d:\PROGRAMMING\Internship Projects\ecommerce-site\backend"

# Install dependencies (first time only)
npm install

# Start the server
npm start
```

The backend will start on **http://localhost:5000**

## Start Frontend Server

Open another PowerShell and run:

```powershell
# Navigate to frontend directory
cd "d:\PROGRAMMING\Internship Projects\ecommerce-site\frontend"

# Start Python web server (Python 3)
python -m http.server 8000

# OR use http-server if you prefer
npm install -g http-server
http-server
```

The frontend will run on **http://localhost:8000**

## Open in Browser

1. Open your browser
2. Go to: **http://localhost:8000**
3. You should see the E-Shop homepage

## Test the Application

### 1. Create Account
- Click "Login/Register"
- Switch to Register tab
- Fill in username, email, and password
- Click Register

### 2. Browse Products
- Click "Shop Now" or "Products"
- Click on any product to view details
- Click "Add to Cart"

### 3. Shopping Cart
- Click "Cart" in navigation
- See your items
- Adjust quantities or remove items
- Click "Proceed to Checkout"

### 4. Place Order
- After checkout, order is created
- Click "Orders" to see your orders
- Click on order to see details

## Troubleshooting

### Backend won't start
- Make sure Node.js is installed: `node --version`
- Check if port 5000 is available
- Delete `node_modules` folder and run `npm install` again

### Frontend shows CORS errors
- Make sure backend is running on port 5000
- Check browser console for exact error

### Can't connect to backend
- Verify backend is running: `http://localhost:5000/api/health`
- Check if port 5000 is in use

## Default Test Account

You can register your own account or test with any credentials.

## File Locations

- Backend code: `d:\PROGRAMMING\Internship Projects\ecommerce-site\backend\`
- Frontend code: `d:\PROGRAMMING\Internship Projects\ecommerce-site\frontend\`
- Database: `d:\PROGRAMMING\Internship Projects\ecommerce-site\backend\ecommerce.db`

Enjoy! 🎉
