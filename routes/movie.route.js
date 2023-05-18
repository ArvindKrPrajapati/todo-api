const express = require("express");
const route = express.Router();
const {
  add,
  addLinks,
  getAll,
  liveSearch,
  getById,
} = require("../controllers/movies.controller");

route.get("/all", getAll);
route.get("/all", getAll);
route.get("/details/:tmdb_id", getById);
route.get("/search", liveSearch);
route.patch("/:tmdb_id", addLinks);
route.post("/add", add);

module.exports = route;