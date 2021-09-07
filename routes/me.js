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
  try {
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
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/type", auth, async (req, res) => {
  try {
    if (req.user.userType == "student") {
      const student = await Student.findById(req.user._id).select(
        "-_id userType"
      );
      return res.status(200).send(student);
    }
    if (req.user.userType == "professor") {
      const professor = await Professor.findById(req.user._id).select(
        "-_id userType"
      );
      return res.status(200).send(professor);
    }
    if (req.user.userType == "recruiter") {
      const recruiter = await Recruiter.findById(req.user._id).select(
        "-_id userType"
      );
      return res.status(200).send(recruiter);
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

// router.put("/hide", auth, async (req, res) => {
//   try {
//     if (req.user.userType == "student") {
//       const student = await Student.findByIdAndUpdate(
//         req.user._id,
//         {
//           $set: { private: true },
//         },
//         { new: true }
//       ).select("-_id userType");
//       return res.status(200).send(student);
//     }
//   } catch (err) {
//     return res.status(500).send(err);
//   }
// });

// router.put("/unhide", auth, async (req, res) => {
//   try {
//     if (req.user.userType == "student") {
//       const student = await Student.findByIdAndUpdate(
//         req.user._id,
//         {
//           $set: { private: false },
//         },
//         { new: true }
//       ).select("-_id userType");
//       return res.status(200).send(student);
//     }
//   } catch (err) {
//     return res.status(500).send(err);
//   }
// });

router.get("/posts", auth, async (req, res) => {
  try {
    const result = await Post.find({ "owner._id": req.user._id })
      .sort({ timeStamp: -1 })
      .limit(10);
    if (!result) return res.status(404).send("Posts not found");

    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/avatar", auth, async (req, res) => {
  try {
    return res.status(200).send(`public/avatars/${req.user._id}.jpg`);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
