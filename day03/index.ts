import _ from "lodash";

const regex = /#\d+ @ (\d+),(\d+): (\d+)x(\d+)/;

class Rect {
    public left: number;
    public top: number;
    public width: number;
    public height: number;

    public constructor(input: string) {
        const match = input.match(regex);
        this.left = Number(match[1]);
        this.top = Number(match[2]);
        this.width = Number(match[3]);
        this.height = Number(match[4]);
    }

    public print() {
        console.log(`${this.left},${this.top}: ${this.width}:${this.height}`);
    }
}

class Grid {
    public inches: number[][] = [];

    public cutRect(rect: Rect) {
        for (let i = rect.width - 1; i >= 0; --i) {
            for (let j = rect.height - 1; j >= 0; --j) {
                this.cutInch(rect.left + i, rect.top + j);
            }
        }
    }

    private cutInch(x: number, y: number) {
        if (!this.inches[x]) {
            this.inches [x]= [];
        }
        const column = this.inches[x];
        if (!column[y]) {
            for (let i = 0; i <= y; ++i) {
                if (!column[i]) {
                    column[i] = 0;
                }
            }
        }
        column[y] += 1;
    }

    public get overlap() {
        return _.sum(this.inches.map(c => _.sum(c.map(i => (i > 1) ? 1 : 0))));
    }
}

export function solvePartOne(input: string) {
    const patches = input.split(/\r?\n/);
    const rects = patches.map(p => new Rect(p));
    const grid = new Grid();
    rects.forEach(r => grid.cutRect(r));

    return grid.overlap;
}

export function solvePartTwo(input: string) {
    return 0;
}