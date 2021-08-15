const Joi = require("joi");
const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  shortName: {
    type: String,
    minlegth: 2,
    maxlength: 20,
  },
  location: {
    type: String,
    required: true,
  },
  adress: String,
  size: {
    type: String,
    enum: ["small", "medium", "large"],
    required: true,
  },
});

const Company = mongoose.model("Company", companySchema);

function validateCompany(student) {
  const schema = {
    name: Joi.string().min(5).max(100).required(),
    size: Joi.string().required(),
    location: Joi.string().required(),
  };
  return Joi.validate(student, schema);
}

exports.Company = Company;
exports.validate = validateCompany;
