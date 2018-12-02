import _ from "lodash";

const alphabet = "abcdefghijklmnopqrstuvwxyz";

export function solvePartOne(input: string) {
    const factors: any = {};
    const ids = input.split(/\s/);
    const length = ids[0].length;

    for (let i = 2; i <= 3; ++i) {
        factors[i] = 0;
    }

    ids.forEach(id => {
        let debugString = `${id}: `;
        const matchCounts: number[] = []
        alphabet.split('').forEach(l => {
            const letterRegex = new RegExp(`${l}`, 'g');
            const matches = id.match(letterRegex);
            if (matches && matches.length > 1 && matches.length < 4) {
                debugString += `${matches.length}:${l}, `;
                // console.log(`id: ${id}, letter: ${l}, count: ${matches.length}`);
                matchCounts.push(matches.length);
            }
        });

        console.log(debugString);

        _.uniqBy(matchCounts, m => m).forEach(n => {
            factors[n] += 1;
        });

        console.log(factors);
    });

    console.log(factors);

    return factors[2] * factors[3];
}

export function solvePartTwo(input: string) {
    return 0;
}