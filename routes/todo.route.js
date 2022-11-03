const express = require("express")
const route = express.Router()
const { addTask, getPendingTask, getDoneTask, toggleTodoStatus, deleteTodo } = require("../controllers/todo.controller")

route.post("/add", addTask)
route.get("/pending-todo", getPendingTask)
route.get("/completed-todo", getDoneTask)
route.patch("/change-done-status", toggleTodoStatus)
route.delete("/delete-todo", deleteTodo)

module.exports = route