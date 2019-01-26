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

    public static fromString(hash: string) {
        const bits = hash.split(",");
        return new Point(Number(bits[0]), Number(bits[1]), Number(bits[2]));
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

    public get moveIn() {
        // Only works in positive quadrant ¯\_(ツ)_/¯
        return new Point(this._x - 1, this._y - 1, this._z - 1);
    }
}

class Bot {
    private _r: number = 0;
    private _p: Point;

    constructor(input: string) {
        const match = input.match(/pos=<([^,>]+),([^,>]+),([^,>]+)>, r=(\d+)/);
        this._p = new Point(Number(match[1]), Number( match[2]), Number(match[3]));
        this._r = Number(match[4]);

        if (this._r < 0) {
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
        return this._r;
    }

    public get position() {
        return this._p;
    }

    public get extremes() {
        return [
            new Point(this._p.x + this._r, this._p.y, this._p.z),
            new Point(this._p.x - this._r, this._p.y, this._p.z),
            new Point(this._p.x, this._p.y + this._r, this._p.z),
            new Point(this._p.x, this._p.y - this._r, this._p.z),
            new Point(this._p.x, this._p.y, this._p.z + this._r),
            new Point(this._p.x, this._p.y, this._p.z - this._r),
        ]
    }

    public get perimiter() {
        const ret = [];
        for (let x = this._p.x - this._r; x <= this._p.x + this._r; ++x) {
            const rangeLeft = this._r - Math.abs(x - this._p.x);
            for (let y = this._p.y - rangeLeft; y <= this._p.y + rangeLeft; ++y) {
                const zDiff = this._r - rangeLeft - Math.abs(y - this._p.y);
                ret.push(new Point(x, y, this._p.z - zDiff));
                if (zDiff) {
                    ret.push(new Point(x, y, this._p.z + zDiff));
                }
            }
        }
        return ret;
    }
}

export function solvePartOne(input: string) {
    const bots = input.split(/\r?\n/).map(l => new Bot(l));
    const largestRangedBot = _.orderBy(bots, b => -b.range)[0];
    return bots.filter(b => largestRangedBot.isOtherInRange(b)).length;
}

export function solvePartTwo(input: string) {
    const bots = input.split(/\r?\n/).map(l => new Bot(l));

    //const pointsToCheck = _.flatMap(bots, b => b.extremes);
    const pointsToCheck = _.uniq(_.flatMap(bots, b => b.perimiter.map(b => b.toString()))).map(Point.fromString);

    console.log(`points to check: ${pointsToCheck.length}`);

    let maxScore = 0;
    let maxScorePositions: Point[] = [];

    const score = (position: Point) => bots.filter(b => b.isInRange(position)).length;

    pointsToCheck.forEach(position => {
        const thisScore = score(position);
        if (thisScore === maxScore) {
            maxScorePositions.push(position);
        } else if (thisScore > maxScore) {
            maxScore = thisScore;
            maxScorePositions = [position];
        }
    });

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

    console.log(`max score positions (${maxScorePositions.length}), score ${maxScore}:`);
    maxScorePositions.forEach(p => console.log(p.toString()));

    return _.map(maxScorePositions, s => s.distanceFrom(new Point(0, 0, 0))).sort((a, b) => a - b)[0];
}