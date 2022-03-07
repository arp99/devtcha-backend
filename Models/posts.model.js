const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: "Must have userId",
      ref: "user",
    },
    content: {
      type: [String],
      required: "Post content cannot be empty",
    },
    reactions: {
      type: Map,
      of: [
        {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Post = model("post", postSchema);
module.exports = { Post };
