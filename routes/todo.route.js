const express = require("express");
const route = express.Router();
const {
  addTask,
  getPendingTask,
  getDoneTask,
  toggleTodoStatus,
  deleteTodo,
  getTodaysTask,
  editTask,
} = require("../controllers/todo.controller");

route.post("/add", addTask);
route.get("/pending-todo", getPendingTask);
route.get("/todays-task", getTodaysTask);
route.get("/completed-todo", getDoneTask);
route.patch("/change-done-status", toggleTodoStatus);
route.patch("/edit", editTask);
route.delete("/delete-todo/:todoid", deleteTodo);

module.exports = route;
