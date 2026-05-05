const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS Configuration — explicitly allow the React frontend
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes Placeholder
app.get('/', (req, res) => {
  res.send('Campus Eats API is running...');
});

// Import and use routes
app.use('/api/auth', require('./modules/auth/authRoutes'));
app.use('/api/user', require('./modules/user/userRoutes'));
app.use('/api/institutions', require('./modules/institution/institutionRoutes'));
app.use('/api/menu', require('./modules/menu/menuRoutes'));
app.use('/api/order', require('./modules/order/orderRoutes'));
app.use('/api/wallet', require('./modules/wallet/walletRoutes'));

module.exports = app;

