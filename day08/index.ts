import _ from "lodash";

export function solvePartOne(input: string) {
    const fullLicence = input.split(/\s/).map(s => Number(s));

    const sumChildren = (numKids: number, licence: number[]): { sum: number, remainder: number[] } => {
        if (numKids === 0) {
            return { sum: 0, remainder: licence };
        }
        const { sum: firstSum, remainder: restOfFamily  } = chopNextChild(licence);
        const { sum: sumRest, remainder } = sumChildren(numKids - 1, restOfFamily);
        return { sum: firstSum + sumRest, remainder };
    };

    const chopNextChild = (input: number[]): { sum: number, remainder: number[] } => {
        const numKids = input[0];
        const numMeta = input[1];
        const { sum, remainder } = sumChildren(numKids, input.slice(2));
        const sumOfMeta = _.sum(remainder.slice(0, numMeta));

        // console.log(`child found, starting ${numKids} ${numMeta}, sum of meta: ${sumOfMeta}, sum of kids: ${sum}`)

        return { sum: sum + sumOfMeta, remainder: remainder.slice(numMeta) };
    };

    return chopNextChild(fullLicence).sum;
}

export function solvePartTwo(input: string) {
    const fullLicence = input.split(/\s/).map(s => Number(s));

    const valueChildren = (numKids: number, licence: number[]): { values: number[], remainder: number[] } => {
        if (numKids === 0) {
            return { values: [], remainder: licence };
        }
        const { value: firstValue, remainder: restOfFamily  } = chopNextChild(licence);
        const { values: restOfvalues, remainder } = valueChildren(numKids - 1, restOfFamily);
        return { values: _.concat([firstValue], restOfvalues), remainder };
    };

    const chopNextChild = (input: number[]): { value: number, remainder: number[] } => {
        const numKids = input[0];
        const numMeta = input[1];
        if (numKids === 0) {
            const metaData = input.slice(2, 2 + numMeta);
            return { value: _.sum(metaData) || 0, remainder: input.slice(2 + numMeta) };
        }
        const { values, remainder } = valueChildren(numKids, input.slice(2));
        const metaData = remainder.slice(0, numMeta);
        const value = _.sum(metaData.map(m => values[m - 1] || 0));

        // console.log(`child found, starting ${numKids} ${numMeta}, value: ${value}, values of kids: ${values}`)

        return { value, remainder: remainder.slice(numMeta) };
    };

    return chopNextChild(fullLicence).value;
}