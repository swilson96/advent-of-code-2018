import _ from "lodash";

class Point {
    private _x: number;
    private _y: number;
    private _z: number;

    constructor(x: number, y: number, z: number) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    public get x() {
        return this._x;
    }

    public get y() {
        return this._y;
    }

    public get z() {
        return this._z;
    }

    public distanceFrom(other: Point) {
        return Math.abs(other.x - this.x) + Math.abs(other.y - this.y) + Math.abs(other.z - this.z);
    }

    public toString() {
        return `${this._x},${this._y},${this._z}`;
    }
}

class Bot {
    private _range: number = 0;
    private _position: Point;

    constructor(input: string) {
        const match = input.match(/pos=<([^,>]+),([^,>]+),([^,>]+)>, r=(\d+)/);
        this._position = new Point(Number(match[1]), Number( match[2]), Number(match[3]));
        this._range = Number(match[4]);

        if (this._range < 0) {
            console.error("negative range!?");
        }
    }

    public isOtherInRange(other: Bot) {
        return this.isInRange(other.position);
    }

    public isInRange(position: Point) {
        return position.distanceFrom(this.position) <= this.range;
    }

    public get range() {
        return this._range;
    }

    public get position() {
        return this._position;
    }
}

export function solvePartOne(input: string) {
    const bots = input.split(/\r?\n/).map(l => new Bot(l));
    const largestRangedBot = _.orderBy(bots, b => -b.range)[0];
    return bots.filter(b => largestRangedBot.isOtherInRange(b)).length;
}

export function solvePartTwo(input: string) {
    const bots = input.split(/\r?\n/).map(l => new Bot(l));

    const botsBotIsInRangeOf = (bot: Bot) => bots.filter(b => b.isOtherInRange(bot)).length;

    const mn = _.orderBy(bots, botsBotIsInRangeOf)[0];
    let f = mn.position;
    let r = mn.range / 2;

    let maxScore = 0;
    let maxScorePositions: Point[] = [];

    while (r > 100) {

        const xs = bots.map(b => b.position.x);
        const xRange = [_.min(xs), _.max(xs)];
        const ys = bots.map(b => b.position.y);
        const yRange = [_.min(ys), _.max(ys)];
        const zs = bots.map(b => b.position.z);
        const zRange = [_.min(zs), _.max(zs)];

        // const xRange = [f.x - r, f.x + r];
        // const yRange = [f.y - r, f.y + r];
        // const zRange = [f.z - r, f.z + r];

        console.log(`bot range: ${xRange[1] - xRange[0]}, ${yRange[1] - yRange[0]}, ${zRange[1] - zRange[0]}`)

        const searchDensity = Math.max(1, _.floor((xRange[1] - xRange[0]) / 100));

        for (let x = xRange[0]; x <= xRange[1]; x += searchDensity) {
            for (let y = yRange[0]; y <= yRange[1]; y += searchDensity) {
                for (let z = zRange[0]; z <= zRange[1]; z += searchDensity) {
                    const position = new Point(x, y, x);
                    const score = bots.filter(b => b.isInRange(position)).length;
                    if (score === maxScore) {
                        maxScorePositions.push(position);
                    } else if (score > maxScore) {
                        maxScore = score;
                        maxScorePositions = [position];
                    }
                }
            }
        }

        f = _.orderBy(maxScorePositions, s => s.distanceFrom(new Point(0, 0, 0)))[0];
        r = searchDensity;

        console.log(`max within current density was ${f.toString()} with ${maxScore} in range, new search density is ${searchDensity}`);
    }

    // let maxScore = 0;
    // maxScorePositions = [];
    // for (let x = sampleMax.x - SAMPLE_GRID_SIZE; x <= sampleMax.x + SAMPLE_GRID_SIZE; x += 1) {
    //     for (let y = sampleMax.y - SAMPLE_GRID_SIZE; y <= sampleMax.y + SAMPLE_GRID_SIZE; y += 1) {
    //         for (let z = sampleMax.z - SAMPLE_GRID_SIZE; z <= sampleMax.z + SAMPLE_GRID_SIZE; z += 1) {
    //             const position = new Point(x, y, x);
    //             const score = bots.filter(b => b.isInRange(position)).length;
    //             if (score === maxScore) {
    //                 maxScorePositions.push(position);
    //             } else if (score > maxScore) {
    //                 maxScore = score;
    //                 maxScorePositions = [position];
    //             }
    //         }
    //     }
    // }

    return _.map(maxScorePositions, s => s.distanceFrom(new Point(0, 0, 0))).sort((a,b) => a - b)[0];
}