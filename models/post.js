const Joi = require("joi");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  owner: {
    type: new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
      name: String,
      avatar: String,
    }),
    required: true,
  },
  thumbnail: String,
  content: String,
  timeStamp: Date,
});

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
  const schema = {
    name: Joi.string().min(5).max(100).required(),
  };
  return Joi.validate(post, schema);
}

exports.Post = Post;
exports.validate = validatePost;
