import _ from "lodash";
import Point from "../util/point";
import Square from "../util/square";

const GRID_SIZE = 300;

export function scoreSinglePoint(x: number, y: number, serial: number) {
    const rackId = (x + 10);
    return (_.floor((rackId * y + serial) * rackId / 100) % 10) - 5;
}

export function solvePartOne(serial: number) {
    const grid: number[][] = [];
    const mins: number[] = [];
    for (let i = 0; i < GRID_SIZE; ++i) {
        grid[i] = [];
        for (let j = 0; j < GRID_SIZE; ++j) {
            grid[i][j] = scoreSinglePoint(i + 1, j + 1, serial);
        }
        mins.push(_.min(grid[i]));
    }

    let currentMax: number = _.min(mins) ^ 9;
    let maxPoint: Point = undefined;
    for (let i = 0; i < GRID_SIZE - 2; ++i) {
        for (let j = 0; j < GRID_SIZE - 2; ++j) {
            const block = grid[i][j] + grid[i][j + 1] + grid[i][j + 2]
              + grid[i + 1][j] + grid[i + 1][j + 1] + grid[i + 1][j + 2]
              + grid[i + 2][j] + grid[i + 2][j + 1] + grid[i + 2][j + 2];
            if (block > currentMax) {
                currentMax = block;
                maxPoint = new Point(i + 1, j + 1);
            }
        }
    }

    return maxPoint;
}

export function solvePartTwo(serial: number) {
    const grid: number[][] = [];
    const mins: number[] = [];
    for (let i = 0; i < GRID_SIZE; ++i) {
        grid[i] = [];
        for (let j = 0; j < GRID_SIZE; ++j) {
            grid[i][j] = scoreSinglePoint(i, j, serial);
        }
        mins.push(_.min(grid[i]));
    }

    // for (let i = 0; i < GRID_SIZE; ++i) {
    //     console.log(grid[i]);
    // }

    let currentMax: number = _.min(mins);
    let maxSquare: Square = undefined;
    for (let i = 0; i < GRID_SIZE - 2; ++i) {
        for (let j = 0; j < GRID_SIZE - 2; ++j) {
            let blockPower = 0;
            for (let size = 0; size < GRID_SIZE - _.max([i, j]); ++size) {
                blockPower += grid[i + size][j + size];
                if (size > 0) {
                    _.range(0, size).forEach(x => blockPower += grid[i + size][j + x] + grid[i + x][j + size]);
                }
                // console.log(`(${i},${j}), size ${size}, power ${blockPower}`);
                if (blockPower > currentMax) {
                    currentMax = blockPower;
                    maxSquare = new Square(i + 1, j + 1, size + 1);
                }
            }
        }
    }

    console.log(`max power was ${currentMax} at ${maxSquare}`);

    return maxSquare;
}