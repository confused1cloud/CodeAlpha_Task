const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || "secret123";

// 1. Function to create a token
function setUser(user) {
    return jwt.sign(
        { _id: user._id, email: user.email, role: user.role || "customer" },
        secret,
        { expiresIn: '1hr' }
    );
}

// 2. Function to decode a token
function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}

// 3. THE MISSING PIECE: The Middleware Function
const checkForAuthorization = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// 4. Now this line will work because all three are defined above!
module.exports = { setUser, getUser, checkForAuthorization };