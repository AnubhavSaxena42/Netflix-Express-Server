const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

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
    return res.status(201).json(user);
  } catch (e) {
    return res.status(500).json(e);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json("Wrong password or username");
    console.log(user.password, process.env.SECRET_KEY);
    const decryptedPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    ).toString(CryptoJs.enc.Utf8);
    if (decryptedPassword !== req.body.password) {
      console.log(decryptedPassword, req.body.password);
      return res.status(401).json("Incorrect Password");
    }
    const accessToken = jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "5d",
      }
    );

    const { password, ...info } = user._doc;
    return res.status(200).json({ ...info, accessToken });
  } catch (e) {
    return res.status(500).json(e);
  }
});

module.exports = router;
