"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
console.log("Answers");
fs.readdirSync(path.dirname('.')).forEach(function (fileName) {
    if (fileName.startsWith("day")) {
        console.log(fileName);
        var solve = require("./" + fileName)["default"];
        var input = require("./" + fileName + "/input")["default"];
        console.log(solve(input));
    }
});
