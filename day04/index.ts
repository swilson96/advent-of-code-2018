import _ from "lodash";

class DatedRow {
    private regex = /\[(.*)\] (.+)/;
    public date: string;
    public text: string;

    public constructor(input: string) {
        const match = input.match(this.regex);
        this.date = match[1];
        this.text = match[2];
    }
}

class ShiftInfo {
    private static idRegex = /Guard #(\d*) begins shift/;
    private minuteRegex = /\d\d\d\d-\d\d-\d\d \d\d:(\d\d)/;

    public id: number;
    public fall: number;
    public wake: number;

    public constructor(id: number, falls: string, wakes: string) {
        this.id = id;
        this.fall = Number(falls.match(this.minuteRegex)[1]);
        this.wake = Number(wakes.match(this.minuteRegex)[1]);
    }

    public print() {
        console.log(`Guard ${this.id}: ${this.fall}-${this.wake}`);
    }

    public static convert(begins: string, sleeps: string[]) {
        const idMatch = begins.match(this.idRegex);
        const id = Number(idMatch[1]);
        
        const result: ShiftInfo[] = [];

        for (let i = 0; i < sleeps.length; i += 2) {
            result.push(new ShiftInfo(id, sleeps[i], sleeps[i + 1]));
        }

        return result;
    }
}

class CombinedGuardInfo {
    public minutes: number[] = [];
    public id: number;

    constructor(shifts: ShiftInfo[]) {
        for (let i = 0; i < 60; ++i) {
            this.minutes[i] = 0;
        }
        shifts.forEach(shift => {
            for (let i = shift.fall; i < shift.wake; ++i) {
                this.minutes[i] += 1;
            }
        })
        this.id = shifts[0].id;
    }

    public get totalMinsSlept() {
        return _.sum(this.minutes);
    }

    public get mostSleptMin() {
        return this.minutes.indexOf(Math.max(...this.minutes));
    }
}

export function solvePartOne(input: string) {
    const lines = input.split(/\r?\n/).map(l => new DatedRow(l));

    const orderedLines = _.sortBy(lines, l => l.date);

    const shiftInfo: ShiftInfo[] = [];
    let i = 0;
    while (i < orderedLines.length) {
        const sectionStart = i;
        ++i;
        while (orderedLines[i] && !orderedLines[i].text.startsWith("Guard")) {
            ++i;
        }
        // console.log(`section: ${sectionStart},${i}`);
        const shifts = ShiftInfo.convert(orderedLines[sectionStart].text, orderedLines.slice(sectionStart + 1, i).map(dr => dr.date));
        shifts.forEach(s => shiftInfo.push(s));
    }

    const guardIds = _.uniqBy(shiftInfo.map(i => i.id), id => id);
    const guardInfo = guardIds.map(id => new CombinedGuardInfo(shiftInfo.filter(s => s.id === id)))

    const sleepyHead = guardInfo.sort((g, h) => h.totalMinsSlept - g.totalMinsSlept)[0];

    console.log(`Guard #${sleepyHead.id} slept for ${sleepyHead.totalMinsSlept} minutes, mostly at ${sleepyHead.mostSleptMin}`);
    return sleepyHead.id * sleepyHead.mostSleptMin;
}

export function solvePartTwo(input: string) {
    return 0;
}