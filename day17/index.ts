import _ from "lodash";
import Point from "../util/point";

export class Ground {
    private xMin = 0;
    private xMax = 0;
    private yMin = 0;
    private yMax = 0;

    private map: string[][] = [];
    private nextMap: string[][] = [];

    private endsOfSpouts = [new Point(500, 0)];

    constructor(input: string) {
        const data = input.split(/\r?\n/).map(l => this.parseLine(l));

        this.xMin = _.min(data.map(d => d.xRange[0])) - 1;
        this.xMax = _.max(data.map(d => d.xRange[1])) + 1;

        this.yMin = _.min(data.map(d => d.yRange[0]));
        this.yMax = _.max(data.map(d => d.yRange[1]));

        for (let y = 0; y <= this.yMax; ++y) {
            this.map[y] = [];
            for (let x = this.xMin; x <= this.xMax; ++x) {
                this.map[y][x] = ".";
            }
        }

        this.map[0][500] = "+";

        data.forEach(d => {
            for (let y = d.yRange[0]; y <= d.yRange[1]; ++y) {
                for (let x = d.xRange[0]; x <= d.xRange[1]; ++x) {
                    this.map[y][x] = "#";
                }
            }
        });
    }

    private parseLine(line: string) {
        const chunks = line.split(", ");
        let xRange = [];
        let yRange = [];
        if (chunks[0][0] === "x") {
            xRange.push(Number(chunks[0].split("=")[1]));
            xRange.push(Number(chunks[0].split("=")[1]));
            yRange = chunks[1].split("=")[1].split("..").map(s => Number(s));
        } else {
            yRange.push(Number(chunks[0].split("=")[1]));
            yRange.push(Number(chunks[0].split("=")[1]));
            xRange = chunks[1].split("=")[1].split("..").map(s => Number(s));
        }

        return { xRange, yRange };
    }

    public get bounds() {
        return [this.xMin, this.yMin, this.xMax, this.yMax];
    }

    private get copyMap() {
        return this.map.map(row => row.slice());
    }

    private placeVerticalFlow(nextPoint: Point) {
        // Go all the way down to water or the bottom.
        // If EITHER, check whether we got there first, if not stop.
        this.nextMap[nextPoint.y][nextPoint.x] = "|";
        let nextTarget = this.map[nextPoint.y + 1] ? this.map[nextPoint.y + 1][nextPoint.x] : undefined;

        while (nextTarget === ".") {
            nextPoint = new Point(nextPoint.x, nextPoint.y + 1);
            this.nextMap[nextPoint.y][nextPoint.x] = "|";
            nextTarget = this.map[nextPoint.y + 1] ? this.map[nextPoint.y + 1][nextPoint.x] : undefined;
        }

        if (nextTarget === "|") {
            // Hit something that is already full
            return [];
        }

        if (nextTarget) {
            // Already full? Check whether this water is overflowing yet
            let didSeeOtherFlow = false;

            // go left
            let i = 1;
            let left = this.map[nextPoint.y][nextPoint.x - i];
            let belowLeft = this.map[nextPoint.y + 1][nextPoint.x - i];
            while ((belowLeft === "~" || belowLeft === "#") && left !== "#") {
                if (left === "|") {
                    didSeeOtherFlow = true;
                }
                ++i;
                left = this.map[nextPoint.y][nextPoint.x - i];
                belowLeft = this.map[nextPoint.y + 1][nextPoint.x - i];
            }

            // go right
            let j = 1;
            let right = this.map[nextPoint.y][nextPoint.x + j];
            let belowRight = this.map[nextPoint.y + 1][nextPoint.x + j];
            while ((belowRight === "~" || belowRight === "#") && right !== "#") {
                if (right === "|") {
                    didSeeOtherFlow = true;
                }
                ++j;
                right = this.map[nextPoint.y][nextPoint.x + j];
                belowRight = this.map[nextPoint.y + 1][nextPoint.x + j];
            }

            if (belowRight === "|" || belowLeft === "|") {
                // The next layer is already overflowing, we can stop.
                // console.log(`${nextPoint} hit existing water and thinks it is already overflowing`);
                return [];
            }

            if (didSeeOtherFlow) {
                // Another stream is already filling the next layer as we speak
                // We need to coordinate with it, since it isn't full
                // console.log(`${nextPoint} hit existing water and will coordinate with existing stream`);
                this.nextMap[nextPoint.y][nextPoint.x] = "~";
                return [new Point(nextPoint.x, nextPoint.y - 1)];
            }

            // We can continue to fill up, while nothing else is.
            // console.log(`${nextPoint} hit existing water and needs to fill it up`);
            return [nextPoint];
        }
        return [];
    }

