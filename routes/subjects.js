const _ = require("lodash");
const { Subject } = require("../models/subject");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const result = await Subject.find().select("name _id");
    if (!result) return res.status(404).send("Companies not found");
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
