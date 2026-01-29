const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const { setUser } = require('../service/auth');

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).render("signup", { error: "User already exists" });
  }
  
  await User.create({ name, email, password, role: "NORMAL" });
  return res.redirect("/login");
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  
  if (!user) {
    return res.render("login", { error: "Invalid username or password" });
  }

  const token = setUser(user);
  res.cookie('token', token);
  return res.redirect('/');
}

module.exports = { 
  handleUserSignup, 
  handleUserLogin 
};