const user = require("../modals/user.modal")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
    try {
        let { mobile, name, password } = req.body
        if (!mobile || !name || !password) {
            return res.status(400).json({ success: false, error: "mobile,name ,password are required" })
        }
        if (isNaN(mobile)) {
            return res.status(400).json({ success: false, error: "invalid mobile number (NaN)" })
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, error: "password must be greater than 7 digit" })
        }


        if (mobile.toString().length === 10) {
            const varify = await user.findOne({ mobile })
            if (varify) {
                return res.status(401).json({ success: false, error: "User already exists" })
            }
            password = bcrypt.hashSync(password, 10);
            const data = await user.create({ mobile, name, password })
            const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET);
            return res.status(200).json({ success: true, data: { token } })

        } else {
            return res.status(400).json({ success: false, error: "invalid mobile number" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "server error" })
    }
}

const login = async (req, res) => {
    try {
        let { mobile, password } = req.body;
        if (!mobile || !password) {
            return res.status(400).json({ success: false, error: "mobile ,password are required" })
        }

        const data = await user.findOne({ mobile })
        if (!data) {
            return res.status(500).json({ success: false, error: "user dont exist with this mobile number" })
        }
        if (!bcrypt.compareSync(password, data.password)) {
            return res.status(500).json({ success: false, error: "wrong password" })
        }
        const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET);
        return res.status(200).json({ success: true, data: { token } })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "server error" })
    }
}



module.exports = {
    signup,
    login
}