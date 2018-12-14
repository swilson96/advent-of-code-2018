import _ from "lodash";

const initialStateRegex = /initial state: (\S*)/;
const noteRegex = /(\S\S\S\S\S) => (\S)/;

export default class Pot {
    private _value: boolean;
    private _next: Pot;
    private _previous: Pot;

    constructor(value: string, next?: Pot, previous?: Pot) {
        this._value = value === "#";
        this._next = next;
        this._previous = previous;
    }

    public setNext(newNext: Pot) {
        this._next = newNext;
    }

    public setPrevious(newPrev: Pot) {
        this._previous = newPrev;
    }

    public get next(): Pot {
        return this._next;
    }

    public get previous(): Pot {
        return this._previous;
    }

    public get value() {
        return this._value;
    }

    public get sumAsZero(): number {
        return (this.previous ? this.previous.sumBack(-1) : 0) + (this.next ? this.next.sumForward(1) : 0)
    }

    protected sumBack(index: number): number {
        return (this.value ? index : 0) + (this.previous ? this.previous.sumBack(index - 1) : 0);
    }

    protected sumForward(index: number): number {
        return (this.value ? index : 0) + (this.next ? this.next.sumForward(index + 1) : 0);
    }

    public toString() {
        return this.value ? "#" : ".";
    }

    public get neighbours() {
        const back = this.previous ? `${this.previous.previous || "."}${this.previous}` : "..";
        const front = this.next ? `${this.next}${this.next.next || "."}` : ".."
        return `${back}${this}${front}`;
    }

    public get previousNeighbours() {
        // Warning: not robust
        return `...${this}${this.next}`;
    }

    public get nextNeighbours() {
        return `${this.previous}${this}...`;
    }

    public get toStringOnwardsChain() {
        let next: Pot = this;
        const acc: string[] = [];
        while (next) {
            acc.push(next.toString());
            next = next.next;
        }
        return acc.join("");
    }

    public printOnwardsChain() {
        console.log(this.toStringOnwardsChain);
    }
}

const generateInitialPots = (initialState: string) => {
    const zeroPot = new Pot(initialState[0]);
    let lastPot = zeroPot;
    for (let i = 1; i < initialState.length; ++i) {
        lastPot.setNext(new Pot(initialState[i]));
        lastPot.next.setPrevious(lastPot);
        lastPot = lastPot.next;
    }

    return zeroPot;
}

const evolveChain = (notes: any, zeroPot: Pot) => {
    const newZeroPot = new Pot(notes[zeroPot.neighbours]);

    let previous = zeroPot.previous;
    let previousButOne = zeroPot;
    let current = newZeroPot;
    while (previous) {
        current.setPrevious(new Pot(notes[previous.neighbours]));
        current.previous.setNext(current);
        current = current.previous;
        previousButOne = previous;
        previous = previous.previous;
    }

    if (notes[previousButOne.previousNeighbours] === "#") {
        current.setPrevious(new Pot("#"));
        current.previous.setNext(current);
        current = current.previous;
    }

    let next = zeroPot.next;
    let nextButOne = zeroPot;
    current = newZeroPot;
    while (next) {
        current.setNext(new Pot(notes[next.neighbours]));
        current.next.setPrevious(current);
        current = current.next;
        nextButOne = next;
        next = next.next;
    }

    if (notes[nextButOne.nextNeighbours] === "#") {
        current.setNext(new Pot("#"));
        current.next.setPrevious(current);
        current = current.next;
    }

    return newZeroPot;
}


function evolveManyTimes(input: string, generations: number) {
    const lines = input.split(/\r?\n/);
    const initialState = lines[0].match(initialStateRegex)[1];

    const notes = lines.slice(2).map(l => l.match(noteRegex));
    const map: any = {};
    notes.forEach(n => {
        map[n[1]] = n[2];
    });

    let zeroPot = generateInitialPots(initialState);

    let time = 0;

    let previousSums = [zeroPot.sumAsZero];
    let previousHashes = [zeroPot.toStringOnwardsChain];
    // zeroPot.printOnwardsChain();

    while (time < generations) {
        ++time;
        zeroPot = evolveChain(map, zeroPot);

        if (time % 5000000 === 0) {
            console.log(`time: ${time}`);
        }

        const current = zeroPot.toStringOnwardsChain;
        // zeroPot.printOnwardsChain();

        const lastTime = previousHashes.indexOf(current);

        if (lastTime > -1) {
            console.log("periodic!");
            console.log(lastTime);

            const period = time - lastTime;
            let finish = (generations - lastTime) % period;
            if (finish < 0) {
                finish += period;
            }
            return previousSums[lastTime + finish];
        }

        previousSums.push(zeroPot.sumAsZero);
        previousHashes.push(current);
    }

    return zeroPot.sumAsZero;
}

export function solvePartOne(input: string) {
    return evolveManyTimes(input, 20);
}

export function solvePartTwo(input: string) {
    return evolveManyTimes(input, 50000000000);
}