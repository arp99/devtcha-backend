const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });
    //search if the user is signed up or not
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found!",
      });
    }
    console.log({ user });
    //compare the passwords
    const match = await bcrypt.compare(password, user.password);
    console.log(match);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Passwords not matching, wrong credentials!!",
      });
    }
    //if credentials match then generate access token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to login!",
      errorMessage: err.message,
    });
  }
};

module.exports = { loginUser };
