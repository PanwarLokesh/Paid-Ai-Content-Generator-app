const { message } = require("prompt");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

//!----Registration-----
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }
    const userExits = await User.findOne({ email });
    if (userExits) {
      res.status(400);
      throw new Error("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    newUser.trialExpires = new Date(
      new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000
    );
    newUser.save();
    res.json({
      status: true,
      message: "Registration was successful",
      user: {
        username,
        email,
      },
    });
  } catch (error) {
    // new Error(error);
    console.error(error.message);
    res.json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
};
