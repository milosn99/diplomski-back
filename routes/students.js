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

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let student = await Student.findOne({
    email: req.body.email,
  });
  if (!student) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(
    req.body.password,
    student.password
  );
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = student.generateAuthToken();
  res.send(token);
});

router.get("/", auth, async (req, res) => {
  const result = await Student.find();
  if (!result) return res.status(404).send("Students not found");

  return res.status(200).send(result);
});

router.get("/:id", auth, async (req, res) => {
  const result = await Student.findOne({ _id: req.params.id });
  if (!result) return res.status(404).send("Students not found");

  return res.status(200).send(result);
});

router.put("/skills/", auth, async (req, res) => {
  const student = await Student.findByIdAndUpdate(
    req.user._id,
    { $set: { skills: req.body.skills } },
    {
      new: true,
    }
  ).select("name email skills -_id");

  if (!student) return res.status(404).send("Student not found");

  res.send(student);
});

router.put("/interests/add", auth, async (req, res) => {
  const student = await Student.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        interests: {
          $each: req.body.interests,
        },
      },
    },
    {
      new: true,
    }
  ).select("name email interests -_id");

  if (!student) return res.status(404).send("Student not found");

  res.send(student);
});

router.put("/projects/add", auth, async (req, res) => {
  let project = new Project(req.body.project);
  project.owner = await Student.findById(req.user._id).select("_id name");
  console.log(project.owner);
  project.save();

  const student = await Student.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        projects: _.pick(project, ["_id", "name", "technologies"]),
      },
    },
    {
      new: true,
    }
  ).select("name email projects -_id");

  if (!student) return res.status(404).send("Student not found");

  res.send(student);
});

router.put("/edit", auth, async (req, res) => {
  let update = req.body;
  delete update._id;

  const student = await Student.findOneAndUpdate(
    { _id: req.user._id },
    update,
    { new: true }
  );

  if (!student) return res.status(404).send("Student not found");

  res.send(student);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;