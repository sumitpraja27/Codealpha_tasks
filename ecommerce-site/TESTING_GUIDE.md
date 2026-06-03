# Testing Guide

## Step-by-Step Testing Guide

This guide will help you test all features of the e-commerce application.

---

## 1. Setup & Launch

### Start Backend
```powershell
cd "d:\PROGRAMMING\Internship Projects\ecommerce-site\backend"
npm install  # First time only
npm start
```
✅ Verify: http://localhost:5000/api/health returns `{"status": "Server is running"}`

### Start Frontend
```powershell
cd "d:\PROGRAMMING\Internship Projects\ecommerce-site\frontend"
python -m http.server 8000
```
✅ Verify: http://localhost:8000 shows E-Shop homepage

---

## 2. User Authentication Testing

### Test Registration
1. Click "Login/Register" in navigation
2. Click "Register here" to switch to register form
3. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Click "Register"
5. ✅ Should see "Registration successful!" alert
6. ✅ Should be redirected to home page
7. ✅ Navigation should show "Cart" and "Orders" links

### Test Login
1. Click "Logout" to logout current session
2. Click "Login/Register"
3. Fill in:
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Login"
5. ✅ Should see "Login successful!" alert
6. ✅ Should see authenticated navigation items

### Test Invalid Credentials
1. Try logging in with wrong password
2. ✅ Should show "Invalid credentials" error
3. Try logging in with non-existent email
4. ✅ Should show "Invalid credentials" error

---

## 3. Product Browsing Testing

### View Featured Products
1. From home page, scroll to "Featured Products"
2. ✅ Should see 6 products displayed
3. ✅ Each product should have: name, price, image, "In Stock" label

### Browse All Products
1. Click "Shop Now" button or "Products" in navigation
2. ✅ Should see all 6 products in grid
3. ✅ Products should be responsive (shrink on smaller screens)

### View Product Details
1. Click on any product card
2. ✅ Modal should appear with:
   - Large product image
   - Full description
   - Price
   - Stock information
   - Quantity selector (only if logged in)
   - Add to Cart button (only if logged in)

### Test Product Details - Not Logged In
1. Logout first
2. Click on a product
3. ✅ Should show modal without "Add to Cart" button
4. ✅ Should show login prompt instead

---

## 4. Shopping Cart Testing

### Add to Cart
1. Log in first
2. Click on any product
3. Set quantity to 2 (or any number)
4. Click "Add to Cart"
5. ✅ Should see "Item added to cart!" alert
6. ✅ Cart count in navigation should update
7. Close modal and repeat for different products
8. ✅ Cart count should accumulate

### View Cart
1. Click "Cart" in navigation
2. ✅ Should see all items you added
3. ✅ Each item should show: image, name, price, quantity, total
4. ✅ Order summary should show correct subtotal and total

### Update Quantities
1. On cart page, change quantity in an item
2. ✅ Total should update immediately
3. Try setting quantity to 0
4. ✅ Should prevent invalid quantity or show error

### Remove Items
1. Click "Remove" button on a cart item
2. ✅ Item should disappear from cart
3. ✅ Totals should update
4. ✅ Cart count in navigation should decrease

### Clear Cart
1. (Optional) Add some items to cart
2. Click "Clear" (implement this feature)
3. ✅ Cart should be empty

### Empty Cart Message
1. Remove all items from cart (or checkout)
2. Return to cart page
3. ✅ Should show "Your cart is empty" message
4. ✅ Should have link to "Continue Shopping"
5. ✅ Checkout button should be disabled

---

## 5. Checkout & Order Processing

### Checkout Process
1. Add items to cart
2. Go to cart page
3. Click "Proceed to Checkout"
4. ✅ Should see "Order placed successfully!" alert with Order ID
5. ✅ Should be redirected to orders page
6. ✅ Cart should be cleared
7. ✅ New order should appear in orders list

### Insufficient Stock
1. Try adding more items than available stock
2. ✅ Should show error "Insufficient stock"
3. ✅ Item should not be added to cart

---

## 6. Order Management Testing

### View Orders
1. After placing an order, click "Orders" in navigation
2. ✅ Should see your order(s) listed
3. ✅ Each order should show: Order #ID, status, date, total

### Order Details
1. Click on any order in the list
2. ✅ Modal should show:
   - Order number
   - Status (confirmed)
   - Order date
   - Total amount
   - List of items with quantities and prices

### Multiple Orders
1. Add different items to cart
2. Checkout
3. Repeat 2-3 times
4. Go to Orders page
5. ✅ Should see all orders listed
6. ✅ Orders should be sorted by newest first

