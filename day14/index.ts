import _ from "lodash";

export function solvePartOne(input: string) {
    return solvePartOneInner(Number(input));
}

export function solvePartOneInner(willImproveAfter: number) {
    const recipes = [3, 7];
    const elves = [0, 1];

    // let tries = 0;
    while (recipes.length < willImproveAfter + 10) {
        // console.log(`[${elves}]: ${recipes}`);

        const sum = recipes[elves[0]] + recipes[elves[1]];
        const firstScore = Math.floor(sum / 10);
        if (firstScore) {
            recipes.push(firstScore);
        }
        recipes.push(sum % 10);

        elves[0] = (elves[0] + 1 + recipes[elves[0]]) % recipes.length;
        elves[1] = (elves[1] + 1 + recipes[elves[1]]) % recipes.length;

        // ++tries;
    }

    return recipes.slice(willImproveAfter, willImproveAfter + 10).join("");
}

export function solvePartTwo(input: string) {
    return 0;
}