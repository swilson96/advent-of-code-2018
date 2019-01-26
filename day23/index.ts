import _ from "lodash";
import BronKerbosch from "almete.bronkerbosch";

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

export class Cuboid {
    constructor(public T: Point, public B: Point, public N: Point, public S: Point, public E: Point, public W: Point) {
    }

    public intersect(other: Bot) {

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

    public get extremes() {
        return new Cuboid(
            // T, B, N, S, E, W,
            new Point(this._p.x, this._p.y, this._p.z + this._r),
            new Point(this._p.x, this._p.y, this._p.z - this._r),
            new Point(this._p.x, this._p.y + this._r, this._p.z),
            new Point(this._p.x, this._p.y - this._r, this._p.z),
            new Point(this._p.x + this._r, this._p.y, this._p.z),
            new Point(this._p.x - this._r, this._p.y, this._p.z),
        )
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
    const intersectionEdges = (clique: number[]) => {
        const cbots = clique.map(c => bots[c]);
        const extremes = cbots.map(b => b.extremes);
        const range = [
            _.min(extremes.map(e => e.T.z)),
            _.max(extremes.map(e => e.B.z)),
            _.min(extremes.map(e => e.N.y)),
            _.max(extremes.map(e => e.S.y)),
            _.min(extremes.map(e => e.E.x)),
            _.max(extremes.map(e => e.W.x)),
        ];
        // const smallestRange = _.min(cbots.map(b => b.range));
        // const smallestBot = cbots.find(b => b.range === smallestRange);
        // let intersection = smallestBot.extremes;
        // cbots.forEach(bot => {
        //     intersection = intersection.intersect(bot.extremes);
        // });
        console.log(`range (T,B,N,S,E,W): ${range}`);
        console.log(`size: ${range[0] - range[1]} x ${range[2] - range[3]} x ${range[4] - range[5]}}`);
        return range;
    }

    const maxScorePositions = _.flatMap(maxCliques, intersectionEdges);
    //return _.map(maxScorePositions, s => s.distanceFrom(new Point(0, 0, 0))).sort((a, b) => a - b)[0];
}