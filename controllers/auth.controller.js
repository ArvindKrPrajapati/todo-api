const user = require("../modals/user.modal");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    let { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ success: false, error: "email,name ,password are required" });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: "invalid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "password must be greater than 7 digit",
      });
    }

    const varify = await user.findOne({ email });
    if (varify) {
      return res
        .status(401)
        .json({ success: false, error: "User already exists" });
    }
    password = bcrypt.hashSync(password, 10);
    const data = await user.create({ email, name, password });
    const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET);
    return res.status(200).json({
      success: true,
      data: { name: data.name, email: data.email },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "server error" });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "email ,password are required" });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: "invalid email" });
    }
    const data = await user.findOne({ email });
    if (!data) {
      return res
        .status(500)
        .json({ success: false, error: "user dont exist with this email" });
    }
    if (!bcrypt.compareSync(password, data.password)) {
      return res.status(500).json({ success: false, error: "wrong password" });
    }
    const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET);
    return res.status(200).json({
      success: true,
      data: { name: data.name, email: data.email },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "server error" });
  }
};

module.exports = {
  signup,
  login,
};
