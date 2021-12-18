const express = require("express");
const { signupUser } = require("../controllers/signup.controller");
const router = express.Router();

router.route("/").post(signupUser);

module.exports = router;
