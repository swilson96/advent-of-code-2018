import _ from "lodash";
import BronKerbosch from "almete.bronkerbosch";

interface Point {
    w: number;
    x: number;
    y: number;
    z: number;
    toString: () => string;
    distanceFrom: (p: Point) => number;
}

class ThreePoint implements Point {
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
        return new ThreePoint(Number(bits[0]), Number(bits[1]), Number(bits[2]));
    }

    public get w(): number {
        throw new Error("tried to access fourth dimension of a three dimentional point");
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
        return new ThreePoint(this._x - 1, this._y - 1, this._z - 1);
    }
}

class FourPoint implements Point {
    private _w: number;
    private _x: number;
    private _y: number;
    private _z: number;

    constructor(w: number, x: number, y: number, z: number) {
        this._w = w;
        this._x = x;
        this._y = y;
        this._z = z;
    }

    public static fromString(hash: string) {
        const bits = hash.split(",");
        return new FourPoint(Number(bits[0]), Number(bits[1]), Number(bits[2]), Number(bits[3]));
    }

    public get w() {
        return this._w;
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

    public distanceFrom(other: FourPoint) {
        return Math.max(Math.abs(other.w - this.w), Math.abs(other.x - this.x), Math.abs(other.y - this.y), Math.abs(other.z - this.z));
    }

    public toString() {
        return `${this._w},${this._x},${this._y},${this._z}`;
    }
}

class Bot {
    private _r: number = 0;
    private _p: Point;

    constructor(p: Point, r: number) {
        this._p = p;
        this._r = r;

        if (this._r < 0) {
            console.error("negative range!?");
        }
    }

    public static fromQuestionInput(input: string) {
        const match = input.match(/pos=<([^,>]+),([^,>]+),([^,>]+)>, r=(\d+)/);
        const p = new ThreePoint(Number(match[1]), Number( match[2]), Number(match[3]));
        const r = Number(match[4]);
        return new Bot(p, r);
    }

    public isOtherInRange(other: Bot) {
        return this.isInRange(other.position);
    }

    public overlaps(other: Bot) {
        return this._p.distanceFrom(other.position) <= (this._r + other.range);
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
}

export function solvePartOne(input: string) {
    const bots = input.split(/\r?\n/).map(l => Bot.fromQuestionInput(l));
    const largestRangedBot = _.orderBy(bots, b => -b.range)[0];
    return bots.filter(b => largestRangedBot.isOtherInRange(b)).length;
}

export function solvePartTwo(input: string) {
    const bots = input.split(/\r?\n/).map(l => Bot.fromQuestionInput(l));

    const edges = [];
    for (let i = 0; i < bots.length; ++i) {
        const a = bots[i];
        for (let j = i + 1; j < bots.length; ++j) {
            if (a.overlaps(bots[j])) {
                edges.push([i, j]);
            }
        }
    }

    const cliques: number[][] = BronKerbosch(edges);

    const maxCliqueSize = _.max(cliques.map(c => c.length));
    const maxCliques = cliques.filter(c => c.length == maxCliqueSize);

    console.log(`${maxCliques.length} maximal cliques of size ${maxCliqueSize}`);

    // Finds the edges of the area of intersection of the given clique
    const closestPointInIntersection = (clique: number[]) => {
        const cbots = clique.map(c => bots[c]);

        // Surprise! First we linear map to 4D space, and switch from taxicab to the max-metric
        const linearMap = (p: Point) => new FourPoint(
            p.x + p.y + p.z,
            p.x + p.y - p.z,
            p.y + p.z - p.x,
            p.z + p.x - p.y,
        );
        const mappedBots = cbots.map(b => new Bot(linearMap(b.position), b.range));
        const overlapInFourSpace = [
            // The top of the intersection is the lowest of the tops of the intersecting 4-balls
            _.min(mappedBots.map(b => b.position.w + b.range)),
            // The bottom of the intersection is the highest of the bottoms of the intersecting 4-balls
            _.max(mappedBots.map(b => b.position.w - b.range)),
            // etc etc
            _.min(mappedBots.map(b => b.position.x + b.range)),
            _.max(mappedBots.map(b => b.position.x - b.range)),
            _.min(mappedBots.map(b => b.position.y + b.range)),
            _.max(mappedBots.map(b => b.position.y - b.range)),
            _.min(mappedBots.map(b => b.position.z + b.range)),
            _.max(mappedBots.map(b => b.position.z - b.range)),
        ];

        // Just take the minimum point in this four-dimensional region,
        // even though we are actually only interested in the 3D subset w = x + y + x
        // It's probably a fluke that this works at all.
        const w = Math.abs(overlapInFourSpace[0]) < Math.abs(overlapInFourSpace[1]) ? overlapInFourSpace[0] : overlapInFourSpace[1];
        const x = Math.abs(overlapInFourSpace[2]) < Math.abs(overlapInFourSpace[3]) ? overlapInFourSpace[2] : overlapInFourSpace[3];
        const y = Math.abs(overlapInFourSpace[4]) < Math.abs(overlapInFourSpace[5]) ? overlapInFourSpace[4] : overlapInFourSpace[5];
        const z = Math.abs(overlapInFourSpace[6]) < Math.abs(overlapInFourSpace[7]) ? overlapInFourSpace[6] : overlapInFourSpace[7];
        const closestPoint = new FourPoint(w, x, y, z);
        const minDistanceFromOrigin = closestPoint.distanceFrom(new FourPoint(0, 0, 0, 0));

        console.log(`minDistanceFromOrigin is ${closestPoint.toString()}: ${minDistanceFromOrigin}`);

        // Check by mapping back.
        // This actually doesn't yield a point with the best score in the original space,
        // but the distance seems to be correct (in cases tested so far).
        const xOrig = (closestPoint.z + closestPoint.x) / 2;
        const yOrig = (closestPoint.x + closestPoint.y) / 2;
        const zOrig = (closestPoint.y + closestPoint.z) / 2;
        const original = new ThreePoint(xOrig, yOrig, zOrig);
        const score = bots.filter(b => b.isInRange(original)).length;
        console.log(`original point: ${original.toString()}; score: ${score}`);

        return minDistanceFromOrigin;
    };

    const maxScoreDistancesCloseToOrigin = _.flatMap(maxCliques, closestPointInIntersection);
    return _.min(maxScoreDistancesCloseToOrigin);
}