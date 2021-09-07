const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Student } = require("../models/student");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Project } = require("../models/project");
const winston = require("winston");
const { Recruiter } = require("../models/recruiter");
const { Professor } = require("../models/professor");

router.get("/", auth, async (req, res) => {
  try {
    let students = await Student.find({ _id: { $ne: req.user._id } }).select(
      "_id name userType avatar"
    );

    let professors = await Professor.find({
      _id: { $ne: req.user._id },
    }).select("_id name userType avatar");

    let recruiters = await Recruiter.find({
      _id: { $ne: req.user._id },
    }).select("_id name userType avatar");

    const result = students.concat(professors, recruiters);

    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/filter", auth, async (req, res) => {
  try {
    let students = await Student.find({
      _id: { $ne: req.user._id },
      name: { $regex: `^${req.query.name}`, $options: "i" },
    }).select("_id name userType avatar");

    let professors = await Professor.find({
      _id: { $ne: req.user._id },
      name: { $regex: `^${req.query.name}`, $options: "i" },
    }).select("_id name userType avatar");

    const result = students.concat(professors);

    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    if (!req.params.id) return;
    let student = await Student.findOne({ _id: req.params.id });

    let professor = await Professor.findOne({ _id: req.params.id });

    let recruiter = await Recruiter.findOne({ _id: req.params.id });

    const result = student ?? professor ?? recruiter;
    if (!result) res.status(400).send("Bad request");
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
