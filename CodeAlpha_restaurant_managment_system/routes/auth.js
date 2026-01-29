const express = require('express');
const bcrypt = require('bcrypt');
const { setUser, checkForAuthorization } = require('../service/auth');
const User = require("../models/user");
const router = express.Router();
const {
  createOrder,
  cancelOrder,
  updateOrderStatusController
} = require("../controllers/op");


router.post('/register', async (req, res) => {
    console.log("Incoming Body:", req.body);
    try {
        // Safety check: if req.body is missing, don't crash
        const { email, name, password } = req.body || {};
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields (name, email, password) are required' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ 
            name, 
            email: email.toLowerCase(), 
            password: hashedPassword 
        });
        
        const token = setUser(user);
        res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logic for Login...
router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = setUser(user);
    res.json({ token });
});
router.post("/order",checkForAuthorization, createOrder);
router.post("/order/:orderId/cancel",checkForAuthorization, cancelOrder);
router.patch("/order/:orderId/status",checkForAuthorization, updateOrderStatusController);

module.exports = router;
    