    private fillLayer(e: Point) {
        const nextDrops: Point[] = [];
        let finish = false;

        // Assume hit something, fill up
        this.nextMap[e.y][e.x] = "~";

        // go left
        let i = 1;
        let left = this.map[e.y][e.x - i];
        let belowLeft = this.map[e.y + 1][e.x - i];
        while (left && left !== "#" && belowLeft !== "." && belowLeft !== "|") {
            this.nextMap[e.y][e.x - i] = "~";

            ++i;

            left = this.map[e.y][e.x - i];
            belowLeft = this.map[e.y + 1][e.x - i];
        }

        if (belowLeft === ".") {
            // finish here even if the drop-off hits a full bucket and stops
            finish = true;

            const edge = new Point(e.x - i, e.y);
            // console.log(`${edge} is dropping off a cliff`);
            const endsOfDrop = this.placeVerticalFlow(edge);
            // console.log(`${edge} has dropped all the way to: ${endsOfDrop}`);
            endsOfDrop.forEach(newEnd => {
                nextDrops.push(newEnd);
            });
            // console.log(`so current new ends are: ${nextDrops}`);
        }

        if (left === "|" && belowLeft === "|") {
            // This is the top layer, but the other side might have overflowed.
            finish = true;
        }

        // go right
        let j = 1;
        let right = this.map[e.y][e.x + j];
        let belowRight = this.map[e.y + 1][e.x + j];
        while (right && right !== "#" && belowRight !== "." && belowRight !== "|") {
            this.nextMap[e.y][e.x + j] = "~";

            ++j;

            right = this.map[e.y][e.x + j];
            belowRight = this.map[e.y + 1][e.x + j];
        }

        if (belowRight === ".") {
            // finish here even if the drop-off hits a full bucket and stops
            finish = true;

            const edge = new Point(e.x + j, e.y);
            // console.log(`${edge} is dropping off a cliff`);
            const endsOfDrop = this.placeVerticalFlow(edge);
            // console.log(`${edge} has dropped all the way to: ${endsOfDrop}`);
            endsOfDrop.forEach(newEnd => {
                nextDrops.push(newEnd);
            });
            // console.log(`so current new ends are: ${nextDrops}`);
        }

        if (right === "|" && belowRight === "|") {
            // This is the top layer, but the other side might have overflowed.
            finish = true;
        }

        // Identify the width of this layer of water
        // go left
        i = 1;
        left = this.map[e.y][e.x - i];
        while (left === "~") {
            ++i;
            left = this.map[e.y][e.x - i];
        }

        // go right
        j = 1;
        right = this.map[e.y][e.x + j];
        while (right === "~") {
            ++j;
            right = this.map[e.y][e.x + j];
        }

        if (nextDrops.length || finish) {
            return nextDrops;
        }

        const upOne = new Point(e.x, e.y - 1);

        if (this.map[upOne.y][upOne.x] === "|") {
            return [upOne];
        }

        // Search above this layer of water
        for (let k = 1 - i; k < j; ++k) {
            const upperThing = this.map[e.y - 1][e.x + k];
            if (upperThing === "|") {
                nextDrops.push(new Point(e.x + k, e.y - 1));
            }
        }

        return nextDrops;
    }

