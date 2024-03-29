const express = require("express");
const route = express.Router();
const {
  getHome,
  getPlay,
  discover,
  getPlayTv,
} = require("../../controllers/html/movies.controller");

route.get("/", getHome);
route.get("/play/:tmdb_id", getPlay);
route.get("/play/:tmdb_id/:season/:episode", getPlayTv);
route.get("/discover/all", discover);
route.get("/discover/:type/:country", discover);

module.exports = route;
