const express = require("express")
const route = express.Router()
const { getLoggedInUserInfo, changeName, changePassword } = require("../controllers/user.controller")

route.get("/loggedin", getLoggedInUserInfo)
route.patch("/change-name", changeName)
route.patch("/change-password", changePassword)


module.exports = route