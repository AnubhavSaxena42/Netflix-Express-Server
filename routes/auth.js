const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });
  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (e) {
    res.status(500).json(e);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
