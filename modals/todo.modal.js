const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("todo", schema);
