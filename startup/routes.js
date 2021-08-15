const express = require("express");
const students = require("../routes/students");
const professors = require("../routes/professors");
const recruiters = require("../routes/recruiters");
const posts = require("../routes/posts");
const me = require("../routes/me");
const projects = require("../routes/projects");
const cors = require("cors");
const multer = require("multer");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  app.use("/public/images", express.static(process.cwd() + "/public/images"));
  app.use("/public/avatars", express.static(process.cwd() + "/public/avatars"));
  app.use("/api/students", students);
  app.use("/api/professors", professors);
  app.use("/api/recruiters", recruiters);
  app.use("/api/posts", posts);
  app.use("/api/me", me);
  app.use("/api/projects", projects);
};
