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
  averageGrade: {
    type: Number,
    min: 6.0,
    max: 10.0,
  },
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
  experience: [
    new mongoose.Schema({
      position: String,
      company: {
        type: new mongoose.Schema({
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
          },
          name: String,
          location: String,
        }),
      },
      dateStarted: Date,
      dateEnded: Date,
    }),
  ],
  studyProgram: {
    type: new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudyProgram",
      },
      name: String,
    }),
  },
  avatar: String,
  headline: String,
  private: {
    type: Boolean,
    default: false,
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
