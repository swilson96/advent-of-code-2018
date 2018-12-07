import _ from "lodash";

const realAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
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

export const allDone = (time: number, workers: string[][]) => {
    return workers.reduce((a, w) => a && !w[time], true);
};

export function solvePartTwo(input: string, offset: number = 60, numWorkers: number = 5) {
    const constraints = input.split(/\r?\n/).map(c => c.match(regex).slice(1));

    const alphabet = _.uniq(_.union(constraints.map(c => c[0]), constraints.map(c => c[1])));
    alphabet.sort();

    let time = 0;
    const workers: string[][] = [];
    for (let i = 0; i < numWorkers; ++i) {
        workers[i] = [];
    }
    const done: string[] = [];

    while (done.length < alphabet.length || !allDone(time, workers)) {

        const currentTasks = workers.map(w => w[time]);
        const actuallyDone = _.difference(done, currentTasks);
        const blocked = constraints.filter(c => !_.includes(actuallyDone, c[0])).map(c => c[1]);
        const available = _.difference(alphabet, done, blocked);
        available.sort();

        let openSlot = 0;
        for (let i = 0; i < numWorkers; ++i) {
            if (available[openSlot] && !workers[i][time]) {
                const task = available[openSlot];
                done.push(task);
                for (let j = 0; j < offset + alphabet.indexOf(task) + 1; ++j) {
                    workers[i][time + j] = task;
                }
                ++openSlot;
            }
        }

        // console.log(workers[0][time] + ", " + workers[1][time]);

        ++time;
    }
    return time;
}