import _ from "lodash";

class Point {
    public x: number;
    public y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public distanceFrom(x: number, y: number) {
        return Math.abs(x - this.x) + Math.abs(y - this.y);
    }
}

class Relationship {
    public label: any;
    public distance: number;

    constructor (label: any, d: number) {
        this.label = label;
        this.distance = d;
    }
}

export class Position {
    private distances: Relationship[] = [];

    public add(label: any, distance: number) {
        this.distances.push(new Relationship(label, distance));
    }

    public get closest() {
        const sorted = _.sortBy(this.distances, d => d.distance);
        if (sorted[0].distance === sorted[1].distance) {
            return null;
        }
        return sorted[0].label;
    }
};

class Grid {
    private width: number;
    private height: number;

    private grid: Position[][] = [];

    private labels: any[] = [];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        for(let i = 0; i < this.width; ++i) {
            this.grid[i] = [];
            for(let j = 0; j < this.height; ++j) {
                this.grid[i][j] = new Position();
            }
        }
    }

    public addLayer(label: any, target: Point) {
        this.labels.push(label);
        for(let i = 0; i < this.width; ++i) {
            for(let j = 0; j < this.height; ++j) {
                this.grid[i][j].add(label, target.distanceFrom(i, j));
            }
        }
    }

    // Assume an area that touches the boundary is infinite
    private get infiniteAreas() {
        const ret: any[] = [];
        for(let i = 0; i < this.width; ++i) {
            ret.push(this.grid[i][0].closest);
            ret.push(this.grid[i][this.height - 1].closest);
        }

        for(let j = 0; j < this.height; ++j) {
            ret.push(this.grid[0][j].closest);
            ret.push(this.grid[this.width - 1][j].closest);
        }
        return ret;
    }

    public get largestAreaSize() {
        const areas: any = {};
        for(let i = 0; i < this.width; ++i) {
            for(let j = 0; j < this.height; ++j) {
                const nearest = this.grid[i][j].closest;
                if (nearest) {
                    if (!areas[nearest]) {
                        areas[nearest] = 1;
                    } else {
                        areas[nearest] += 1;
                    }
                }
            }
        }

        const finiteAreas = _.difference(this.labels, this.infiniteAreas);

        // console.log("finiteAreas: " + finiteAreas);
        // console.log("sizes:     : " + finiteAreas.map(a => areas[a]));

        return Math.max(...finiteAreas.map(k => areas[k]));
    }

    public printSize() {
        console.log(`size: (${this.width}, ${this.height}), area: ${this.width * this.height}`);
    }

    public print() {
        for(let i = 0; i < this.width; ++i) {
            console.log("" + this.grid[i].slice(0,50).map(p => {
                if (!p.closest && p.closest !== 0) {
                    return " ."
                }
                return p.closest < 10 ? `0${p.closest}` : p.closest.toString();
            }));
        }
    }
}

export function solvePartOne(input: string) {
    const targets = input.split(/\r?\n/).map(l => l.split(", ").map(n => Number(n))).map(a => new Point(a[0], a[1]));
    const width = Math.max(...targets.map(p => p.x)) + 1;
    const height = Math.max(...targets.map(p => p.y)) + 1;
    const grid = new Grid(width, height);
    let index = 0;
    targets.forEach(t => grid.addLayer(index++, t));

    // grid.printSize();
    // grid.print();
    return grid.largestAreaSize;
}

export function solvePartTwo(input: string) {
    return 0;
}