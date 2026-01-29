const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

// 1. MIDDLEWARE
app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500' 
}))

// 2. DATABASE CONNECTION
mongoose.connect("mongodb://127.0.0.1:27017/restaurant")
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch(err => console.error("❌ Connection Failed:", err));  // Install: npm install cors





const authRoutes = require('./routes/auth');
const { createOrder } = require('./controllers/op');
const { checkForAuthorization } = require('./service/auth');
const { reserveTable } = require('./controllers/table'); // Make sure this import is correct!
// Add this BEFORE all other routes to test
app.get('/test', (req, res) => {
  res.json({ message: "Server is working!" });
});
// Simple menu endpoint
app.get('/menu', async (req, res) => {
  try {
    const MenuItem = require('./models/menuitems');
    const items = await MenuItem.find({});
    
    res.json({
      items: items.map(item => ({
        id: item._id,
        name: item.name,
        price: item.price,
        category: item.category
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Add this route to see menu items
app.get('/menu-items', async (req, res) => {
  try {
    const MenuItem = require('./models/menuitems');
    const items = await MenuItem.find({});
    
    if (items.length === 0) {
      return res.json({ 
        error: "NO MENU ITEMS IN DATABASE!",
        solution: "Run: node seedDatabase.js"
      });
    }
    
    res.json({
      count: items.length,
      items: items.map(item => ({
        id: item._id,
        name: item.name,
        price: item.price
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const path = require('path');

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// If your frontend files are in root, serve them
app.use(express.static(__dirname));

// Route for main pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'menu.html'));
});

app.get('/reservation', (req, res) => {
  res.sendFile(path.join(__dirname, 'reservation.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/test/table', async (req, res) => {
  try {
    const Table = require('./models/table');
    const tables = await Table.find({});
    res.json({ 
      message: `Found ${tables.length} tables`,
      tables 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get user's current reservation
app.get('/my-reservation', checkForAuthorization, async (req, res) => {
  try {
    const Table = require('./models/table');
    const reservation = await Table.findOne({
      reservedBy: req.user._id,
      isAvailable: false
    });
    
    if (!reservation) {
      return res.json({ hasReservation: false });
    }
    
    res.json({
      hasReservation: true,
      reservation: {
        tableNumber: reservation.tablenumber,
        capacity: reservation.capacity,
        reservedAt: reservation.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all tables status
app.get('/tables', async (req, res) => {
  try {
    const Table = require('./models/table');
    const tables = await Table.find({});
    
    res.json({
      tables: tables.map(table => ({
        number: table.tablenumber,
        capacity: table.capacity,
        available: table.isAvailable
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Then add your other routes...

// 4. ROUTES
app.use('/auth', authRoutes);

// Order route
app.post('/order', checkForAuthorization, createOrder);

// Table reservation route - THIS IS THE IMPORTANT ONE!
app.put('/table/reserve/:number', checkForAuthorization, reserveTable);

// 5. START SERVER
app.listen(3000, () => console.log("🚀 Server alive at http://localhost:3000"));