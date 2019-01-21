import _ from "lodash";
import Point from "../util/point";

interface CaveDef {
    depth: number;
    target: {x: number, y: number };
}

const equipmentToString = (e: number) => {
    switch (e) {
        case 0:
            return "Torch";
        case 1:
            return "Climbing Gear";
        case 2:
            return "Neither";
        default:
            throw new Error("Invalid equipment: " + e);
    }
}

export class Cave {
    private _depth: number;
    private _target: Point;
    private _geoCave: number[][];
    private _riskCave: number[][];
    private _max: Point;

    constructor({ depth, target }: CaveDef) {
        this._depth = depth;
        this._target = new Point(target.x, target.y);

        this._max = new Point(target.x + 6, target.y + 6);
        this._geoCave = [];
        this._geoCave[0] = [];
        this._geoCave[0][0] = 0;
        this._riskCave = [];
        this._riskCave[0] = [];
        this._riskCave[0][0] = 0;
        for (let y = 1; y <= this._max.y; ++y) {
            this._geoCave[0][y] = (y * 48271) % 20183;
            this._riskCave[0][y] = this.calculateRiskAt(0, y);
        }
        for (let x = 1; x <= this._max.x; ++x) {
            this._geoCave[x] = [];
            this._riskCave[x] = [];
            this._geoCave[x][0] = (x * 16807) % 20183;
            this._riskCave[x][0] = this.calculateRiskAt(x, 0);
            for (let y = 1; y <= this._max.y; ++y) {
                if (x === target.x && y === target.y) {
                    this._geoCave[x][y] = 0;
                } else {
                    this._geoCave[x][y] = (this.erosionIndexAt(x - 1, y) * this.erosionIndexAt(x, y - 1)) % 20183;
                }
                this._riskCave[x][y] = this.calculateRiskAt(x, y);
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
        return this._riskCave[x][y];
    }

    private calculateRiskAt(x: number, y: number) {
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

    public djikstraToTarget() {
        // https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Pseudocode
        const Torch = 0;
        const ClimbingGear = 1;
        const Neither = 2;

        const Q: Place[] = []; // Consider e.g. "<0,0> with climbing gear" as a place
        let dist: number[][][] = [];
        // let prev: number[][][] = [];
        let refs: Place[][][] = [];
        for (let x = 0; x <= this._max.x; ++x) {
            dist[x] = [];
            // prev[x] = [];
            refs[x] = [];
            for (let y = 0; y <= this._max.y; ++y) {
                dist[x][y] = [];
                // prev[x][y] = [];
                refs[x][y] = [];
                for (let e = 0; e < 3; ++e) {
                    //dist[x][y][e] = Number.POSITIVE_INFINITY;
                    const here = new Place(x, y, e);
                    Q.push(here);
                    refs[x][y][e] = here;
                }
            }
        }

        // You start at 0,0 (the mouth of the cave) with the torch equipped
        dist[0][0][Torch] = 0;

        while (Q.length > 0) {
            const u = _.sortBy(Q, q => dist[q.x][q.y][q.e])[0];
            const distanceToU = dist[u.x][u.y][u.e];
            const type = this.riskAt(u.x, u.y);
            const e = u.e;

            // console.log(`Examining ${u.toString()} in area type ${type}, distance is ${distanceToU}`);

            if (distanceToU === undefined) {
                console.log("no new places exist that I can get to");
                break;
            }

            if (u.x === this._target.x && u.y === this._target.y && u.e === Torch) {
                console.log("distance to target now fixed");
                break;
            }

            _.remove(Q, u);

            const neighbours = [];

            switch (type) {
                case 0: // rock
                    if (e === Torch) neighbours.push({ n: refs[u.x][u.y][ClimbingGear], d: 7});
                    if (e === ClimbingGear) neighbours.push({ n: refs[u.x][u.y][Torch], d: 7});
                    break;
                case 1: // wet
                    if (e === Neither) neighbours.push({ n: refs[u.x][u.y][ClimbingGear], d: 7});
                    if (e === ClimbingGear) neighbours.push({ n: refs[u.x][u.y][Neither], d: 7});
                    break;
                case 2: // narrow
                    if (e === Neither) neighbours.push({ n: refs[u.x][u.y][Torch], d: 7});
                    if (e === Torch) neighbours.push({ n: refs[u.x][u.y][Neither], d: 7});
                    break;
            }

            const checkAndPushMove = (newX: number, newY: number) => {
                const nextType = this.riskAt(newX, newY);
                switch (nextType) {
                    case 0: // rock
                        if (e === Torch || e === ClimbingGear) neighbours.push({ n: refs[newX][newY][e], d: 1});
                        break;
                    case 1: // wet
                        if (e === Neither || e === ClimbingGear) neighbours.push({ n: refs[newX][newY][e], d: 1});
                        break;
                    case 2: // narrow
                        if (e === Torch || e === Neither) neighbours.push({ n: refs[newX][newY][e], d: 1});
                        break;
                }
            }

            if (u.x > 0) checkAndPushMove(u.x - 1, u.y);
            if (u.y > 0) checkAndPushMove(u.x, u.y - 1);
            if (u.x < this._max.x) checkAndPushMove(u.x + 1, u.y);
            if (u.y < this._max.y) checkAndPushMove(u.x, u.y + 1);

            neighbours.forEach(v => {
                const currentDistance = dist[v.n.x][v.n.y][v.n.e];
                const alt = v.d + distanceToU;
                // console.log(`Checking neighbour ${v.n.toString()}, prev best ${currentDistance}, new best ${alt}`);
                if (!currentDistance || currentDistance > alt) {
                    dist[v.n.x][v.n.y][v.n.e] = alt;
                }
            });
        }

        return dist[this._target.x][this._target.y][Torch];
    }
}

class Place {
    public x: number;
    public y: number;
    public e: number;

    constructor(x: number, y: number, e: number) {
        this.x = x;
        this.y = y;
        this.e = e;
    }

    public get equipmentToString() {
        return equipmentToString(this.e);
    }

    public toString() {
        return `<${this.x},${this.y},${this.equipmentToString}>`;
    }
}

export function solvePartOne(input: CaveDef) {
    const cave = new Cave(input);
    return cave.sumRiskToTarget();
}

export function solvePartTwo(input: CaveDef) {
    const cave = new Cave(input);
    return cave.djikstraToTarget();
}