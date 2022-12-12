const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const moviesRoute = require("./routes/movies");

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    console.log("DB connected");
  })
  .catch((e) => console.log("DB connection failed", e));

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/movies", moviesRoute);

app.listen(8800, () => {
  console.log("express running");
});
