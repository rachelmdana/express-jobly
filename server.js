"use strict";

const app = require("./app");
const { PORT } = require("./config");

// const HOST = '127.0.0.1';

app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});