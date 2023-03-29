const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema({
  by: {
    type: ObjectId,
    required: true,
    ref: "user",
  },
  task: {
    type: String,
  },
  image: String,
  done: Boolean,
  date: Date,
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("todo", schema);
