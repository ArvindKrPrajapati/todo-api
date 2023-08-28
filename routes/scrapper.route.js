const express = require("express");
const route = express.Router();
const { scrapper, newToxic } = require("../controllers/scrapper.controller");

route.get("/mp4mania", scrapper);
route.get("/newtoxic", newToxic);
module.exports = route;
