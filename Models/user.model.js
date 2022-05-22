const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: "FirstName is required",
    },
    lastName: {
      type: String,
      required: "LastName is required",
    },
    userName: {
      type: String,
      required: "Username is required",
      unique: true,
    },
    email: {
      type: String,
      unique: "Email id already exists",
      required: "Email id is required",
      validate: {
        validator: (value) => {
          return /^.+@.+\.com$/.test(value);
        },
        message: (props) => `${props.value} is not a valid email Id`,
      },
      unique: true,
    },
    password: {
      type: String,
      required: "Password is required",
    },
    profileImageUrl: {
      type: String,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "post"
      }
    ]
  },
  { timestamps: true }
);

const User = model("user", userSchema);
module.exports = { User };
