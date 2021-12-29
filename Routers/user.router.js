const express = require("express");
const {
  getUserData,
  updateProfilePicture,
  followUser,
  unFollowUser,
} = require("../Controllers/user.controller");
const router = express.Router();

router.route("/").get(getUserData);
router.route("/update-profile-picture").post(updateProfilePicture);

router.route("/follow").post(followUser);
router.route("/unfollow").delete(unFollowUser);

module.exports = router;
