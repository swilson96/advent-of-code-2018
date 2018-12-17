import _ from "lodash";

const initialStateRegex = /initial state: (\S*)/;
const noteRegex = /(\S\S\S\S\S) => (\S)/;

export const stringToNumber = (input: string) => {
    return parseInt(input.replace(/\./g, "0").replace(/#/g, "1").split("").reverse().join(""), 2);
}

export const reverseBits = (input: number, length: number) => {
    let bit = 0;
    let acc = 0;
    while (bit < length) {
        const valueAtThisPoint = (input & (1 << bit)) ? 1 : 0;
        acc += valueAtThisPoint << length - bit - 1;
        ++bit;
    }
    return acc;
}

export class Room {
    private pots: number[] = [];
    private zeroIndex = 0;
    private notes: number[] = [];

    public constructor(initialStringState: string, notes?: number[]) {
        this.pots = initialStringState.split("").map(s => s === "#" ? 1 : 0);
        if (notes) {
            this.notes = notes;
        }
    }

    public stateKeyAtIndex(index: number) {
        const potVal = (potIndex: number) => this.pots[potIndex] || 0;
        return potVal(index - 2) + potVal(index - 1) * 2 + potVal(index) * 4 + potVal(index + 1) * 8 + potVal(index + 2) * 16;
    }

    public evolve() {
        const newPots = [];

        this.zeroIndex += 2;

        newPots.push(this.notes[this.stateKeyAtIndex(-2)]);
        newPots.push(this.notes[this.stateKeyAtIndex(-1)]);

        for (let i = 0; i < this.pots.length; ++i) {
            newPots.push(this.notes[this.stateKeyAtIndex(i)]);
        }

        newPots.push(this.notes[this.stateKeyAtIndex(this.pots.length)]);
        newPots.push(this.notes[this.stateKeyAtIndex(this.pots.length + 1)]);

        this.pots = newPots;

        this.trimPots();
    }

    private trimPots() {
        let trimStart = 0;
        while (this.zeroIndex > trimStart && !this.pots[trimStart]) {
            ++trimStart;
        }

        let trimEnd = 0;
        while (this.zeroIndex <= this.pots.length - trimEnd && !this.pots[this.pots.length - trimEnd]) {
            ++trimEnd;
        }

        this.pots = this.pots.slice(trimStart, this.pots.length - trimEnd + 1);
        this.zeroIndex = this.zeroIndex - trimStart;
    }


    public toString() {
        return this.pots.slice(this.zeroIndex).map(d => d ? "#" : ".").join("");
    }

    public get sum() {
        return this.pots.reduce((acc, p, i) => acc += (p ? i - this.zeroIndex : 0), 0);
    }
}


function evolveManyTimes(input: string, generations: number) {
    const lines = input.split(/\r?\n/);
    const initialState = lines[0].match(initialStateRegex)[1];

    const notes = lines.slice(2).map(l => l.match(noteRegex));
    const map: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    notes.forEach(n => {
        map[stringToNumber(n[1])] = n[2] === "#" ? 1 : 0;
    });

    const room = new Room(initialState, map);

    let time = 0;
    while (time < generations) {
        room.evolve();
        ++time;
        // console.log(`[${time}] ${room}`);
    }

    return room.sum;
}

export function solvePartOne(input: string) {
    return evolveManyTimes(input, 20);
}

export function solvePartTwo(input: string) {
    return evolveManyTimes(input, 50000000000);
}