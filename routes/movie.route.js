const express = require("express");
const route = express.Router();
const {
  add,
  getAll,
  liveSearch,
  getById,
  addMany,
} = require("../controllers/movies.controller");
const { scrapper } = require("../controllers/scrapper.controller");

route.get("/all", getAll);
route.get("/all", getAll);
route.get("/details/:tmdb_id", getById);
route.get("/search", liveSearch);
route.post("/add", add);
route.post("/add-many", addMany);
route.get("/scrap", scrapper);
module.exports = route;
