import _ from "lodash";
import Point from "../util/point";

class Cart {
    private _direction: string;
    private _position: Point;
    private _nextTurn: number;

    public constructor(d: string, p: Point, t?: number) {
        this._direction = d;
        this._position = p;
        this._nextTurn = t || 0;
    }

    public get nextPosition() {
        switch (this.direction) {
            case ">":
                return new Point(this.position.x + 1, this.position.y);
            case "<":
                return new Point(this.position.x - 1, this.position.y);
            case "^":
                return new Point(this.position.x, this.position.y - 1);
            case "v":
                return new Point(this.position.x, this.position.y + 1);
            default:
                throw new Error("not a direction: " + this.direction);
        }
    }

    private nextDirection(n: string) {
        if (n === "+") {
            const t = this._nextTurn;
            this._nextTurn = t + 1;
            switch (t % 3) {
                case 0:
                    // left
                    switch (this.direction) {
                        case ">":
                            return "^";
                        case "<":
                            return "v";
                        case "^":
                            return "<";
                        case "v":
                            return ">";
                        default:
                            throw new Error("not a direction: " + this.direction);
                    }
                case 1:
                    // straight
                    return this.direction;
                case 2:
                    // right
                    switch (this.direction) {
                        case ">":
                            return "v";
                        case "<":
                            return "^";
                        case "^":
                            return ">";
                        case "v":
                            return "<";
                        default:
                            throw new Error("not a direction: " + this.direction);
                    }
            }
        }
        switch (this.direction) {
            case ">":
                return n === "/" ? "^" : n === "\\" ? "v" : ">";
            case "<":
                return n === "/" ? "v" : n === "\\" ? "^" : "<";
            case "^":
                return n === "/" ? ">" : n === "\\" ? "<" : "^";
            case "v":
                return n === "/" ? "<" : n === "\\" ? ">" : "v";
            default:
                throw new Error("not a direction: " + this.direction);
        }
    }

    public move(nextTrack: string): Cart {
        return new Cart(this.nextDirection(nextTrack), this.nextPosition, this._nextTurn);
    }

    public get direction() {
        return this._direction;
    }

    public get position() {
        return this._position;
    }

    public toString() {
        return `Cart: ${this.direction} at ${this.position.toString()} (next turn ${this._nextTurn})`;
    }
}

const moveCart = (cart: Cart, reverseGrid: string[][]) => {
    const nextPlace = cart.nextPosition;
    if (!reverseGrid[nextPlace.y]) {
        console.log("off the top or bottom! y coord: " + nextPlace.y);
        console.log(cart.toString());
        console.log(`next position apparently: ${nextPlace.toString()}`);
    } else if (nextPlace.x >= reverseGrid[nextPlace.y].length) {
        console.log("off to the right!");
        console.log(cart.toString());
        console.log(`next position apparently: ${nextPlace.toString()}`);
        console.log(`next track apparently: ${reverseGrid[nextPlace.y][nextPlace.x]}`);
    }

    const nextTrack = reverseGrid[nextPlace.y][nextPlace.x];
    return cart.move(nextTrack);
};

const collision = (cart: Cart, carts: Cart[]) => {
    for (let i = 0; i < carts.length; ++i) {
        const other = carts[i];
        if (other.position.equals(cart.position)) {
            return true;
        }
    }
    return false;
};

export function solvePartOne(input: string) {
    const reverseGrid = input.split(/\r?\n/).map(l => l.split(""));
    let carts: Cart[] = reverseGrid.reduce((acc, row, y) => row.reduce((rowAcc, thing, x) => {
        if (_.includes(["<", ">", "^", "v"], thing)) {
            return [...rowAcc, new Cart(thing, new Point(x, y))];
        }
        return rowAcc;
    }, acc), [] as Cart[]);

    // for (let y = 1; y < reverseGrid.length; ++y) {
    //     console.log(reverseGrid[y]);
    // }

    let cartIndex = 0;
    const numCarts = carts.length;

    // console.log(carts);

    let timeout = 0;
    while (timeout < 10000) {
        while (cartIndex < numCarts) {
            const newCart = moveCart(carts[cartIndex], reverseGrid);
            if (collision(newCart, carts)) {
                // Boom!
                return `${newCart.position.x},${newCart.position.y}`;
            }
            carts[cartIndex] = newCart;
            ++cartIndex;
            // console.log(carts);
        }
        cartIndex = 0;
        // sort carts for next move
        carts = _.sortBy(carts, c => c.position.y, c => c.position.x);
        ++timeout;
    }
    return "";
}

export function solvePartTwo(input: string) {
    return 0;
}