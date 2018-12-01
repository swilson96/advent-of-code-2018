import * as fs from "fs";
import * as path from "path";

const outputForDay = (dayString: string) => {
    var input = require("./" + dayString + "/input")["default"];
    const p1 = require("./" + dayString)["solvePartOne"];
    const p2 = require("./" + dayString)["solvePartTwo"];
    console.log(`${dayString} part one: ${p1(input)}`);
    console.log(`${dayString} part two: ${p2(input)}`);
}

const name = process.argv[2];

if (name) {
    console.log(name);
    outputForDay(name);
} else {
    fs.readdirSync(path.dirname('.')).forEach(function (fileName) {
        if (fileName.startsWith("day")) {
            outputForDay(fileName);
        }
    });
}