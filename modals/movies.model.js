const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    tmdb_id: {
      type: String,
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
    season: {
      type: String,
    },
    episode: {
      type: String,
    },
    video: [
      {
        resolution: String,
        language: String,
        source: String,
        size: String,
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
