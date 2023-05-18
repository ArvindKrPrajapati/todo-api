const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    tmdb_id: {
      type: Number,
      required: true,
    },
    imdb_id: {
      type: String,
    },
    poster_path: {
      type: String,
    },
    backdrop_path: {
      type: String,
    },
    country: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
    },
    release_date: {
      type: Date,
      required: true,
    },
    video: [
      {
        resolution: Number,
        language: String,
        href: String,
        href_two: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("movies", schema);