---

## 7. Responsive Design Testing

### Desktop View
1. View all pages at full screen (1920px+)
2. ✅ Should display properly with good spacing
3. ✅ Products should be in 4-column grid

### Tablet View
1. Resize browser to 768px width
2. ✅ Navigation should become hamburger menu
3. ✅ Products should be in 2-column grid
4. ✅ All content should be readable

### Mobile View
1. Resize browser to 375px width
2. ✅ Navigation should be compact hamburger
3. ✅ Products should be in 1-column
4. ✅ Touch-friendly buttons
5. ✅ Modals should fit screen

---

## 8. Navigation Testing

### All Links Work
1. Click each navigation link:
   - Home ✅
   - Products ✅
   - Cart (when logged in) ✅
   - Orders (when logged in) ✅
   - Logout ✅

### Hamburger Menu (Mobile)
1. Resize to mobile view
2. Click hamburger icon
3. ✅ Menu should expand
4. ✅ All links should be clickable
5. Click a link
6. ✅ Menu should collapse

---

## 9. Session Management

### Persistent Login
1. Log in
2. Refresh the page
3. ✅ Should still be logged in
4. ✅ Navigation should show authenticated state

### Logout
1. Click Logout
2. ✅ Should return to home page
3. ✅ Navigation should show "Login/Register"
4. Refresh page
5. ✅ Should still be logged out

### Protected Routes
1. Log out
2. Try accessing `/pages/cart.html`
3. ✅ Should be redirected to login
4. Log in
5. ✅ Can now access cart

---

## 10. Data Persistence Testing

### Database Check
1. Place an order
2. Stop backend server
3. Stop frontend
4. Start backend again
5. Start frontend
6. Log in with same account
7. ✅ Order should still be there
8. ✅ Cart history should be preserved (if applicable)

---

## 11. Error Handling Testing

### Network Errors
1. Stop backend server
2. Try to add to cart
3. ✅ Should show error message
4. Start backend again

### Validation Errors
1. Try registering with:
   - Existing email ✅ Should error
   - Password mismatch ✅ Should error
   - Missing fields ✅ Should error

### Stock Errors
1. Try adding more items than stock
2. ✅ Should show appropriate error

---

## 12. Visual Testing

### Colors & Design
1. ✅ Blue navigation bar
2. ✅ Purple gradient hero section
3. ✅ White cards with shadows
4. ✅ Red prices
5. ✅ Green stock indicators

### Fonts & Readability
1. ✅ All text is readable
2. ✅ Headings are prominent
3. ✅ Buttons are clear

### Images
1. ✅ All product images load
2. ✅ Images are properly sized
3. ✅ No broken image icons

---

## 13. Performance Testing

### Page Load Time
1. Open home page
2. ✅ Should load quickly (<2 seconds)
3. Click to products
4. ✅ Should load quickly

### Smooth Interactions
1. Add multiple items to cart quickly
2. ✅ Should respond smoothly
3. No lag or freezing

---

## Sample Test Data

### Test User 1
- Username: `testuser`
- Email: `test@example.com`
- Password: `password123`

### Test User 2
- Username: `customer`
- Email: `customer@example.com`
- Password: `password456`

### Available Products
1. Laptop - $999.99 (10 in stock)
2. Wireless Mouse - $29.99 (50 in stock)
3. USB-C Cable - $14.99 (100 in stock)
4. Mechanical Keyboard - $89.99 (25 in stock)
5. Monitor - $349.99 (15 in stock)
6. Headphones - $199.99 (30 in stock)

---

## Troubleshooting During Testing

### Issue: "Cannot find module"
**Solution:** Run `npm install` in backend directory

### Issue: CORS Error
**Solution:** Make sure backend is running on port 5000

### Issue: 404 on product page
**Solution:** Make sure you're using relative paths (frontend not running from file://)

### Issue: Blank page
**Solution:** 
- Check browser console (F12)
- Verify both servers are running
- Clear browser cache

### Issue: Cart not updating
**Solution:**
- Check network tab for failed requests
- Verify JWT token in localStorage
- Check backend logs for errors

---

## Success Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Product listing displays
- [ ] Product details modal opens
- [ ] Add to cart works
- [ ] Cart updates correctly
- [ ] Checkout creates order
- [ ] Orders display
- [ ] Order details show
- [ ] Logout works
- [ ] Session persists
- [ ] Mobile responsive
- [ ] No console errors
- [ ] All links work

✅ **All tests pass? You're ready to deploy!**

---

**Happy Testing! 🧪**
