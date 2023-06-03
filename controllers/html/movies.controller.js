const movie = require("../../modals/movies.model");
const mverseGet = async (skip, limit, filter) => {
  const pipeline = [
    {
      $match: filter,
    },
    {
      $group: {
        _id: "$tmdb_id",
        document: {
          $first: "$$ROOT",
        },
      },
    },
    {
      $sort: {
        "document.release_date": -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $replaceRoot: {
        newRoot: "$document",
      },
    },
  ];
  const data = await movie.aggregate(pipeline);
  return data;
};

const getHome = async (req, res) => {
  try {
    const carousel = await mverseGet(0, 5, {});
    const indianMovie = await mverseGet(0, 9, {
      type: "movie",
      country: "India",
    });
    const indianTv = await mverseGet(0, 9, {
      type: "tv",
      country: "India",
    });
    const foreignMovie = await mverseGet(0, 9, {
      type: "movie",
      country: "foreign",
    });
    const foreignTv = await mverseGet(0, 9, {
      type: "tv",
      country: "foreign",
    });
    res.render("index", {
      carousel,
      indianMovie,
      foreignMovie,
      foreignTv,
      indianTv,
    });
  } catch (error) {
    console.log(error);
    return res.send("server erro");
  }
};

const getPlay = async (req, res) => {
  try {
    const { tmdb_id } = req.params;
    const data = await movie.find({ tmdb_id });
    res.render("play", { data });
  } catch (error) {
    console.log(error);
    return res.send("server erro");
  }
};

const getPlayTv = async (req, res) => {
  try {
    const { tmdb_id } = req.params;
    const { season } = req.params;
    const { episode } = req.params;
    const data = await movie.find({ tmdb_id });
    const tv = data.filter(
      (obj) => obj.season == season && obj.episode == episode
    );

    const groupedData = Object.values(
      data.reduce((result, obj) => {
        const { season } = obj;

        if (!result[season]) {
          result[season] = { season, episodes: [] };
        }

        const episode = obj.episode;
        const episodesArray = result[season].episodes;

        if (!episodesArray.some((item) => item.episode === episode)) {
          episodesArray.push({ episode });
        }

        return result;
      }, {})
    );

    res.render("play", { data: tv, tvData: groupedData });
  } catch (error) {
    console.log(error);
    return res.send("server erro");
  }
};

const discover = async (req, res) => {
  try {
    const { type, country } = req.params;
    const page = Number(req.query.page) || 1;

    const limit = 20;
    const skip = (page - 1) * limit;
    let filter = {};
    if (type) {
      filter["type"] = type;
    }
    if (country) {
      filter["country"] = country;
    }

    const data = await mverseGet(skip, limit, filter);
    res.render("discover", { data, filter, page });
  } catch (error) {
    console.log(error);
    return res.send("server erro");
  }
};

module.exports = {
  getHome,
  getPlay,
  discover,
  getPlayTv,
};
