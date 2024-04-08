// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  totalPrice: Number,
  status: { type: String, default: 'pending' } // Possibili valori: 'pending', 'processing', 'shipped', 'delivered'
});

module.exports = mongoose.model('Order', orderSchema);
