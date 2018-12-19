import _ from "lodash";

const registerRegex = /\S*:\s*\[(\d*), (\d*), (\d*), (\d*)\]/;

const operations = [
    // addr (add register) stores into register C the result of adding register A and register B.
    (r: number[], i: number[]) => {
        r[i[3]] = r[i[1]] + r[i[2]];
        return r;
    },
    // addi (add immediate) stores into register C the result of adding register A and value B.
    (r: number[], i: number[]) => {
        r[i[3]] = r[i[1]] + i[2];
        return r;
    },
    // mulr (multiply register) stores into register C the result of multiplying register A and register B.
    (r: number[], i: number[]) => {
        r[i[3]] = r[i[1]] * r[i[2]];
        return r;
    },
    // muli (multiply immediate) stores into register C the result of multiplying register A and value B.
    (r: number[], i: number[]) => {
        r[i[3]] = r[i[1]] * i[2];
        return r;
    },
    // banr (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.
    (r: number[], i: number[]) => {
        r[i[3]] = r[i[1]] & r[i[2]];
        return r;
    },
    // bani (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B.
    (r: number[], i: number[]) => {
        r[i[3]] = r[i[1]] & i[2];
        return r;
    },
    // Bitwise OR:

    // borr (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B.
    (r: number[], i: number[]) => {
        r[i[3]] = r[i[1]] | r[i[2]];
        return r;
    },
    // bori (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B.
    (r: number[], i: number[]) => {
        r[i[3]] = r[i[1]] | i[2];
        return r;
    },
    // setr (set register) copies the contents of register A into register C. (Input B is ignored.)
    (r: number[], i: number[]) => {
        r[i[3]] = r[i[1]];
        return r;
    },
    // seti (set immediate) stores value A into register C. (Input B is ignored.)
    (r: number[], i: number[]) => {
        r[i[3]] = i[1];
        return r;
    },
    // gtir (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0.
    (r: number[], i: number[]) => {
        r[i[3]] = i[1] > r[i[2]] ? 1 : 0;
        return r;
    },
    // gtri (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0.
    (r: number[], i: number[]) => {
        r[i[3]] = r[i[1]] > i[2] ? 1 : 0;
        return r;
    },
    // gtrr (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0.
    (r: number[], i: number[]) => {
        r[i[3]] = r[i[1]] > r[i[2]] ? 1 : 0;
        return r;
    },
    // eqir (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0.
    (r: number[], i: number[]) => {
        r[i[3]] = i[1] === r[i[2]] ? 1 : 0;
        return r;
    },
    // eqri (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0.
    (r: number[], i: number[]) => {
        r[i[3]] = r[i[1]] === i[2] ? 1 : 0;
        return r;
    },
    // eqrr (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0.
    (r: number[], i: number[]) => {
        r[i[3]] = r[i[1]] === r[i[2]] ? 1 : 0;
        return r;
    },
];

export const countPossibleOpCodes = (input: string) => {
    const lines = input.split(/\r?\n/);
    const before = lines[0].match(registerRegex).slice(1).map(s => Number(s));
    const instruction = lines[1].split(" ").map(s => Number(s));
    const after = lines[2].match(registerRegex).slice(1).map(s => Number(s));

    // console.log(`before: ${before}; instruction: ${instruction}; after: ${after}`);

    return operations.filter(op => {
        const resultOfOp = op(before.slice(), instruction);
        // console.log(`before: ${before}; result: ${resultOfOp}; expected: ${after}, match: ${resultOfOp === after}`);
        return resultOfOp.reduce((acc, val, index) => acc && (val === after[index]), true);
    }).length;
};

export function solvePartOne(input: string[]) {
    const blocks = input[0].split(/\r?\n\r?\n/);
    return blocks.map(countPossibleOpCodes).filter(c => c >= 3).length;
}

export function solvePartTwo(input: string[]) {
    return 0;
}