// index.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const i18n = require('i18n');
const { requireAuth } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Configurazione i18n
i18n.configure({
  locales: ['en', 'it'], // Lingue supportate
  directory: __dirname + '/locales',
  defaultLocale: 'en',
  cookie: 'locale',
  queryParameter: 'lang',
});

// Middleware per gestire le lingue
app.use(i18n.init);

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

mongoose.connect('mongodb://localhost/negozio-online', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));
