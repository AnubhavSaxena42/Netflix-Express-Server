const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const verify = require("../verifyToken");

//UPDATE
router.put("/:id", verify, async (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin)
    return res.status(403).json("Not authorized");
  if (req.body.password) {
    req.body.password = CryptoJs.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    const { password, ...response } = updatedUser._doc;
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json("Server Error");
  }
});

//DELETE
router.delete("/:id", verify, async (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin)
    return res.status(403).json("Not authorized");
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json("User has been deleted.");
  } catch (e) {
    return res.status(500).json("Server Error");
  }
});

//GET
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    return res.status(200).json(info);
  } catch (e) {
    console.log("in 1");
    return res.status(500).json("Server Error");
  }
});

//GET ALL
router.get("/", verify, async (req, res) => {
  const query = req.query.new;
  console.log("what", req.user);
  if (!req.user.isAdmin) return res.status(403).json("Not authorized");
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(10)
      : await User.find();
    return res.status(200).json(users);
  } catch (e) {
    console.log();
    return res.status(500).json("Server Error");
  }
});

//USER STATS
router.get("/stats", async (req, res) => {
  console.log("w");
  const today = new Date();
  const lastYear = today.setFullYear(today.setFullYear() - 1);

  const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(data);
  } catch (e) {
    console.log("here");
    return res.status(500).json(`Server error`);
  }
});

module.exports = router;
