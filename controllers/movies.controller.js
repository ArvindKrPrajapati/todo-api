const movie = require("../modals/movies.model");

const add = async (req, res) => {
  try {
    const varify = await movie.findOne({
      tmdb_id: req.body.tmdb_id,
    });
    if (varify) {
      return res.status(401).json({
        success: false,
        error: "movie already exists",
      });
    }
    const data = await movie.create(req.body);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "server error",
    });
  }
};

const addLinks = async (req, res) => {
  try {
    let { tmdb_id } = req.params;
    if (!tmdb_id) {
      return res.status(400).json({
        success: false,
        error: "tmdb_id is required",
      });
    }

    const varify = await movie.findOne({
      tmdb_id,
    });
    if (!varify) {
      return res.status(500).json({
        success: false,
        error: "movie doesn't exist with this id",
      });
    }
    const data = await movie.findOneAndUpdate(
      {
        tmdb_id,
      },
      {
        $push: {
          video: req.body,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "server error",
    });
  }
};
const getAll = async (req, res) => {
  try {
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 20;
    let filter = {};
    const type = req.query.type;
    const country = req.query.country;
    if (type) {
      filter["type"] = type;
    }
    if (country) {
      filter["country"] = country;
    }

    const data = await movie
      .find(filter)
      .sort({
        release_date: -1,
      })
      .skip(skip)
      .limit(limit);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "server error",
    });
  }
};

const liveSearch = async (req, res) => {
  try {
    const { name } = req.query;
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 20;

    const data = await movie
      .find({ title: { $regex: "^" + name, $options: "i" } })
      .sort({ release_date: -1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
};
const getById = async (req, res) => {
  try {
    const { tmdb_id } = req.params;

    const data = await movie.findOne({ tmdb_id });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
};

module.exports = {
  add,
  addLinks,
  getAll,
  liveSearch,
  getById,
};
