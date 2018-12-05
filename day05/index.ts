import _ from "lodash";

const alphabet = "abcdefghijklmnopqrstuvwxyz";

const shrink = (input: string) => {
    for (let i = 0; i < input.length - 1; ++i) {
        if (input[i].toLowerCase() === input[i + 1].toLowerCase() && input[i] !== input[i + 1]) {
            input = input.slice(0, i) + input.slice(i + 2);
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
    // console.log(`Input: ${input}; shrunk: ${polymer}; answer: ${polymer.length}`);
    return polymer.length;
}

export function solvePartTwo(input: string) {
    const original = input;
    return Math.min(...alphabet.split("")
        .map(letter => solvePartOne(original
            .replace(new RegExp(letter, "g"), "")
            .replace(new RegExp(letter.toUpperCase(), "g"), ""))));
}