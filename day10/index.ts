import _ from "lodash";
import Point from "../util/point";

const regex = /position=<\s?(-?\d+),\s*(-?\d+)> velocity=<\s?(-?\d+),\s*(-?\d+)>/;

class MovingPoint extends Point {
    private velocity: Point;

    constructor(x: number, y: number, u: number, v: number) {
        super(x, y);
        this.velocity = new Point(u, v);
    }

    public move() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        return this;
    }
}

export class Sky {
    private _points: MovingPoint[] = [];

    constructor(initial: MovingPoint[]) {
        this._points = initial;
    }

    public tick() {
        this._points.forEach(p => p.move());
    }

    public range() {
        const xs = this._points.map(p => p.x);
        const ys = this._points.map(p => p.y);
        const left = _.min(xs);
        const right = _.max(xs);
        const top = _.min(ys);
        const bottom = _.max(ys);
        return [left, top, right, bottom];
    }

    public spread() {
        const range = this.range();
        return new Point(range[2] - range[0], range[3] - range[1]);
    }

    public print() {
        const range = this.range();
        const starChart: string[][] = [];
        for (let i = range[0]; i <= range[2]; ++i) {
            starChart[i - range[0]] = [];
        }
        this._points.forEach(p => starChart[p.x - range[0]][p.y - range[1]] = "#");

        for (let j = range[1]; j <= range[3]; ++j) {
            const builder: string[] = [];
            for (let i = range[0]; i <= range[2]; ++i) {
                builder.push(starChart[i - range[0]][j - range[1]] || ".");
            }
            console.log(builder.join(""));
        }
    }
}

export function buildInitialSky(input: string) {
    const stars = input
        .split(/\r?\n/)
        .map(l => l.match(regex))
        .map(m => new MovingPoint(Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])));
    return new Sky(stars);
}

export function solvePartOne(input: string, maxHeight: number = 16, timeout: number = 10000000) {
    const sky = buildInitialSky(input);

    let time = 0;
    let range = sky.range();
    while ((range[3] - range[1]) > maxHeight && time <= timeout) {
        ++time;
        sky.tick();
        range = sky.range();
        if (time % 1000000 === 0) {
            console.log("time: " + time);
        }
    }

    sky.print();

    return time;
}

export function solvePartTwo(input: string) {
    return 0;
}