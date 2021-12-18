const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");

const signupUser = async (req, res) => {
  try {
    const { firstName, lastName, password, email, userName } = req.body;
    //check if user already exists by the email
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(409).json({
        success: false,
        message: "Account already exists with this email!",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      firstName,
      lastName,
      email,
      userName,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "Successfully created user",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create new user!",
      errorMessage: err.message,
    });
  }
};

module.exports = { signupUser };
