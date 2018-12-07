import _ from "lodash";

// const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const regex = /Step (.) must be finished before step (.) can begin./;

export function solvePartOne(input: string) {
    const constraints = input.split(/\r?\n/).map(c => c.match(regex).slice(1));

    const alphabet = _.uniq(_.union(constraints.map(c => c[0]), constraints.map(c => c[1])));

    const order: string[] = [];
    while (order.length < alphabet.length) {
        const blocked = constraints.filter(c => !_.includes(order, c[0])).map(c => c[1]);
        const available = _.difference(alphabet, order, blocked);
        available.sort();
        order.push(available[0]);
    }
    return order.join("");
}

export function solvePartTwo(input: string) {
    return 0;
}