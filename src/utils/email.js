// utils/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Inserisci qui il tuo indirizzo email
    pass: 'your-password' // Inserisci qui la tua password
  }
});

module.exports = transporter;
