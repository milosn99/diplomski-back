const Joi = require("joi");
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
    minlength: 5,
  },
  technologies: [String],
  owner: {
    type: new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
      name: String,
    }),
    required: true,
  },
  contributors: [
    new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
      name: String,
    }),
  ],
  mentors: [
    new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professor",
      },
      name: String,
      comment: String,
    }),
  ],
  description: {
    type: String,
    maxlength: 1024,
  },
});

const Project = mongoose.model("Project", projectSchema);

function validateProject(student) {
  const schema = {
    name: Joi.string().min(5).max(100).required(),
    technologies: Joi.array().min(1).required(),
  };
  return Joi.validate(student, schema);
}

exports.Project = Project;
exports.validate = validateProject;
