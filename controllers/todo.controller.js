const todoModal = require("../modals/todo.modal");
const mongoose = require("mongoose");

const addTask = async (req, res) => {
  try {
    const { userid } = req;
    const { task, image, date } = req.body;
    if (!task && !image) {
      return res
        .status(404)
        .json({ success: false, error: "task or image is required" });
    }
    const obj = {
      by: userid,
      done: false,
      date: date ? date : Date.now(),
      updatedAt: date ? new Date(date) : Date.now(),
    };
    if (task && image) {
      obj["task"] = task;
      obj["image"] = image;
    } else if (image) {
      obj["image"] = image;
    } else if (task) {
      obj["task"] = task;
    }
    const data = await todoModal.create(obj);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "server error" });
  }
};
const editTask = async (req, res) => {
  try {
    const { userid } = req;
    const { task, image, date, id } = req.body;
    if (!id) {
      return res.status(404).json({ success: false, error: "id is required" });
    }
    if (!task && !image) {
      return res
        .status(404)
        .json({ success: false, error: "task or image is required" });
    }
    const obj = {
      done: false,
      task,
      image,
      updatedAt: date ? new Date(date) : Date.now(),
    };
    if (date) {
      obj["date"] = date;
    }
    const data = await todoModal.findByIdAndUpdate(id, obj, { new: true });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "server error" });
  }
};

const getTodaysTask = async (req, res) => {
  try {
    const { userid } = req;
    const today = new Date();

    const start = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    );

    var end = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    const data = await todoModal
      .find({
        by: userid,
        updatedAt: { $gte: start, $lt: end },
      })
      .populate("by", "name")
      .sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "server error" });
  }
};

const getPendingTask = async (req, res) => {
  try {
    const { userid } = req;
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 20;
    const data = await todoModal
      .find({ by: userid, done: false })
      .populate("by", "name")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "server error" });
  }
};

const getDoneTask = async (req, res) => {
  try {
    const { userid } = req;
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 20;
    const data = await todoModal
      .find({ by: userid, done: true })
      .populate("by", "name")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "server error" });
  }
};

const toggleTodoStatus = async (req, res) => {
  try {
    const { todoid, done } = req.body;
    if (!todoid) {
      return res
        .status(404)
        .json({ success: false, error: "todo id status is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(todoid)) {
      return res.status(404).json({ success: false, error: "invalid todoid" });
    }
    const _id = mongoose.Types.ObjectId(todoid);
    const data = await todoModal.findOneAndUpdate(
      { _id, by: req.userid },
      { done, updatedAt: Date.now() },
      { new: true }
    );
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "server error" });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { todoid } = req.params;
    if (!todoid) {
      return res
        .status(404)
        .json({ success: false, error: "todo id status is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(todoid)) {
      return res.status(404).json({ success: false, error: "invalid todoid" });
    }
    const _id = mongoose.Types.ObjectId(todoid);
    const data = await todoModal.findOneAndDelete({ _id, by: req.userid });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "server error" });
  }
};

const dashboard = async (req, res) => {
  try {
    const { userid } = req;
    const today = new Date();
    const start = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    );

    var end = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );
    if (!userid) {
      return res.status(404).json({ success: false, error: "invalid t" });
    }

    if (!mongoose.Types.ObjectId.isValid(userid)) {
      return res.status(404).json({ success: false, error: "invalid userid" });
    }
    const _id = mongoose.Types.ObjectId(userid);
    const data = await todoModal.aggregate([
      { $match: { by: _id } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$updatedAt",
            },
          },
          total: { $sum: 1 },
          done: { $sum: { $cond: [{ $eq: ["$done", true] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$done", false] }, 1, 0] } },
          doneToday: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$done", true] },
                    {
                      $gte: ["$updatedAt", start],
                    },
                    {
                      $lt: ["$updatedAt", end],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          pendingToday: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$done", false] },
                    {
                      $gte: ["$updatedAt", start],
                    },
                    {
                      $lt: ["$updatedAt", end],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          tasksByDate: { $push: "$$ROOT" },
          total: { $sum: "$total" },
          done: { $sum: "$done" },
          pending: { $sum: "$pending" },
          doneToday: { $sum: "$doneToday" },
          pendingToday: { $sum: "$pendingToday" },
        },
      },
    ]);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "server error" });
  }
};

module.exports = {
  addTask,
  getPendingTask,
  getDoneTask,
  toggleTodoStatus,
  deleteTodo,
  getTodaysTask,
  editTask,
  dashboard,
};
