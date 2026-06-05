const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's orders
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, orders) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(orders);
    }
  );
});

// Get order details
router.get('/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  db.get(
    'SELECT * FROM orders WHERE id = ? AND user_id = ?',
    [id, userId],
    (err, order) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      db.all(
        `SELECT oi.*, p.name, p.image_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [id],
        (err, items) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ ...order, items });
        }
      );
    }
  );
});

// Create order from cart
router.post('/checkout', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // Get cart items
  db.all(
    `SELECT c.product_id, c.quantity, p.price
     FROM cart c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?`,
    [userId],
    (err, cartItems) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // Calculate total
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Create order
      db.run(
        'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
        [userId, totalAmount, 'confirmed'],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          const orderId = this.lastID;

          // Insert order items
          let insertedItems = 0;
          cartItems.forEach(item => {
            db.run(
              'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
              [orderId, item.product_id, item.quantity, item.price],
              (err) => {
                if (err) {
                  console.error('Error inserting order item:', err);
                }
                insertedItems++;

                // After all items are inserted, clear cart
                if (insertedItems === cartItems.length) {
                  db.run('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
                    res.status(201).json({
                      message: 'Order created successfully',
                      order: {
                        id: orderId,
                        user_id: userId,
                        total_amount: totalAmount,
                        status: 'confirmed',
                        items: cartItems
                      }
                    });
                  });
                }
              }
            );
          });
        }
      );
    }
  );
});

module.exports = router;
