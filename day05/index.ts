import _ from "lodash";

const shrink = (input: string) => {
    for (let i = 0; i < input.length - 1; ++i) {
        if (input[i].toLowerCase() === input[i + 1].toLowerCase() && input[i] !== input[i + 1]) {
            return input.slice(0, i) + input.slice(i + 2);
        }
    }
    return input;
};

export function solvePartOne(input: string) {
    let changed = true;
    let polymer = input;
    while (changed) {
        const prev = polymer;
        polymer = shrink(polymer);
        changed = polymer.length !== prev.length;
    }
    return polymer.length;
}

export function solvePartTwo(input: string) {
    return 0;
}