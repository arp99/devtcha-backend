const express = require("express");
const {
  getUserData,
  updateProfilePicture,
  followUser,
  unFollowUser,
  getProfileSuggestions,
} = require("../Controllers/user.controller");
const { verifyAuth } = require("../Middlewares/authentication");

const router = express.Router();

router.route("/").get(verifyAuth, getUserData);
router.route("/update-profile-picture").post(verifyAuth, updateProfilePicture);

router.route("/follow").post(verifyAuth, followUser);
router.route("/unfollow").delete(verifyAuth, unFollowUser);

router.route("/suggestion").get(verifyAuth, getProfileSuggestions);

module.exports = router;
