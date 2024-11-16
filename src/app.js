require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Add this line to import mongoose
const connectDB = require('./config/db.config');
const passport = require('./services/auth.service');
const session = require('express-session');
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow only your frontend's origin
  credentials: true, // Enable credentials for session management
}));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret key from .env
    resave: false, // Avoid resaving session data unnecessarily
    saveUninitialized: true, // Save uninitialized sessions
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
connectDB();

// Enable Mongoose debug mode for detailed logs
mongoose.set('debug', true); // Add this line after importing mongoose

// Define routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/customers', require('./routes/customer.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/campaigns', require('./routes/campaign.routes'));

// Default error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
