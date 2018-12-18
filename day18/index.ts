import _ from "lodash";

const scoreGrid = (grid: string[][]) => {
    let woods = 0;
    let yards = 0;
    grid.forEach(row => {
        row.forEach(acre => {
            if (acre === "|") {
                ++woods;
            } else if (acre === "#") {
                ++yards;
            }
        });
    });

    return woods * yards;
};

const evolveGrid = (grid: string[][]) => {
    const newGrid: string[][] = [];
    for (let x = 0; x < grid.length; ++x) {
        newGrid[x] = [];
        const row = grid[x];
        const above = x > 0 ? grid[x - 1] : [];
        const below = x < grid.length - 1 ? grid[x + 1] : [];

        for (let y = 0; y < row.length; ++y) {
            const previous = row[y];
            let newAcre = previous;
            let woods = 0;
            let yards = 0;
            const neighbours = [above[y - 1], above[y], above[y + 1], row[y - 1], row [y + 1], below[y - 1], below [y], below[y + 1]];
            neighbours.forEach(acre => {
                if (acre === "|") {
                    ++woods;
                } else if (acre === "#") {
                    ++yards;
                }
            });
            if (previous === "." && woods >= 3) {
                newAcre = "|";
            } else if (previous === "|" && yards >= 3) {
                newAcre = "#";
            } else if (previous === "#" && !(yards && woods)) {
                newAcre = ".";
            }
            newGrid[x][y] = newAcre;
        }
    }
    return newGrid;
};

const printGrid = (grid: string[][]) => {
    grid.forEach(row => console.log(row.join("")));
};

const hashGrid = (grid: string[][]) => {
    return grid.map(row => row.join("")).join("") + ":" + scoreGrid(grid);
};

export function solvePartOne(input: string, days: number = 10) {
    let grid = input.split(/\r?\n/).map(l => l.split(""));

    const previousStates = [hashGrid(grid)];
    let day = 0;
    while (day < days) {
        grid = evolveGrid(grid);
        ++day;
        // printGrid(grid);

        const hash = hashGrid(grid);
        const loopStart = previousStates.indexOf(hash);

        if (loopStart > 0) {
            if (previousStates[loopStart] !== hash) {
                console.log("Errorororoor! " + loopStart);
            }

            // days: 100
            // loop start: 17
            // loop end day: 27 i.e. hash[17] === hash[27]
            // loop length = 27 - 17 = 10
            // target time = (100 - 17) % 10 = 83 % 10 = 3
            // target + loop start = 17 + 3 = 20
            // hash[20] === hash[100]
            const loopLength = day - loopStart;
            let targetTime = (days - loopStart) % loopLength;
            while (targetTime < 0) {
                targetTime += loopLength;
            }
            console.log(`Loop found! start ${loopStart}, length ${loopLength}, targeting ${targetTime + loopStart}`);
            return Number(previousStates[targetTime + loopStart].split(":")[1]);
        }

        previousStates.push(hash);
    }

    return scoreGrid(grid);
}

export function solvePartTwo(input: string) {
    return solvePartOne(input, 1000000000);
}