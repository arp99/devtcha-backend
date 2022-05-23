const { User } = require("../Models/user.model");
const { Post } = require("../Models/posts.model");

const updateProfilePicture = async (req, res) => {
  try {
    let { user } = req;
    const { profileImageUrl } = req.body;
    const foundUser = await User.findOne({ _id: user.userId });
    foundUser.profileImageUrl = profileImageUrl;
    await foundUser.save();
    res.json({
      success: true,
      message: "Succesfully updated profile picture",
      data: profileImageUrl,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile picture",
    });
  }
};

const getUserData = async (req, res) => {
  try {
    const { userId } = req.user;
    const foundUser = await User.findById(userId)
      .populate([
        {
          path: "followers",
          select: "userName firstName lastName profileImageUrl",
          model: User,
        },
        {
          path: "following",
          select: "userName firstName lastName profileImageUrl",
          model: User,
        },
        {
          path: "bookmarks",
          model: Post,
          populate: {
            path: "user",
            model: User,
            select: "userName profileImageUrl firstName lastName",
          },
        },
      ])
      .select("firstName lastName userName email profileImageUrl");
    res.status(200).json({
      success: true,
      message: "Successfully fetched user data",
      data: foundUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user data",
      errorMessage: err.message,
    });
  }
};

const followUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const { userToFollowId } = req.body;
    //add the follwed user in following of this user
    const user = await User.findById(userId);
    user.following.push(userToFollowId);

    //add this user to the followers list of the followed user
    const followedUser = await User.findById(userToFollowId);
    followedUser.followers.push(userId);

    await user.save();
    await followedUser.save();

    const followedUserData = await User.findById(userToFollowId)
      .populate([
        {
          path: "followers",
          select: "userName firstName lastName profileImageUrl",
          model: User,
        },
        {
          path: "following",
          select: "userName firstName lastName profileImageUrl",
          model: User,
        },
      ])
      .select("userName firstName lastName profileImageUrl");

    res.json({
      success: true,
      message: "Successfully followed user",
      data: followedUserData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to follow user",
      errorMessage: err.message,
    });
  }
};

const unFollowUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const { userToUnfollowId } = req.body;

    const user = await User.findById(userId);
    user.following.remove(userToUnfollowId);

    const unFollowedUser = await User.findById(userToUnfollowId);
    unFollowedUser.followers.remove(userId);

    await user.save();
    await unFollowedUser.save();

    const unFollowedUserData = await User.findById(userToUnfollowId)
      .populate([
        {
          path: "followers",
          select: "userName firstName lastName profileImageUrl",
          model: User,
        },
        {
          path: "following",
          select: "userName firstName lastName profileImageUrl",
          model: User,
        },
      ])
      .select("userName firstName lastName profileImageUrl");

    res.json({
      success: true,
      message: "Successfully followed user",
      data: unFollowedUserData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to unfollow user",
      errorMessage: err.message,
    });
  }
};

const getProfileSuggestions = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (user) {
      // Get the user already following to exclude them from suggested profiles including self
      let selfAndFollowedUsers = user.following.map((followedUserId) =>
        followedUserId.toString()
      );
      selfAndFollowedUsers.push(userId.toString());
      //suggest all users except own and who are not already followed by this user
      let suggestedProfiles = await User.find().select(
        "userName firstName lastName profileImageUrl"
      );
      suggestedProfiles = suggestedProfiles.filter(
        (user) => !selfAndFollowedUsers.includes(user._id.toString())
      );
      if (suggestedProfiles.length !== 0) {
        res.status(200).json({
          success: true,
          suggestedProfiles,
        });
      } else {
        res.status(404).json({
          success: false,
          messag: "No suggestions found",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error at finding User",
      errorMessage: err.message,
    });
  }
};

module.exports = {
  getUserData,
  updateProfilePicture,
  followUser,
  unFollowUser,
  getProfileSuggestions,
};
