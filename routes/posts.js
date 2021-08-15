const _ = require("lodash");
const { Student } = require("../models/student");
const { Post } = require("../models/post");
const { upload } = require("../middleware/upload");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.put(
  "/photo/:id",
  [auth, upload.single("thumbnail")],
  async (req, res) => {
    const student = await Student.findById(req.user._id).select("_id name");
    if (!student) return res.status(404).send("Student not found");

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          thumbnail: "public/images/" + req.file.filename,
        },
      },
      { new: true }
    );

    res.send(post);
  }
);

router.post("/add", auth, async (req, res) => {
  const student = await Student.findById(req.user._id).select(
    "_id name avatar"
  );
  if (!student) return res.status(404).send("Student not found");

  let post = new Post({
    owner: student,
    content: req.body.content,
    timeStamp: Date.now(),
  });

  post = await post.save();

  res.send(post);
});

router.get("/", auth, async (req, res) => {
  const result = await Post.find().sort({ timeStamp: -1 });
  if (!result) return res.status(404).send("Posts not found");

  return res.status(200).send(result);
});

module.exports = router;
