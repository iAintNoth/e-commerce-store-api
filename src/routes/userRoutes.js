// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth } = require('../middleware/authMiddleware');

// GET user's cart
router.get('/cart', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('cart.product');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
    try {
      const { username, email, shippingAddress, paymentInfo, notificationPreferences } = req.body;
      const user = await User.findById(req.userId);
      if (username) user.username = username;
      if (email) user.email = email;
      if (shippingAddress) user.shippingAddress = shippingAddress;
      if (paymentInfo) user.paymentInfo = paymentInfo;
      if (notificationPreferences) user.notificationPreferences = notificationPreferences;
      await user.save();
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
// Add a product to user's cart
router.post('/cart/add', requireAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.userId);
    const productIndex = user.cart.findIndex(item => item.product == productId);
    if (productIndex !== -1) {
      user.cart[productIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    res.status(201).json(user.cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update quantity of a product in user's cart
router.put('/cart/update', requireAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.userId);
    const productIndex = user.cart.findIndex(item => item.product == productId);
    if (productIndex !== -1) {
      user.cart[productIndex].quantity = quantity;
      await user.save();
      res.json(user.cart);
    } else {
      res.status(404).json({ error: 'Product not found in cart' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove a product from user's cart
router.delete('/cart/remove/:productId', requireAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.userId);
    user.cart = user.cart.filter(item => item.product != productId);
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
