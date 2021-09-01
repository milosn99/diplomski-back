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
const multer = require("multer");

router.post("/", async (req, res) => {
  try {
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
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    const token = student.generateAuthToken();
    res.send(token);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const result = await Student.find({ _id: { $ne: req.user._id } });
    if (!result) return res.status(404).send("Students not found");

    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/filter", auth, async (req, res) => {
  try {
    if (req.user.userType !== "recruiter" && req.user.userType !== "admin")
      return res.status(403).send("Forbidden");
    let page = req.query.page;
    delete req.query.page;
    const result = await Student.find(req.query)
      .skip(10 * page)
      .limit(10);
    if (!result) return res.status(404).send("Students not found");

    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/count", auth, async (req, res) => {
  try {
    if (req.user.userType !== "recruiter" && req.user.userType !== "admin")
      return res.status(403).send("Forbidden");
    delete req.query.page;
    const count = await Student.countDocuments(req.query);

    return res.send({ count });
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const result = await Student.findById(req.params.id).select("-password");
    if (!result) return res.status(404).send("Students not found");

    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put("/skills/", auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.user._id,
      { $set: { skills: req.body.skills } },
      {
        new: true,
      }
    ).select("name email skills -_id");

    if (!student) return res.status(404).send("Student not found");

    res.send(student);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put("/interests/add", auth, async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put("/edit", auth, async (req, res) => {
  try {
    let update = req.body;
    delete update._id;

    const student = await Student.findOneAndUpdate(
      { _id: req.user._id },
      update,
      { new: true }
    );

    if (!student) return res.status(404).send("Student not found");

    res.send(student);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/new", auth, async (req, res) => {
  try {
    if (req.user.userType !== "admin") return res.status(403).send("Forbidden");
    let student = req.body.student;
    student.password = await bcrypt.hash(req.body.student.password, 10);
    student = new Student(student);
    student.avatar = `public/avatars/${student._id}.jpg`;
    student = await student.save();
    return res.status(200).send(student);
  } catch (err) {
    return res.status(400).send(err);
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/avatars");
  },

  filename: (req, file, cb) => {
    cb(null, `${req.user._id}.jpg`);
  },
});

const upload = multer({ storage: storage });

router.put(
  "/photo/:id",
  [auth, upload.single("avatar")],
  async (req, res) => {}
);

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
