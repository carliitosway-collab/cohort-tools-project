const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User.model");
const isAuthenticated = require("../middleware/jwt.middleware");


router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }


    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

 
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      email,
      password: hashedPassword,
      name,
    });

    res.status(201).json({ message: "User created" });
  } catch (err) {
    next(err);
  }
});


router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.json({ authToken });
  } catch (err) {
    next(err);
  }
});


router.get("/verify", isAuthenticated, (req, res) => {
  res.json(req.payload);
});

module.exports = router;
