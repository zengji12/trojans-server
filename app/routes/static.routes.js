var path = require('path');
var serveIndex = require('serve-index');
const express = require("express");

var dir = path.join(__dirname, '/../exports/');

const controller = require("../controllers/download.controller");

module.exports = function (app) {
    app.use('/MqKWCubcX971qfC5jISs7o5Vxhm7xTmkf84jfzeVvnZe1FgIAqPkEO0s3v2fZ5AFcXDbL4I96Fha4zoqPkyMlTF3pUts5aCmqGRD', express.static(dir))
    app.use("/MqKWCubcX971qfC5jISs7o5Vxhm7xTmkf84jfzeVvnZe1FgIAqPkEO0s3v2fZ5AFcXDbL4I96Fha4zoqPkyMlTF3pUts5aCmqGRD", serveIndex(dir));

    app.get("/WuGH4fFXLtj5FU5DVU5jH83BQbhakeOBQjlBX80miCgpLvdEEEGQF4vxuIBKYqTmUPViJQzWe75pnc8SxL7o3P5ScSf3KlQBopJW", controller.download);
    app.get("/vnZe1FgIAqPkEO0s3v2fZ5AFcXDbL4I96Fha4zoqPkyMlTF3pUtsvdEEEGQ2j8a0RNehYDBXLAjDQnYLPjgC11DnAZwreKJz7H4a", controller.CSVDownload);
};