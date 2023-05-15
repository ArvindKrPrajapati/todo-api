



const express = require("express")
const route = express.Router()
const { add, addLinks, getAll } = require("../controllers/movies.controller")

route.get("/all", getAll)
route.patch("/:tmdb_id", addLinks)
route.post("/add", add)


module.exports = route