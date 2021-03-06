const path = require("path");

module.exports = {
  target: "electron-main",
  entry: "./main.js",
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "main.js",
  },
  mode: "development",
  node: {
    __dirname: false,
  },
};
