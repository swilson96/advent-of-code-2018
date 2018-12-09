import _ from "lodash";

const gameDescRegex = /(\d+) players; last marble is worth (\d+) points/;

const parseGameDesc = (input: string) => {
    const match = input.match(gameDescRegex);
    const numPlayers = Number(match[1]);
    const lastMarble = Number(match[2]);
    return { numPlayers, lastMarble };
};

class Node {
    private _value: number;
    private _next: Node;
    private _previous: Node;

    constructor(value: number, next?: Node, previous?: Node) {
        this._value = value;
        this._next = next;
        this._previous = previous;
    }

    public setNext(newNext: Node) {
        this._next = newNext;
    }

    public setPrevious(newPrev: Node) {
        this._previous = newPrev;
    }

    public get next(): Node {
        return this._next || this;
    }

    public get previous(): Node {
        return this._previous || this;
    }

    public get value() {
        return this._value;
    }
}

class MarbleGameCircle {
    private currentNode = new Node(0);
    private rootNode = this.currentNode;
    private circleLength = 1;

    public insert(marble: number) {
        if (marble % 23 === 0) {
            let removeNode = this.currentNode;
            for (let i = 0; i < 7; ++i) {
                removeNode = removeNode.previous;
            }
            const score = marble + removeNode.value;
            removeNode.previous.setNext(removeNode.next);
            removeNode.next.setPrevious(removeNode.previous);
            this.currentNode = removeNode.next;
            this.circleLength -= 1;
            return score;
        } else {
            const nodeBeforeInsert = this.currentNode.next;
            const newNode = new Node(marble, nodeBeforeInsert.next, nodeBeforeInsert);

            nodeBeforeInsert.setNext(newNode);
            newNode.next.setPrevious(newNode);

            this.currentNode = newNode;
            this.circleLength += 1;
            return 0;
        }
    }

    public print(player: number) {
        const values = [];
        let node = this.rootNode;
        for (let i = 0; i < this.circleLength; ++i) {
            values.push(node.value);
            node = node.next;
        }
        console.log(`[${player}]; current marble: ${this.currentNode.value}: ${values}`);
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