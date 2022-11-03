const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema({
    by: {
        type: ObjectId,
        required: true,
        ref: 'user'
    },
    task: {
        type: String
    },
    done: Boolean,
    datetime: { type: Date, default: Date.now }

})

module.exports = mongoose.model("todo", schema)