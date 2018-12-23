import _ from "lodash";
import { operate, opsMap, operations } from "../day16";

function solveForRegister(input: string, initialRegister: number[]) {
    const lines = input.split(/\r?\n/);
    const instructions = lines.slice(1).map(l => {
        const bits = l.match(/(\S*) (\d*) (\d*) (\d*)/);
        const opName = bits[1];
        const originalOp = operations[opsMap[opName]];
        const opArgs = bits.slice(2).map(a => Number(a));
        const modifiedOpArgs = _.concat([0], opArgs);
        const operation = (r: number[]) => originalOp(r, modifiedOpArgs);
        return { opName, opArgs, operation, asString: l };
    });
    let register = initialRegister;
    const ipAddress = Number(lines[0].split(/\s/)[1]);
    let ipVal = initialRegister[ipAddress];

    let clockTime = 0;
    const timeout = 1000000000;
    while (0 <= ipVal && ipVal < instructions.length && clockTime < timeout) {
        register[ipAddress] = ipVal;

        const oldReg = register.slice();

        const i = instructions[ipVal];
        register = i.operation(register);

        if (clockTime % 1000000 == 1) {
            // console.log(`${("        " + clockTime).slice(-8)} #ip=${ipVal} [${oldReg}] ${i.asString} [${register}]`);
        }

        ipVal = register[ipAddress];
        ++ipVal;
        ++clockTime;
    }

    if (clockTime === timeout) {
        console.log("TIMEOUT!");
    }

    return register[0];
}

export function solvePartOne(input: string) {
    return solveForRegister(input, [0, 0, 0, 0, 0, 0]);
}

export function solvePartTwo(input: string) {
    return solveForRegister(input, [1, 0, 0, 0, 0, 0]);
}