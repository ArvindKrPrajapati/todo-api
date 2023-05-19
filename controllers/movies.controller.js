const movie = require("../modals/movies.model");

const add = async (req, res) => {
  try {
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

   /* const data = await movie
      .find(filter)
      .sort({
        release_date: -1,
      })
      .skip(skip)
      .limit(limit);*/
      
      
 

    const pipeline = [
  {
    $match: filter
  },
  {
    $group: {
      _id: '$tmdb_id',
      count: { $sum: 1 },
      document: { $first: '$$ROOT' }
    }
  },
  {
    $match: {
      count: { $eq: 1 }
    }
  },
  {
    $sort: {
      'document.release_date': -1
    }
  },
  {
    $skip: skip
  },
  {
    $limit: limit
  },
  {
    $replaceRoot: {
      newRoot: '$document'
    }
  },
  {
    $project: {
      _id: 0
    }
  }
];


    const data = await movie.aggregate(pipeline)
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

    const data = await movie.aggregate([
  {
    $match: { title: { $regex: "^" + name, $options: "i" } }
  },
  {
    $sort: { release_date: -1 }
  },
  {
    $group: {
      _id: "$tmdb_id",
      document: { $first: "$$ROOT" }
    }
  },
  {
    $skip: skip
  },
  {
    $limit: limit
  },
  {
    $replaceRoot: {
      newRoot: "$document"
    }
  }
]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
};
const getById = async (req, res) => {
  try {
    const { tmdb_id } = req.params;
    const data = await movie.find({ tmdb_id });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
};

module.exports = {
  add,
  getAll,
  liveSearch,
  getById,
};
