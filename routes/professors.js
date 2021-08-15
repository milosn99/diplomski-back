const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Professor } = require("../models/professor");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Project } = require("../models/project");
const { Student } = require("../models/student");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let professor = await Professor.findOne({
    email: req.body.email,
  });
  if (!professor) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(
    req.body.password,
    professor.password
  );
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = professor.generateAuthToken();
  res.send(token);
});

router.put("/students", auth, async (req, res) => {
  const professor = await Professor.findByIdAndUpdate(
    req.user._id,
    { $set: { students: req.body.students } },
    {
      new: true,
    }
  ).select("name email students");

  for (student of req.body.students) {
    await Student.findByIdAndUpdate(
      student._id,
      {
        $addToSet: {
          professors: _.pick(professor, ["_id", "name"]),
        },
      },
      {
        new: true,
      }
    );
  }

  if (!professor) return res.status(404).send("Professor not found");

  res.send(professor);
});

router.put("/projects", auth, async (req, res) => {
  const professor = await Professor.findByIdAndUpdate(
    req.user._id,
    { $set: { projects: req.body.projects } },
    {
      new: true,
    }
  ).select("name email projects");

  for (project of req.body.projects) {
    await Project.findByIdAndUpdate(
      project._id,
      {
        $addToSet: {
          mentors: _.pick(professor, ["_id", "name"]),
        },
      },
      {
        new: true,
      }
    );
  }

  if (!professor) return res.status(404).send("Professor not found");

  res.send(professor);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
