import _ from "lodash";

const convertToNumbers = (input: string) => {
    const diffs = input.split(/[\s,]+/);

    return diffs
        .map(s => s.replace('+', ''))
        .map(n => Number(n));
}

export default function solve(input: string) {
    const numbers = convertToNumbers(input);
    return _.sum(numbers);
}

export function solvePartTwo(input: string) {
    const numbers = convertToNumbers(input);
    const iterate = (acc: number, soFar: number[]): number => {
        for (let i = 0; i < numbers.length; ++i) {
            const n = numbers[i];
            //console.log(`${acc}, diff ${n}, result ${acc + n}; already seen ${soFar}`);

            acc += n;
            if (_.includes(soFar, acc)) {
                return acc;
            }
            soFar.push(acc);
        }
        return iterate(acc, soFar);
    }
    return iterate(0, [0]);
}