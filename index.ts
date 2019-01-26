import * as fs from "fs";
import * as path from "path";

const timedOutput = (dayString: string, part: string, solution: any, input: any) => {
    const start = new Date().getTime();
    const result = solution(input);
    const stop = new Date().getTime();
    const duration = stop - start;
    console.log(`${dayString} part ${part} complete in ${(duration / 1000).toFixed(1)} secs: ${result}`);
};

const outputForDay = (dayString: string) => {
    const input = require("./" + dayString + "/input")["default"];
    const p1 = require("./" + dayString)["solvePartOne"];
    const p2 = require("./" + dayString)["solvePartTwo"];
    timedOutput(dayString, "one", p1, input);
    timedOutput(dayString, "two", p2, input);
};

const name = process.argv[2];

if (name) {
    console.log(name);
    outputForDay(name);
} else {
    fs.readdirSync(path.dirname(".")).forEach(function (fileName) {
        if (fileName.startsWith("day")) {
            outputForDay(fileName);
        }
    });
}