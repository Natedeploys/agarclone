// server.js is only for making the express and socketio servers

/**
 * Set up the express application
 */

const express = require("express");
const app = express();

/**
 * Pass the static html, css and javascript files
 * that make up our client
 */

app.use(express.static(__dirname + "/public"));

/**
 * Set up the socketio listener.
 * We set up the express server.
 * Then tell socketio to use it.
 */
const port = 8080;
const socketio = require("socket.io");
const expressServer = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);
const io = socketio(expressServer);

/**
 * Use helmet middleware for protection.
 */

const helmet = require("helmet");
app.use(helmet());

/**
 * App organization
 */

module.exports = {
  app,
  io
};
