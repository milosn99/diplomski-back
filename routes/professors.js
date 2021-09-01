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
  try {
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
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    const token = professor.generateAuthToken();
    res.send(token);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put("/students", auth, async (req, res) => {
  try {
    const professor = await Professor.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { students: req.body.student } },
      {
        new: true,
      }
    ).select("name email students");

    await Student.findByIdAndUpdate(
      req.body.student._id,
      {
        $addToSet: {
          professors: _.pick(professor, ["_id", "name"]),
        },
      },
      {
        new: true,
      }
    );

    if (!professor) return res.status(404).send("Professor not found");

    res.send(professor);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put("/projects", auth, async (req, res) => {
  try {
    const professor = await Professor.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { projects: req.body.project } },
      {
        new: true,
      }
    ).select("name email projects");

    for (project of req.body.projects) {
      await Project.findByIdAndUpdate(
        project._id,
        {
          $addToSet: {
            mentors: {
              _id: professor._id,
              name: professor.name,
              comment: req.body.comment,
            },
          },
        },
        {
          new: true,
        }
      );
    }

    if (!professor) return res.status(404).send("Professor not found");

    res.send(professor);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/new", auth, async (req, res) => {
  try {
    if (req.user.userType !== "admin") return res.status(403).send("Forbidden");
    let professor = req.body.professor;
    professor.password = await bcrypt.hash(req.body.professor.password, 10);
    professor = new Professor(professor);
    professor.avatar = `public/avatars/${professor._id}.jpg`;
    professor = await professor.save();
    return res.status(200).send(professor);
  } catch (err) {
    return res.status(400).send(err);
  }
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
