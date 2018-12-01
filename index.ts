import * as fs from "fs";
import * as path from "path";

console.log("Answers");

fs.readdirSync(path.dirname('.')).forEach(fileName => {
    if (fileName.startsWith("day")) {
        console.log(fileName);
        const solve = require(`./${fileName}`).default;
        const input = require(`./${fileName}/input`).default;
        console.log(solve(input));
    }
});