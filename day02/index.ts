import _ from "lodash";

const alphabet = "abcdefghijklmnopqrstuvwxyz";

export function solvePartOne(input: string) {
    const factors: any = {};
    const ids = input.split(/\s/);

    for (let i = 2; i <= 3; ++i) {
        factors[i] = 0;
    }

    ids.forEach(id => {
        let debugString = `${id}: `;
        const matchCounts: number[] = [];
        alphabet.split("").forEach(l => {
            const letterRegex = new RegExp(`${l}`, "g");
            const matches = id.match(letterRegex);
            if (matches && matches.length > 1 && matches.length < 4) {
                debugString += `${matches.length}:${l}, `;
                // console.log(`id: ${id}, letter: ${l}, count: ${matches.length}`);
                matchCounts.push(matches.length);
            }
        });

        // console.log(debugString);

        _.uniqBy(matchCounts, m => m).forEach(n => {
            factors[n] += 1;
        });

        // console.log(factors);
    });

    // console.log(factors);

    return factors[2] * factors[3];
}

export function solvePartTwo(input: string) {
    const ids = input.split(/\s/);
    const idLength = ids[0].length;

    for (let i = 0; i < ids.length; ++i) {
        const id1 = ids[i];
        for (let j = i + 1; j < ids.length; ++j) {
            const id2 = ids[j];

            let noMatchIndex = -1;
            let similar = true;
            for (let k = 0; k < idLength; ++k) {
                if (id1.charAt(k) === id2.charAt(k)) {
                    continue;
                }
                if (noMatchIndex !== -1) {
                    similar = false;
                    continue;
                }
                noMatchIndex = k;
            }

            if (similar) {
                console.log(`${id1} and ${id2} differ at ${noMatchIndex}`);
                return id1.slice(0, noMatchIndex) + id1.slice(noMatchIndex + 1);
            }
        }
    }

    return "fail";
}