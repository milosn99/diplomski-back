const _ = require("lodash");
const { Project } = require("../models/project");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const { Student } = require("../models/student");
const router = express.Router();

router.get("/:id", auth, async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) res.status(404).send("Project not found");
    return res.status(200).send(project);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/add", auth, async (req, res) => {
  const session = await Project.startSession();
  session.startTransaction();
  try {
    let project = new Project(req.body.project);
    project.owner = await Student.findById(req.user._id).select("_id name");
    await project.save({ session });

    const student = await Student.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          projects: _.pick(project, ["_id", "name", "technologies"]),
        },
      },
      {
        new: true,
        session: session,
      }
    ).select("name email projects -_id");

    for (contributor of req.body.project.contributors) {
      const con = await Student.findByIdAndUpdate(
        contributor._id,
        {
          $push: {
            projects: _.pick(project, ["_id", "name", "technologies"]),
          },
        },
        {
          new: true,
          session: session,
        }
      ).select("name email projects -_id");
      if (!con) {
        res.status(404).send("Contributor is not a student");
        await session.abortTransaction();
        session.endSession();
        return;
      }
    }

    if (!student) {
      res.status(404).send("Student not found");
      await session.abortTransaction();
      session.endSession();
      return;
    }

    await session.commitTransaction();
    session.endSession();

    res.send(student);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send(err);
  }
});

router.put("/edit/:id", auth, async (req, res) => {
  try {
    if (!req.body) return res.status(400).send("No project provided");
    if (!req.body.owner || req.body.owner._id != req.user._id)
      return res.status(403).send("You are not the owner of this project");

    let update = req.body;
    delete update._id;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id },
      update,
      { new: true }
    );

    const student = await Student.findOneAndUpdate(
      { _id: project.owner._id, "projects._id": project._id },
      {
        $set: {
          "projects.$.name": project.name,
          "projects.$.technologies": project.technologies,
        },
      },
      { new: true }
    );

    if (!project || !student) return res.status(404).send("Project not found");

    res.send(project);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
