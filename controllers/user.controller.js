const user = require("../modals/user.modal")
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const getLoggedInUserInfo = async (req, res) => {
    try {
        const { userid } = req

        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(404).json({ success: false, error: "invalid userid" })
        }
        const _id = mongoose.Types.ObjectId(userid)
        const data = await user.findById(userid).select("-password")
        return res.status(200).json({ success: true, data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "server error" })
    }
}

const changeName = async (req, res) => {
    try {
        const { userid } = req
        const { name } = req.body
        if (!name) {
            return res.status(404).json({ success: false, error: "name is required" })
        }

        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(404).json({ success: false, error: "invalid userid" })
        }
        const _id = mongoose.Types.ObjectId(userid)
        const data = await user.findByIdAndUpdate(userid, { name }, { new: true }).select("-password")
        return res.status(200).json({ success: true, data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "server error" })
    }
}

const changePassword = async (req, res) => {
    try {
        const { userid } = req
        let { newpass, password } = req.body;
        if (!newpass || !password) {
            return res.status(400).json({ success: false, error: "newpass ,password are required" })
        }
        const data = await user.findById(userid)

        if (!bcrypt.compareSync(password, data.password)) {
            return res.status(500).json({ success: false, error: "wrong password" })
        }

        newpass = bcrypt.hashSync(newpass, 10);
        await user.findByIdAndUpdate(userid, { password: newpass })
        return res.status(200).json({ success: true, data: "password changed" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "server error" })
    }
}

module.exports = {
    getLoggedInUserInfo,
    changeName,
    changePassword
}