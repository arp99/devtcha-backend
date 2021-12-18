const { User } = require("../models/user.model");

const updateProfilePicture = async (req, res) => {
  try {
    let { user } = req;
    const { profileImageUrl } = req.body;
    console.log("Profile image url recieved: ", { profileImageUrl })
    console.log("User id from token: ", user);
    const foundUser = await User.findOne({ _id: user.userId });
    foundUser.profileImageUrl = profileImageUrl;
    await foundUser.save();
    res.json({
      success: true,
      message: "Succesfully updated profile picture",
      data : profileImageUrl
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
    console.log("User id from token: ", userId);
    const foundUser = await User.findById(userId)
    .populate([
      {
        path: 'followers',
        select: 'userName firstName lastName profileImageURL',
        model: User,
      },
      {
        path: 'following',
        select: 'userName firstName lastName profileImageURL',
        model: User,
      },
    ])
    .select(
      "firstName lastName userName email profileImageUrl"
    );
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

module.exports = {
  getUserData,
  updateProfilePicture,
  followUser,
  unFollowUser
};
