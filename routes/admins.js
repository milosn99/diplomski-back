const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Admin } = require("../models/admin");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let admin = await Admin.findOne({
      username: req.body.username,
    });
    if (!admin) return res.status(400).send("Invalid email or password.");

    const validPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    const token = admin.generateAuthToken();
    res.status(200).send(token);
  } catch (err) {
    return res.status(500).send(err);
  }
});

function validate(req) {
  const schema = {
    username: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
