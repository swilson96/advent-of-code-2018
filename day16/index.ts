import _ from "lodash";

const registerRegex = /\S*:\s*\[(\d*), (\d*), (\d*), (\d*)\]/;

const opsMap: any = {
    "addr": 0,
    "addi": 1,
    "mulr": 2,
    "muli": 3,
    "banr": 4,
    "bani": 5,
    "borr": 6,
    "bori": 7,
    "setr": 8,
    "seti": 9,
    "gtir": 10,
    "gtri": 11,
    "gtrr": 12,
    "eqir": 13,
    "eqri": 14,
    "eqrr": 15,
};

export const operate = (r: number[], opName: string, opArgs: number[]) => {
    return operations[opsMap[opName]](r.slice(), _.concat([0], opArgs));
};

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

export const collectPossibleOpIndices = (sample: string) => {
    const lines = sample.split(/\r?\n/);
    const before = lines[0].match(registerRegex).slice(1).map(s => Number(s));
    const instruction = lines[1].split(" ").map(s => Number(s));
    const after = lines[2].match(registerRegex).slice(1).map(s => Number(s));

    // console.log(`before: ${before}; instruction: ${instruction}; after: ${after}`);

    return operations
        .map((op, opIndex) => {
            const resultOfOp = op(before.slice(), instruction);
            // console.log(`before: ${before}; result: ${resultOfOp}; expected: ${after}, match: ${resultOfOp === after}`);
            const isPossible = resultOfOp.reduce((acc, val, index) => acc && (val === after[index]), true);
            return { opIndex, isPossible, opCode: instruction[0] };
        })
        .filter(o => o.isPossible);
};

export const countPossibleOps = (sample: string) => {
    return collectPossibleOpIndices(sample).length;
};

export const getOpCodePairings = (input: string) => {
    const samples = input.split(/\r?\n\r?\n/);
    const possibilities = samples
        .map(collectPossibleOpIndices)
        .map(samplePossibilities => ({
            opCode: samplePossibilities[0].opCode,
            possibilities: samplePossibilities.map(sp => sp.opIndex),
        }));
    const groups = _.groupBy(possibilities, ps => ps.opCode);

    const map: any = {};
    const intersectedPossibilities: any = {};
    const opCodes = Object.keys(groups);
    opCodes.forEach(opCode => {
        const possibilityGroups = groups[opCode];
        const possibleOpIndices = _.intersection(...possibilityGroups.map(pg => pg.possibilities));
        intersectedPossibilities[opCode] = possibleOpIndices;
    });

    const trim = () => {
        opCodes.forEach(opCode => {
            if (intersectedPossibilities[opCode].length === 1) {
                map[opCode] = intersectedPossibilities[opCode][0];
                opCodes.forEach(innerOpCode => {
                    if (innerOpCode === opCode) {
                        return;
                    }
                    intersectedPossibilities[innerOpCode] = intersectedPossibilities[innerOpCode].filter((i: number) => i != map[opCode]);
                });
            }
        });
    };

    trim();
    trim();
    trim();
    trim();
    trim();
    trim();
    trim();
    trim();

    return map;
};

export function solvePartOne(input: string[]) {
    const blocks = input[0].split(/\r?\n\r?\n/);
    return blocks.map(countPossibleOps).filter(c => c >= 3).length;
}

export function solvePartTwo(input: string[]) {
    const map = getOpCodePairings(input[0]);

    console.log(map);

    const instructions = input[1].split(/\r?\n/).map(line => line.match(/(\d*) (\d*) (\d*) (\d*)/).slice(1).map(s => Number(s)));
    let register = [0, 0, 0, 0];
    instructions.forEach(i => {
        register = operations[map[i[0]]](register, i);
    });
    return register[0];
}