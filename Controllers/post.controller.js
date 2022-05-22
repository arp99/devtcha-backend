const { Post } = require("../Models/posts.model");
const { User } = require("../Models/user.model");

const getAllPosts = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    //fetch posts of user following and urself
    const posts = await Post.find({
      user: { $in: [...user.following, userId] },
    }).populate("user", "_id firstName lastName userName profileImageUrl");

    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      errorMessage: err.message,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { content } = req.body;

    const newPost = new Post({
      user: userId,
      content,
      reactions: {
        love: [],
        rocket: [],
        celebrate: [],
        confused: [],
      },
    });
    await newPost.save();
    const newPostData = await Post.findById(newPost._id).populate(
      "user",
      "_id firstName lastName userName profileImageUrl"
    );
    res.json({
      success: true,
      message: "Successfully created post",
      newPostData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating post",
      errorMessage: err.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.user;
    const foundPost = await Post.findById(postId);

    if (foundPost.user.toString() === userId) {
      await Post.findByIdAndDelete(postId);
    } else {
      throw new Error("Cannot delete Post");
    }
    res.json({ success: true, message: "Successfully deleted post" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in deleting post",
      errorMessage: err.message,
    });
  }
};

const addRemoveReaction = async (req, res) => {
  try {
    const { userId } = req.user;
    const { postId, reaction } = req.params;
    //check whether the user has already reacted with the particular reaction to this post
    const post = await Post.findById(postId);
    //get all userIds who reacted with the particular reaction
    const reactedUserList = await post.reactions.get(reaction);
    //Now check whether current user is already present among the reacted user
    const hasUserReacted = reactedUserList.find(
      (id) => id.toString() === userId
    );
    //so if the user hasn't yet reacted then add this userId to that particular reaction of this post
    if (!hasUserReacted) {
      reactedUserList.push(userId);
      post.reactions.set(reaction, reactedUserList);
      await post.save();
      res.json({
        success: true,
        message: "Succesfully reacted to post",
        postId,
        reaction,
        userId,
      });
    } else {
      reactedUserList.remove(userId);
      post.reactions.set(reaction, reactedUserList);
      await post.save();
      res.json({
        success: true,
        message: "Succesfully removed reaction",
        postId,
        reaction,
        userId,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in saving post",
    });
  }
};

const bookmarkPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.user;

    const foundUser = await User.findById(userId);

    foundUser.bookmarks = foundUser.bookmarks
      ? [...new Set([...foundUser.bookmarks, postId])] // if post is already bookmarked do not do anything
      : [postId];
    await foundUser.save();

    res.json({
      success: true,
      message: "Successfully bookmarked post",
      postId,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Cannot Bookmart post",
      errorMessage: err.message,
    });
  }
};

const removeBookmark = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.user;

    const foundUser = await User.findById(userId);

    // check if postId is already bookmarked or not,
    const isBookmarked = foundUser.bookmarks.find(
      (id) => id.toString() === postId
    );

    if (isBookmarked) {
      foundUser.bookmarks = foundUser.bookmarks.filter(
        (id) => id.toString() !== postId
      );
      foundUser.save();
    } else {
      throw new Error("Post is not Bookmarked");
    }

    res.json({
      success: true,
      message: "Successfully removed from bookmarks",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in removing Bookmark",
      errorMessage: err.message,
    });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  deletePost,
  addRemoveReaction,
  bookmarkPost,
  removeBookmark
};
