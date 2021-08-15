const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
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
  userType: String,
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
  position: String,
  avatar: String,
});

recruiterSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      userType: "recruiter",
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Recruiter = mongoose.model("Recruiter", recruiterSchema);

function validateRecruiter(professor) {
  const schema = {
    name: Joi.string().min(5).max(100).required(),
    email: Joi.string().min(5).max(100).required(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(professor, schema);
}

exports.Recruiter = Recruiter;
exports.validate = validateRecruiter;
