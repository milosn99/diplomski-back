const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const professorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  department: {
    type: String,
    required: true,
    minlength: 5,
    maxlenght: 100,
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlenght: 100,
  },
  userType: String,
  projects: [
    new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
      name: String,
    }),
  ],
  students: [
    new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
      name: String,
    }),
  ],
  avatar: String,
});

professorSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      userType: "professor",
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Professor = mongoose.model("Professor", professorSchema);

function validateProfessor(professor) {
  const schema = {
    name: Joi.string().min(5).max(100).required(),
    email: Joi.string().min(5).max(100).required(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(professor, schema);
}

exports.Professor = Professor;
exports.validate = validateProfessor;
