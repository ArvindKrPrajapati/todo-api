const movie = require("../modals/movies.modal");

const add = async (req, res) => {
  try {
    const varify = await movie.findOne({
      tmdb_id: req.body.tmdb_id
    });
    if (varify) {
      return res
      .status(401)
      .json({
        success: false, error: "movie already exists"
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
      success: false, error: "server error"
    });
  }
};

const addLinks = async (req, res) => {
  try {
    let {
      tmdb_id
    } = req.params;
    if (!tmdb_id) {
      return res
      .status(400)
      .json({
        success: false, error: "tmdb_id is required"
      });
    }

    const varify = await user.findOne({
      tmdb_id
    });
    if (!varify) {
      return res
      .status(500)
      .json({
        success: false, error: "movie doesn't exist with this id"
      });
    }
    const data = await movie.findAndUpdate({
      tmdb_id
    }, {
      $push: {
        video: req.body
      }
    }, {
      new: true
    })
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false, error: "server error"
    });
  }
};
const getAll = async (req, res)=> {
  try {
    const skip = Number(req.query.skip) || 0
    const limit = Number(req.query.limit) || 20
    const data = await movie.find().sort({
      release_date: -1
    }).skip(skip).limit(limit)
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false, error: "server error"
    });
  }
}
module.exports = {
  add
  addLinks,
  getAll
};