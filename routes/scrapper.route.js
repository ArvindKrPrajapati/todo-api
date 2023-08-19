const express = require("express");
const route = express.Router();
const { scrapper } = require("../controllers/scrapper.controller");

route.get("/mp4mania", scrapper);
module.exports = route;
