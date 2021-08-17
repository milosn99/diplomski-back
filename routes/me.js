const _ = require("lodash");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const { Student } = require("../models/student");
const { Professor } = require("../models/professor");
const { Recruiter } = require("../models/recruiter");
const { Post } = require("../models/post");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  if (req.user.userType == "student") {
    const student = await Student.findById(req.user._id).select("-password");
    return res.status(200).send(student);
  }
  if (req.user.userType == "professor") {
    const professor = await Professor.findById(req.user._id).select(
      "-password"
    );
    return res.status(200).send(professor);
  }
  if (req.user.userType == "recruiter") {
    const recruiter = await Recruiter.findById(req.user._id).select(
      "-password"
    );
    return res.status(200).send(recruiter);
  }
});

router.get("/posts", auth, async (req, res) => {
  const result = await Post.find({ "owner._id": req.user._id })
    .sort({ timeStamp: -1 })
    .limit(10);
  if (!result) return res.status(404).send("Posts not found");

  return res.status(200).send(result);
});

module.exports = router;
