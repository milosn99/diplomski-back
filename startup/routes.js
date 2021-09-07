const express = require("express");
const students = require("../routes/students");
const professors = require("../routes/professors");
const recruiters = require("../routes/recruiters");
const posts = require("../routes/posts");
const me = require("../routes/me");
const projects = require("../routes/projects");
const users = require("../routes/users");
const messages = require("../routes/messages");
const conversations = require("../routes/conversations");
const admins = require("../routes/admins");
const companies = require("../routes/companies");
const subjects = require("../routes/subjects");
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
  app.use("/api/users", users);
  app.use("/api/messages", messages);
  app.use("/api/conversations", conversations);
  app.use("/api/admins", admins);
  app.use("/api/companies", companies);
  app.use("/api/subjects", subjects);
};
