const express = require("express");
const {
  getAllPosts,
  createPost,
  deletePost,
  reactToPost,
  removeReactionFromPost,
} = require("../Controllers/post.controller");
const router = express.Router();
const { verifyAuth } = require("../Middlewares/authentication")

router
  .route("/")
  .get(verifyAuth, getAllPosts) //this will be paginated later on
  .post(verifyAuth, createPost);

// Get post of a particular user
// router.get("/:userId", getPostsByUser);

router
  .route("/:postId")
  // .put(editPost)
  .delete(verifyAuth, deletePost);

router
  .route("/:postId/:reaction")
  .post(verifyAuth, reactToPost)
  .delete(verifyAuth, removeReactionFromPost);

module.exports = router;
