const _ = require("lodash");
const { Company } = require("../models/company");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    if (req.user.userType !== "admin") return res.status(403).send("Forbidden");
    let company = new Company(req.body.company);
    company = await company.save();
    return res.status(200).send(company);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const result = await Company.find().select("name _id location");
    if (!result) return res.status(404).send("Companies not found");
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
