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
    try {
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
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);

router.post("/add", auth, async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const result = await Post.find().sort({ timeStamp: -1 }).limit(10);
    if (!result) return res.status(404).send("Posts not found");

    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const result = await Post.find({ "owner._id": req.params.id })
      .sort({ timeStamp: -1 })
      .limit(10);
    if (!result) return res.status(404).send("Posts not found");

    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user._id)) {
      await post.updateOne({ $push: { likes: req.user._id } });
      res.status(200).send("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.user._id } });
      res.status(200).send("The post has been disliked");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
