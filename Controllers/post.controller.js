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
      reaction: {
        like: [],
        dislike: [],
        hearts: [],
        fire: [],
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
    await Post.findByIdAndDelete(postId);
    res.json({ success: true, message: "Successfully deleted post" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in deleting post",
      errorMessage: err.message,
    });
  }
};

const reactToPost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { postId, reaction } = req.params;
    //check whether the user has already reacted with the particular reaction to this post
    const post = await Post.findById(postId);
    //get all userIds who reacted with the particular reaction
    const reactedUserList = await post.reactions.get(reaction);
    //Now check whether current user is already present among the reacted user
    const hasUserReacted = reactedUserList.find((id) => id === userId);

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
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in saving post",
    });
  }
};

const removeReactionFromPost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { postId, reaction } = req.params;

    const post = await Post.findById(postId);
    //get all users who reacted with this particular reaction
    const reactedUserList = await post.reactions.get(reaction);

    const hasUserReacted = reactedUserList.find((id) => id === userId);

    if (hasUserReacted) {
      //remove this userId from the reacted usersList
      reactedUserList.remove(userId);
    }
    post.reactions.set(reaction, reactedUserList);
    await post.save();
    res.json({
      success: true,
      message: "Succesfully removed reaction",
      postId,
      reaction,
      userId,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in removing reaction",
    });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  deletePost,
  reactToPost,
  removeReactionFromPost,
};
