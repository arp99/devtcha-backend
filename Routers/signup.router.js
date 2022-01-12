const express = require("express");
const { signupUser } = require("../Controllers/signup.controller");
const router = express.Router();

router.route("/").post(signupUser);

module.exports = router;
