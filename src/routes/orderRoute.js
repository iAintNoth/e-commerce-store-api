// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { requireAuth } = require('../middleware/authMiddleware');
const transporter = require('../utils/email');

// GET all orders
router.get('/', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new order
router.post('/', requireAuth, async (req, res) => {
    try {
      const { products, totalPrice } = req.body;
      const order = new Order({ user: req.userId, products, totalPrice });
      await order.save();
      
      // Send confirmation email to user
      const user = await User.findById(req.userId);
      const mailOptions = {
        from: 'your-email@gmail.com', // Inserisci qui il tuo indirizzo email
        to: user.email,
        subject: 'Conferma Ordine',
        text: `Grazie per il tuo ordine! Il tuo ordine è stato confermato con successo.`
      };
      await transporter.sendMail(mailOptions);
  
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

module.exports = router;
