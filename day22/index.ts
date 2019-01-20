import _ from "lodash";
import Point from "../util/point";

interface CaveDef {
    depth: number;
    target: Point;
}

export class Cave {
    private _depth: number;
    private _target: Point;
    private _geoCave: number[][];

    constructor({ depth, target }: CaveDef) {
        this._depth = depth;
        this._target = target;

        const max = Math.max(target.x, target.y, 16);
        this._geoCave = [];
        this._geoCave[0] = [];
        this._geoCave[0][0] = 0;
        for (let y = 1; y <= max; ++y) {
            this._geoCave[0][y] = (y * 48271) % 20183;
        }
        for (let x = 1; x <= max; ++x) {
            this._geoCave[x] = [];
            this._geoCave[x][0] = (x * 16807) % 20183;
            for (let y = 1; y <= max; ++y) {
                if (x === target.x && y === target.y) {
                    this._geoCave[x][y] = 0;
                } else {
                    this._geoCave[x][y] = (this.erosionIndexAt(x - 1, y) * this.erosionIndexAt(x, y - 1)) % 20183;
                }
            }
        }
        
    }

    public geoIndexAt(x: number, y: number) {
        return this._geoCave[x][y];
    }

    // A region's erosion level is its geologic index plus the cave system's depth, all modulo 20183.
    public erosionIndexAt(x: number, y: number) {
        return (this._geoCave[x][y] + this._depth) % 20183;
    }

    // risk = erosion level modulo 3
    public riskAt(x: number, y: number) {
        return this.erosionIndexAt(x, y) % 3;
    }

    public typeAt(x: number, y: number) {
        if (x === 0 && y === 0) {
            return "M";
        }
        if (x === this._target.x && y === this._target.y) {
            return "T";
        }
        const risk = this.riskAt(x, y);
        switch (risk) {
            case 0:
                return ".";
            case 1:
                return "=";
            case 2:
                return "|";
            default:
                throw new Error("no such risk level: " + risk);
        }
    }

    public draw() {
        const builder = [];
        for (let y = 0; y <= 15; ++y) {
            for (let x = 0; x <= 15; ++x) {
                builder.push(this.typeAt(x, y));
            }
            builder.push("\n");
        }
        return builder.join("");
    }

    public sumRiskToTarget() {
        let acc = 0;
        for (let y = 0; y <= this._target.y; ++y) {
            for (let x = 0; x <= this._target.x; ++x) {
                acc += this.riskAt(x, y);
            }
        }
        return acc;
    }
}

export function solvePartOne(input: CaveDef) {
    const cave = new Cave(input);
    return cave.sumRiskToTarget();
}

export function solvePartTwo(input: string) {
    return 0;
}