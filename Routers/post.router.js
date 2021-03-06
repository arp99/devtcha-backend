const express = require("express");
const {
  getAllPosts,
  createPost,
  deletePost,
  addRemoveReaction,
  bookmarkPost,
  removeBookmark,
} = require("../Controllers/post.controller");
const router = express.Router();
const { verifyAuth } = require("../Middlewares/authentication");

router
  .route("/")
  .get(verifyAuth, getAllPosts) //this will be paginated later on
  .post(verifyAuth, createPost);

// Get post of a particular user
// router.get("/:userId", getPostsByUser);

router
  .route("/bookmark/:postId")
  .post(verifyAuth, bookmarkPost)
  .delete(verifyAuth, removeBookmark);

router
  .route("/:postId")
  // .put(editPost)
  .delete(verifyAuth, deletePost);

router.route("/:postId/:reaction").post(verifyAuth, addRemoveReaction);

module.exports = router;
