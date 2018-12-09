import _ from "lodash";

const gameDescRegex = /(\d+) players; last marble is worth (\d+) points/;

const parseGameDesc = (input: string) => {
    const match = input.match(gameDescRegex);
    const numPlayers = Number(match[1]);
    const lastMarble = Number(match[2]);
    return { numPlayers, lastMarble };
}

class MarbleGameCircle {
    private circle: number[] = [0];
    private currentIndex = 0;

    private getIndex(index: number) {
        const closest = index % this.circle.length;
        return closest < 0 ? closest + this.circle.length : closest;
    }

    public insert(marble: number) {
        if (marble % 23 === 0) {
            const removeIndex = this.getIndex(this.currentIndex - 7);
            const score = marble + this.circle[removeIndex];
            this.circle = _.concat(this.circle.slice(0, removeIndex), this.circle.slice(removeIndex + 1));
            this.currentIndex = removeIndex;
            return score;
        } else {
            const insertIndex = this.getIndex(this.currentIndex + 2);
            this.circle = _.concat(this.circle.slice(0, insertIndex), [marble], this.circle.slice(insertIndex));
            this.currentIndex = insertIndex;
            return 0;
        }
    }

    public print(player: number) {
        console.log(`[${player}]; current marble: ${this.circle[this.currentIndex]} at ${this.currentIndex}: ${this.circle.join(" ")}`);
    }
}

export function solvePartOne(input: string) {
    const { numPlayers, lastMarble } = parseGameDesc(input);
    return playGame(numPlayers, lastMarble);
}

function playGame(numPlayers: number, lastMarble: number) {
    const circle = new MarbleGameCircle();
    const scores: number[] = [];
    for (let player = 0; player < numPlayers; ++player) {
        scores[player] = 0;
    }
    for (let marble = 1; marble <= lastMarble; ++marble) {
        const currentPlayerIndex = (marble - 1) % numPlayers;
        const score = circle.insert(marble);
        // circle.print(currentPlayerIndex + 1);
        scores[currentPlayerIndex] += score;
    }
    // console.log("Game over! Scores: " + scores);
    return _.max(scores);
}

export function solvePartTwo(input: string) {
    const { numPlayers, lastMarble } = parseGameDesc(input);
    return playGame(numPlayers, lastMarble * 100);
}