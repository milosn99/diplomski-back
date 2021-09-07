const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
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
  userType: { type: String, default: "student" },
  skills: [String],
  interests: [String],
  year: { type: Number, required: true, default: 1 },
  projects: [
    new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
      name: String,
      technologies: [String],
    }),
  ],
  professors: [
    new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professor",
      },
      name: String,
    }),
  ],
  exams: [
    new mongoose.Schema({
      subject: {
        type: new mongoose.Schema({
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
          },
          name: String,
        }),
      },
      grade: Number,
    }),
  ],
  extracurriculars: [
    new mongoose.Schema({
      event: String,
      organization: String,
      position: String,
      descrtiption: String,
    }),
  ],
  studyProgram: {
    type: String,
    required: true,
    enum: [
      "Informacioni sistemi i tehnologije",
      "Menadzment i organizacija",
      "Operacioni menadzment",
      "Menadzment kvaliteta i standardizacija",
    ],
  },
  avatar: String,
  headline: String,
  indexNumber: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 9,
    unique: true,
  },
});

studentSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      userType: "student",
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Student = mongoose.model("Student", studentSchema);

function validateStudent(student) {
  const schema = {
    name: Joi.string().min(5).max(100).required(),
    email: Joi.string().min(5).max(100).required(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(student, schema);
}

exports.Student = Student;
exports.validate = validateStudent;
