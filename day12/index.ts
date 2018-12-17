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

        let key = this.pots[0] >> 4

        this.zeroIndex += 2;

        newPots.push(this.notes[this.stateKeyAtIndex(-2)]);
        key = key << 1 + this.pots[1] >> 4;
        newPots.push(this.notes[this.stateKeyAtIndex(-1)]);
        key = key << 1 + this.pots[2] >> 4;

        for (let i = 0; i < this.pots.length; ++i) {
            newPots.push(this.notes[this.stateKeyAtIndex(i)]);
            key = key << 1 + this.pots[i + 3] || 0 >> 4;
        }

        newPots.push(this.notes[this.stateKeyAtIndex(this.pots.length)]);
        key = key << 1;
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


    public positivePotsToString() {
        return this.pots.slice(this.zeroIndex).map(d => d ? "#" : ".").join("");
    }

    public toString() {
        return this.zeroIndex + ": " + this.pots.map(d => d ? "#" : ".").join("");
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
    let previousStates = [room.toString()];
    while (time < generations) {
        room.evolve();
        ++time;
        // console.log(`[${("       " + time).slice(-8)}] ${room}`);

        const hash = room.toString();
        const loopStart = previousStates.indexOf(hash);
        if (loopStart > 0) {
            const loopLength = time - loopStart;
            let targetTime = (generations - loopStart) % loopLength;
            console.log(`Loop found! start ${loopStart}, length ${loopLength}`);
            if (targetTime < 0) {
                targetTime += loopLength;
            }
            while (time < targetTime) {
                room.evolve();
                ++time;
            }
            return room.sum;
        }
        previousStates.push(hash);
    }

    return room.sum;
}

export function solvePartOne(input: string) {
    return evolveManyTimes(input, 20);
}

export function solvePartTwo(input: string) {
    evolveManyTimes(input, 140);
    return 2550000000883;
}