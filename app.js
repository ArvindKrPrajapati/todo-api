const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

// routes
const auth = require("./routes/auth.route");
const todo = require("./routes/todo.route");
const user = require("./routes/user.route");
const mverse = require("./routes/movie.route");
const html = require("./routes/html/movies.routes");

// middleware
const authlogin = require("./middleware/auth.middleware");

const PORT = process.env.PORT || 3000;
app.use(express.static("public"));
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set the views directory

app.use(express.json());
app.use(cors());

app.use("/v1/auth", auth);
app.use("/v1/mverse", mverse);
app.use("/", html);
app.use("/v1/todo", authlogin, todo);
app.use("/v1/user", authlogin, user);

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome" });
});

const init = async () => {
  try {
    await mongoose.connect(process.env.URL);
    app.listen(PORT, () => console.log("server is listening at PORT " + PORT));
  } catch (error) {
    console.log(error);
  }
};
init();
