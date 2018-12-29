import _ from "lodash";

export function solvePartOne(input: string) {
    return solvePartOneInner(Number(input));
}

export function solvePartOneInner(willImproveAfter: number) {
    const recipes = [3, 7];
    const elves = [0, 1];

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
    }

    return recipes.slice(willImproveAfter, willImproveAfter + 10).join("");
}

export function solvePartTwo(target: string) {
    const recipes = [3, 7];
    const elves = [0, 1];
    const targetLength = target.length;

    const didHitTarget = (length: number, recipes: number[]) => {
        if (length > targetLength) {
            const lastBit = recipes.slice(length - targetLength).join("");
            if (target === lastBit) {
                return true;
            }
        }
        return false;
    };

    let length = 2;
    while (true) {
        // console.log(`[${elves}]: ${recipes}`);

        const sum = recipes[elves[0]] + recipes[elves[1]];
        const firstScore = Math.floor(sum / 10);
        if (firstScore) {
            recipes.push(firstScore);
            ++length;

            if (didHitTarget(length, recipes)) {
                return (length - targetLength);
            }
        }
        recipes.push(sum % 10);
        ++length;

        if (didHitTarget(length, recipes)) {
            return (length - targetLength);
        }

        elves[0] = (elves[0] + 1 + recipes[elves[0]]) % recipes.length;
        elves[1] = (elves[1] + 1 + recipes[elves[1]]) % recipes.length;
    }
}