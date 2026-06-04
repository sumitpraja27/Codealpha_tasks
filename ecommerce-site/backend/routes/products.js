const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  db.all('SELECT * FROM products', (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(products);
  });
});

// Get products by category (must be before /:id to avoid route conflict)
router.get('/category/:category', (req, res) => {
  const { category } = req.params;

  db.all('SELECT * FROM products WHERE category = ?', [category], (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(products);
  });
});

// Get product by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  });
});

module.exports = router;
