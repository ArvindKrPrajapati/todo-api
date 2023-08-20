const by = "64da77d900aaabbb560c6343";
const up_url = "https://mverse-next.vercel.app/api/video/bulk-upload";
const scrapperModel = require("../modals/scrapper.model");

const axios = require("axios");
const cheerio = require("cheerio");

const extractInfo = async (_id) => {
  try {
    const url = "https://hdmp4mania2.com/showmovie.php?id=" + _id;

    const info_dict = {};
    const skip = [0, 4, 5];
    const seprator = ":";

    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const description = $(`.description`);
    const thumbnail = $("img").eq(2).attr("src");
    description.each((i, desc) => {
      if (skip.includes(i)) {
        return;
      }

      const descText = $(desc).text();
      const desc_arr = descText.split(seprator);
      info_dict["thumbnail"] = "https:" + thumbnail;
      info_dict[desc_arr[0].trim().replace(" ", "_")] = desc_arr[1].trim();
    });

    if (info_dict) {
      const info = info_dict;
      info["id"] = _id;
      const name = info["Title"].replace(" ", "%20");
      const cat = info["Category"].replace(" ", "%20");

      if (parseInt(info["Total_Part(s)"]) > 1) {
        const encoded_url_one = `http://hd1.dlmania.com/${cat}/${name}/${name}%20HD%201.mp4`;
        const encoded_url_two = `http://hd1.dlmania.com/${cat}/${name}/${name}%20HD%202.mp4`;
        info["url_one"] = encoded_url_one;
        info["url_two"] = encoded_url_two;
      } else {
        const encoded_url = `http://hd1.dlmania.com/${cat}/${name}/${name}%20HD%20(HDMp4Mania).mp4`;
        info["url_one"] = encoded_url;
      }
      return info;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const format = (data) => {
  const results = [];
  //   console.log(data);
  var id = 0;
  for (let i = 0; i < data.length; i++) {
    const obj = {};
    const d = data[i];
    const category = d["Category"];
    if (category != "WWE") {
      id++;
      console.log("--------loaing------  : ", id);
      obj["thumbnail"] = d.thumbnail;
      obj["duration"] = 0;
      obj["by"] = by;
      obj["description"] = "id: " + d.id + " " + d["Plot/Description"];
      obj["link"] = d.url_one;
      if (d.url_two) {
        obj["url_two"] = d.url_two;
      }
      obj["title"] =
        d["Title"]
          .replaceAll("-", "")
          .replaceAll("BRRip", "")
          .replaceAll("WebRip", "")
          .replaceAll("Hindi", "")
          .replaceAll("DvdScr", "")
          .replaceAll("SCam", "")
          .replaceAll("TSRip", "")
          .replaceAll("DvdRip", "")
          .trim() +
        " | " +
        category;
      results.push(obj);
    }
  }

  console.log("formating done for :", results.length);
  return results;
};

const scrapMp4mania = async () => {
  const data = [];
  let available = true;
  const cr = await scrapperModel.findOne({ name: "mp4mania" });
  if (!cr) {
    await scrapperModel.create({ name: "mp4mania", count: 1 });
  }
  let i = cr?.count || 1;
  while (available) {
    console.log("---------searching for id------ ", i);
    const info = await extractInfo(i);
    if (!info) {
      available = false;
      break;
    }
    data.push(info);
    i++;
  }
  if (data.length === 0) {
    return {
      success: false,
      error: "no movie found",
    };
  }

  await scrapperModel.updateOne(
    { name: "mp4mania" },
    { count: i },
    { upsert: true }
  );
  const result = format(data);
  const response = await axios.post(up_url, { data: result });
  return {
    success: true,
    data: response.data,
  };
};

const scrapper = async (req, res) => {
  try {
    const resp = await scrapMp4mania();
    return res.json(resp);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "server error",
    });
  }
};

module.exports = {
  scrapper,
  scrapMp4mania,
};
