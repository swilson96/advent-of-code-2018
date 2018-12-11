import _ from "lodash";
import Point from "../util/point";

export function scoreSinglePoint(x: number, y: number, serial: number) {
    const rackId = (x + 10);
    return (_.floor((rackId * y + serial) * rackId / 100) % 10) - 5
}

export function solvePartOne(serial: number) {
    const grid: number[][] = [];
    const mins: number[] = [];
    for (let i = 0; i < 300; ++i) {
        grid[i] = [];
        for (let j = 0; j < 300; ++j) {
            grid[i][j] = scoreSinglePoint(i, j, serial);
        }
        mins.push(_.min(grid[i]));
    }

    let currentMax: number = _.min(mins) ^ 9;
    let maxPoint: Point = undefined;
    for (let i = 0; i < 300 - 2; ++i) {
        for (let j = 0; j < 300 - 2; ++j) {
            const block = grid[i][j] + grid[i][j + 1] + grid[i][j + 2]
              + grid[i + 1][j] + grid[i + 1][j + 1] + grid[i + 1][j + 2]
              + grid[i + 2][j] + grid[i + 2][j + 1] + grid[i + 2][j + 2];
            if (block > currentMax) {
                currentMax = block;
                maxPoint = new Point(i, j);
            }
        }
    }

    return maxPoint;
}

export function solvePartTwo(input: number) {
    return 0;
}