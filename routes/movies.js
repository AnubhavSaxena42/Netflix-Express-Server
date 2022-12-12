const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verifyToken");

//CREATE
router.post("/", verify, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json("Not Authorized");
  const movie = new Movie(req.body);
  try {
    const savedMovie = await movie.save();
    return res.status(200).json(savedMovie);
  } catch (e) {
    return res.status(500).json("Server Error");
  }
});

//UPDATE
router.put("/:id", verify, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json("Not Authorized");

  try {
    const updatedMovie = Movie.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    return res.status(200).json(updatedMovie);
  } catch (e) {
    return res.status(500).json("Server Error");
  }
});

//DELETE
router.delete("/:id", verify, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json("Not Authorized");
  try {
    await Movie.findByIdAndDelete(req.params.id);
    return res.status(200).json("Movie has been deleted");
  } catch (e) {
    return res.status(500).json("Server Error");
  }
});

//GET
router.get("/find/:id", verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    return res.status(200).json(movie);
  } catch (e) {
    return res.status(500).json("Server Error");
  }
});

//GET RANDOM
router.get("/random", verify, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series")
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);

    movie = await Movie.aggregate([
      { $match: { isSeries: false } },
      { $sample: { size: 1 } },
    ]);

    return res.status(200).json(movie);
  } catch (e) {
    return res.status(500).json("Server Error");
  }
});

//GET ALL
router.get("/", verify, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json("Not Authorized");
  try {
    const movies = await Movie.find();
    return res.status(200).json(movies.reverse());
  } catch (e) {
    return res.status(500).json("Server Error");
  }
});

module.exports = router;
