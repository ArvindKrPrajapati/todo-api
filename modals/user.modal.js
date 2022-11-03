const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    mobile: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    datetime: { type: Date, default: Date.now }

})

module.exports = mongoose.model("user", schema)