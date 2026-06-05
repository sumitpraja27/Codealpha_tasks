const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image_url
     FROM cart c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?`,
    [userId],
    (err, items) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(items);
    }
  );
});

// Add item to cart
router.post('/add', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ error: 'Product ID and quantity are required' });
  }

  // Check if product exists and has stock
  db.get('SELECT * FROM products WHERE id = ?', [product_id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Check if item already in cart
    db.get(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, product_id],
      (err, cartItem) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (cartItem) {
          // Update quantity
          db.run(
            'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
            [quantity, userId, product_id],
            (err) => {
              if (err) {
                return res.status(500).json({ error: 'Database error' });
              }
              res.json({ message: 'Cart updated' });
            }
          );
        } else {
          // Insert new item
          db.run(
            'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
            [userId, product_id, quantity],
            (err) => {
              if (err) {
                return res.status(500).json({ error: 'Database error' });
              }
              res.status(201).json({ message: 'Item added to cart' });
            }
          );
        }
      }
    );
  });
});

// Update cart item quantity
router.put('/update/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Valid quantity is required' });
  }

  db.run(
    'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
    [quantity, id, userId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Cart item updated' });
    }
  );
});

// Remove item from cart
router.delete('/remove/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  db.run(
    'DELETE FROM cart WHERE id = ? AND user_id = ?',
    [id, userId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Item removed from cart' });
    }
  );
});

// Clear cart
router.delete('/clear', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.run('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Cart cleared' });
  });
});

module.exports = router;
