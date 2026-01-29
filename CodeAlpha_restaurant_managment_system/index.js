const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); // Path to your login/register routes
const { createOrder } = require('./controllers/orderController'); // Path to your order logic
const { checkForAuthorization } = require('./middleware/auth'); // Path to your auth check

dotenv.config();
const app = express();

// Middleware to read JSON from Postman
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/restaurant")
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error("Could not connect...", err));

// Routes
app.use('/auth', authRoutes); // This handles /api/users/login and /api/users/register

// The Order Route (Protected by your middleware)
app.post('/api/orders', checkForAuthorization, createOrder);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));