    public pourOnWater(time: number) {
        this.nextMap = this.copyMap;
        const newEnds = _.flatMap(this.endsOfSpouts, e => {
            const currentEnd = this.map[e.y][e.x];
            if (currentEnd === "|" || currentEnd === "+") {
                const nextPoint = new Point(e.x, e.y + 1);
                if (!this.map[nextPoint.y]) {
                    return [];
                }
                const target = this.map[nextPoint.y][nextPoint.x];
                if (target === "|") {
                    // console.log(`${e}: Already followed this path, terminating.`);
                    return [];
                }
                if (target === ".") {
                    return this.placeVerticalFlow(nextPoint);
                } else {
                    const ends = this.fillLayer(e);
                    return ends;
                }
            }

            // console.log(`Reached an end ${currentEnd} at time ${time}: ${e}`);
            return [];
        });

        this.endsOfSpouts = _.uniq(newEnds.map(p => p.toString())).map(Point.fromString);

        this.map = this.nextMap;
    }

    public classifyStable() {
        this.nextMap = this.copyMap;

        this.endsOfSpouts = [new Point(500, 0)];

        while (this.endsOfSpouts.length) {
            const newEnds = _.flatMap(this.endsOfSpouts, e => {
                const currentEnd = this.map[e.y][e.x];
                if (currentEnd === "|" || currentEnd === "+") {
                    const nextPoint = new Point(e.x, e.y + 1);
                    if (!this.map[nextPoint.y]) {
                        return [];
                    }
                    const target = this.map[nextPoint.y][nextPoint.x];
                    if (target === "|") {
                        return [nextPoint];
                    }
                    if (target === "~") {
                        this.nextMap[nextPoint.y][nextPoint.x] = "|";

                        // Identify the width of this layer of water
                        // go left
                        let i = 1;
                        let left = this.map[nextPoint.y][nextPoint.x - i];
                        while (left === "~") {
                            this.nextMap[nextPoint.y][nextPoint.x - i] = "|";
                            ++i;
                            left = this.map[nextPoint.y][nextPoint.x - i];
                        }

                        // go right
                        let j = 1;
                        let right = this.map[nextPoint.y][nextPoint.x + j];
                        while (right === "~") {
                            this.nextMap[nextPoint.y][nextPoint.x + j] = "|";
                            ++j;
                            right = this.map[nextPoint.y][nextPoint.x + j];
                        }

                        const ends = [];
                        if (right === "|") {
                            ends.push(new Point(nextPoint.x + j, nextPoint.y));
                        }

                        if (left === "|") {
                            ends.push(new Point(nextPoint.x - i, nextPoint.y));
                        }

                        return ends;
                    }
                }

                // console.log(`Reached an end ${currentEnd} at time ${time}: ${e}`);
                return [];
            });
            this.endsOfSpouts = _.uniq(newEnds.map(p => p.toString())).map(Point.fromString);
        }

        this.map = this.nextMap;
    }

    public printout() {
        for (let y = 0; y <= _.min([600, this.yMax]); ++y) {
            console.log(`${("   " + y).slice(-4)}: ${this.map[y].join("")}`);
        }
        console.log(this.endsOfSpouts);
    }

    public printSums() {
        console.log(`Total water: ${this.sum}, of which is trapped: ${this.sumStableWater}`);
    }

    public get sum() {
        let sum = 0;
        for (let y = this.yMin; y <= this.yMax; ++y) {
            sum += this.map[y].reduce((acc, tile) => (tile === "~" || tile === "|") ? acc + 1 : acc, 0);
        }
        return sum;
    }

    public get sumStableWater() {
        let sum = 0;
        for (let y = this.yMin; y <= this.yMax; ++y) {
            sum += this.map[y].reduce((acc, tile) => tile === "~" ? acc + 1 : acc, 0);
        }
        return sum;
    }

    public pourUntilStable() {
        const timeout = 1250;
        let time = 0;
        while (this.endsOfSpouts.length && time < timeout) {
            this.pourOnWater(time);
            if (time % 100 === 0) {
                console.log(`tick! ${time}, current ends: ${this.endsOfSpouts.length}`);
            }
            ++time;
        }

        if (time === timeout) {
            console.log("Timeout!");
        }

        this.classifyStable();
    }
}

export function solvePartOne(input: string) {
    const ground = new Ground(input);

    // ground.printout();

    ground.pourUntilStable();

    // ground.printout();

    ground.printSums();

    return ground.sum;
}

export function solvePartTwo(input: string) {
    const ground = new Ground(input);

    ground.pourUntilStable();

    ground.printSums();

    return ground.sumStableWater;
}