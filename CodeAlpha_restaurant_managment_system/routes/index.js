// routes/index.js
const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth.routes');
const orderRoutes = require('./order.routes');
const tableRoutes = require('./table.routes');

// Use routes
router.use('/auth', authRoutes);
router.use('/order', orderRoutes);
router.use('/table', tableRoutes);

module.exports = router;