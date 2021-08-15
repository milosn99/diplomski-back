const Joi = require("joi");
const mongoose = require("mongoose");

const studyProgram = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  noOfSemesters: {
    type: Number,
    min: 6,
    max: 8,
    required: true,
  },
});

const Post = mongoose.model("Post", studyProgram);

function validateStudyProgram(post) {
  const schema = {
    name: Joi.string().min(5).max(100).required(),
  };
  return Joi.validate(post, schema);
}

exports.Post = Post;
exports.validate = validateStudyProgram;
