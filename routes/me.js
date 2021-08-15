const _ = require("lodash");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const { Student } = require("../models/student");
const { Professor } = require("../models/professor");
const { Recruiter } = require("../models/recruiter");
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
module.exports = router;
