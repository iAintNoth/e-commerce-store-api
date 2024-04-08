// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// GET all products
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.category) {
      const category = await Category.findOne({ name: req.query.category });
      query = { category: category._id };
    }
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET products by search criteria
router.get('/search', async (req, res) => {
  try {
    const { keyword, minPrice, maxPrice, category } = req.query;
    let query = {};
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    if (category) {
      const categoryObj = await Category.findOne({ name: category });
      if (categoryObj) {
        query.category = categoryObj._id;
      }
    }
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
