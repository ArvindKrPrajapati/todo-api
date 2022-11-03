const todoModal = require("../modals/todo.modal")
const mongoose = require('mongoose');


const addTask = async (req, res) => {
    try {
        const { userid } = req
        const { task } = req.body
        if (!task) {
            return res.status(404).json({ success: false, error: "task is required" })
        }
        await todoModal.create({ by: userid, task, done: false })
        return res.status(200).json({ success: true })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "server error" })
    }
}

const getPendingTask = async (req, res) => {
    try {
        const { userid } = req
        const skip = Number(req.query.skip) || 0
        const data = await todoModal.find({ by: userid, done: false }).populate("by", "name").select("task done datetime").sort({ datetime: -1 }).skip(skip).limit(20)
        return res.status(200).json({ success: true, data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "server error" })
    }
}

const getDoneTask = async (req, res) => {
    try {
        const { userid } = req
        const skip = Number(req.query.skip) || 0
        const data = await todoModal.find({ by: userid, done: true }).populate("by", "name").select("task done datetime").sort({ datetime: -1 }).skip(skip).limit(20)
        return res.status(200).json({ success: true, data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "server error" })
    }
}

const toggleTodoStatus = async (req, res) => {
    try {
        const { todoid, done } = req.body
        if (!todoid) {
            return res.status(404).json({ success: false, error: "todo id status is required" })
        }

        if (!mongoose.Types.ObjectId.isValid(todoid)) {
            return res.status(404).json({ success: false, error: "invalid todoid" })
        }
        const _id = mongoose.Types.ObjectId(todoid)
        const data = await todoModal.findOneAndUpdate({ _id, by: req.userid }, { done }, { new: true })
        return res.status(200).json({ success: true, data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "server error" })
    }
}

const deleteTodo = async (req, res) => {
    try {
        const { todoid } = req.body
        if (!todoid) {
            return res.status(404).json({ success: false, error: "todo id status is required" })
        }

        if (!mongoose.Types.ObjectId.isValid(todoid)) {
            return res.status(404).json({ success: false, error: "invalid todoid" })
        }
        const _id = mongoose.Types.ObjectId(todoid)
        const data = await todoModal.findOneAndDelete({ _id, by: req.userid })
        return res.status(200).json({ success: true })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "server error" })
    }
}


module.exports = {
    addTask,
    getPendingTask,
    getDoneTask,
    toggleTodoStatus,
    deleteTodo
}