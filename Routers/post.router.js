const express = require("express");
const {
  getAllPosts,
  createPost,
  deletePost,
  reactToPost,
  removeReactionFromPost,
} = require("../Controllers/post.controller");
const router = express.Router();

router
  .route("/")
  .get(getAllPosts) //this will be paginated later on
  .post(createPost);

// Get post of a particular user
// router.get("/:userId", getPostsByUser);

router
  .route("/:postId")
  // .put(editPost)
  .delete(deletePost);

router
  .route("/:postId/:reaction")
  .post(reactToPost)
  .delete(removeReactionFromPost);

module.exports = router;
