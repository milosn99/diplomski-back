const winston = require("winston");
const express = require("express");
const app = express();
const port = 3001;

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const server = app.listen(port, () =>
  winston.info(`Staring app on port ${port}!`)
);
require("./startup/socket")(server);

module.exports = server;
