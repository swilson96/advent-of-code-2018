import _ from "lodash";
import { operate } from "../day16";

export function solvePartOne(input: string) {
    const lines = input.split(/\r?\n/);
    const instructions = lines.slice(1).map(l => {
        const bits = l.match(/(\S*) (\d*) (\d*) (\d*)/);
        const opName = bits[1];
        const opArgs = bits.slice(2).map(a => Number(a));
        return { opName, opArgs };
    });
    let register = [0, 0, 0, 0, 0 ,0];
    const ipAddress = Number(lines[0].split(/\s/)[1]);
    let ipVal = 0;

    let clockTime = 0;
    const timeout = 10000000;
    while (0 <= ipVal && ipVal < instructions.length && clockTime < timeout) {
        register[ipAddress] = ipVal;
        const i = instructions[ipVal];
        const newRegister = operate(register, i.opName, i.opArgs);

        // console.log(`#ip=${ipVal} [${register}] ${i} [${newRegister}]`);

        ipVal = newRegister[ipAddress];
        ++ipVal;
        register = newRegister;
        ++clockTime;
    }

    if (clockTime === timeout) {
        console.log("TIMEOUT!");
    }

    return register[0];
}

export function solvePartTwo(input: string) {
    return 0;
}