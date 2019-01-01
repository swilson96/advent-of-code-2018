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
        return other.position.distanceFrom(this.position) <= this.range;
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
    console.log(`largest range: ${largestRangedBot.range}`);
    return bots.filter(b => largestRangedBot.isOtherInRange(b)).length;
}

export function solvePartTwo(input: string) {
    return 0;
}