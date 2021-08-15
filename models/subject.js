const Joi = require("joi");
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  typeOfSubject: {
    type: String,
    required: true,
    enum: ["theoretical", "practical"],
  },
  professors: [
    new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professor",
      },
      name: String,
    }),
  ],
});

const Subject = mongoose.model("Subject", subjectSchema);

function validateSubject(student) {
  const schema = {
    name: Joi.string().min(5).max(100).required(),
    typeOfSubject: Joi.string().required(),
  };
  return Joi.validate(student, schema);
}

exports.Subject = Subject;
exports.validate = validateSubject;
