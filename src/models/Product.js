// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  // altri campi come categoria, immagini, disponibilità, ecc.
});

module.exports = mongoose.model('Product', productSchema);
