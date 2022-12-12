const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyToken");

//CREATE
router.post("/", verify, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json("Not Authorized");
  const newList = new List(req.body);
  try {
    const savedList = await newList.save();
    return res.status(200).json(savedList);
  } catch (e) {
    return res.status(500).json("Server Error");
  }
});

//DELETE
router.delete("/:id", verify, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json("Not Authorized");
  try {
    await List.findByIdAndDelete(req.params.id);
    return res.status(200).json("List has been deleted");
  } catch (e) {
    return res.status(500).json("Server Error");
  }
});

//GET LISTS
router.get("/", verify, async (req, res) => {
  const type = req.query.type;
  const genre = req.query.genre;
  let list = [];
  try {
    if (!type) {
      list = await List.aggregate([
        {
          $sample: { size: 10 },
        },
      ]);
    }
    if (!genre) {
      list = await List.aggregate([
        {
          $sample: { size: 10 },
        },
        {
          $match: { type: type },
        },
      ]);
    }
    list = await List.aggregate([
      {
        $sample: { size: 10 },
      },
      {
        $match: { type: type, genre: genre },
      },
    ]);
    return res.status(200).json(list);
  } catch (e) {
    return res.status(500).json("Server Error");
  }
});

module.exports = router;
