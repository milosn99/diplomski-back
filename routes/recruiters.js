const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Recruiter } = require("../models/recruiter");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const { Conversation } = require("../models/conversation");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let recruiter = await Recruiter.findOne({
      email: req.body.email,
    });
    if (!recruiter) return res.status(400).send("Invalid email or password.");

    const validPassword = await bcrypt.compare(
      req.body.password,
      recruiter.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    const token = recruiter.generateAuthToken();
    res.send(token);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/count", auth, async (req, res) => {
  try {
    if (req.user.userType !== "admin") return res.status(403).send("Forbidden");
    delete req.query.page;
    const count = await Recruiter.countDocuments(req.query);

    return res.send({ count });
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/new", auth, async (req, res) => {
  try {
    if (req.user.userType !== "admin") return res.status(403).send("Forbidden");
    let recruiter = req.body.recruiter;
    recruiter.password = await bcrypt.hash(req.body.recruiter.password, 10);
    recruiter = new Recruiter(recruiter);
    recruiter.avatar = `public/avatars/${recruiter._id}.jpg`;
    recruiter = await recruiter.save();
    return res.status(200).send(recruiter);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.userType !== "admin") return res.status(403).send("Forbidden");
    const recruiter = await Recruiter.findOneAndDelete({ _id: req.params.id });
    await Conversation.deleteMany({ members: req.params.id });
    return res.status(200).send(recruiter);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const result = await Recruiter.find();
    if (!result) return res.status(404).send("Recruiters not found");
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(3).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
