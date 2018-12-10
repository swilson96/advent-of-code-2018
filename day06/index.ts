import _ from "lodash";
import Point from "../util/point";

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
            return undefined;
        }
        return sorted[0].label;
    }

    public get totalDistance() {
        return _.sum(this.distances.map(r => r.distance));
    }
}

class Grid {
    private width: number;
    private height: number;

    private grid: Position[][] = [];

    private labels: any[] = [];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        for (let i = 0; i < this.width; ++i) {
            this.grid[i] = [];
            for (let j = 0; j < this.height; ++j) {
                this.grid[i][j] = new Position();
            }
        }
    }

    public addLayer(label: any, target: Point) {
        this.labels.push(label);
        for (let i = 0; i < this.width; ++i) {
            for (let j = 0; j < this.height; ++j) {
                this.grid[i][j].add(label, target.distanceFrom(i, j));
            }
        }
    }

    // Assume an area that touches the boundary is infinite
    private get infiniteAreas() {
        const ret: any[] = [];
        for (let i = 0; i < this.width; ++i) {
            ret.push(this.grid[i][0].closest);
            ret.push(this.grid[i][this.height - 1].closest);
        }

        for (let j = 0; j < this.height; ++j) {
            ret.push(this.grid[0][j].closest);
            ret.push(this.grid[this.width - 1][j].closest);
        }
        return ret;
    }

    public get largestAreaSize() {
        const areas: any = {};
        for (let i = 0; i < this.width; ++i) {
            for (let j = 0; j < this.height; ++j) {
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

    public pointsUnderGivenTotalDistance(totalDistance: number) {
        const points: Point[] = [];
        for (let i = 0; i < this.width; ++i) {
            for (let j = 0; j < this.height; ++j) {
                const dist = this.grid[i][j].totalDistance;
                if (dist < totalDistance) {
                    points.push(new Point(i, j));
                }
            }
        }

        return points;
    }

    public printSize() {
        console.log(`size: (${this.width}, ${this.height}), area: ${this.width * this.height}`);
    }

    public print() {
        for (let i = 0; i < this.width; ++i) {
            console.log("" + this.grid[i].slice(0, 50).map(p => {
                if (!p.closest && p.closest !== 0) {
                    return " .";
                }
                return p.closest < 10 ? `0${p.closest}` : p.closest.toString();
            }));
        }
    }
}

export function solvePartOne(input: string) {
    const grid = generateGrid(input);

    // grid.printSize();
    // grid.print();
    return grid.largestAreaSize;
}

function generateGrid(input: string) {
    const targets = input.split(/\r?\n/).map(l => l.split(", ").map(n => Number(n))).map(a => new Point(a[0], a[1]));
    const width = Math.max(...targets.map(p => p.x)) + 1;
    const height = Math.max(...targets.map(p => p.y)) + 1;
    const grid = new Grid(width, height);
    let index = 0;
    targets.forEach(t => grid.addLayer(index++, t));
    return grid;
}

export function solvePartTwo(input: string, distance: number = 10000) {
    const grid = generateGrid(input);

    const points = grid.pointsUnderGivenTotalDistance(distance);
    return points.length;

    // const regionSizes: number[] = [];
    // while(points.length > 0) {
    //     const region = [points[0]];
    //     points = points.slice(1);

    //     let changed = true;
    //     while (changed) {
    //         changed = false;
    //         points.forEach(p => {
    //             const closest = Math.min(...region.map(p1 => p1.distanceFrom(p.x, p.y)));
    //             if (closest <= 1) {
    //                 region.push(p);
    //                 changed = true;
    //             }
    //         });
    //         points = _.difference(points, region);
    //     }
    //     regionSizes.push(region.length);
    // }

    // console.log("region sizes: " + regionSizes);

    // return Math.max(...regionSizes);
}