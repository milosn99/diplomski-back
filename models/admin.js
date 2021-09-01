const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
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
});

adminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      userType: "admin",
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Admin = mongoose.model("Admin", adminSchema);

function validateAdmin(admin) {
  const schema = {
    username: Joi.string().min(5).max(100).required(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(admin, schema);
}

exports.Admin = Admin;
exports.validate = validateAdmin;
