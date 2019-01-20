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
        return `[${this.direction} @ ${this.position.toString()}; turn ${this._nextTurn}]`;
    }
}

abstract class BaseCartTrack {
    private reverseGrid: string[][];
    protected carts: Cart[];
    protected cartIndex: number = 0;

    constructor (input: string) {
        this.reverseGrid = input.split(/\r?\n/).map(l => l.split(""));
        this.carts = this.reverseGrid.reduce((acc, row, y) => row.reduce((rowAcc, thing, x) => {
            if (_.includes(["<", ">", "^", "v"], thing)) {
                return [...rowAcc, new Cart(thing, new Point(x, y))];
            }
            return rowAcc;
        }, acc), [] as Cart[]);

        // console.log(this.carts);
    }

    private moveCart = () => {
        const cart = this.carts[this.cartIndex];
        const nextPlace = cart.nextPosition;
        if (!this.reverseGrid[nextPlace.y]) {
            console.log("off the top or bottom! y coord: " + nextPlace.y);
            console.log(cart.toString());
            console.log(`next position apparently: ${nextPlace.toString()}`);
        } else if (nextPlace.x >= this.reverseGrid[nextPlace.y].length) {
            console.log("off to the right!");
            console.log(cart.toString());
            console.log(`next position apparently: ${nextPlace.toString()}`);
            console.log(`next track apparently: ${this.reverseGrid[nextPlace.y][nextPlace.x]}`);
        }
    
        const nextTrack = this.reverseGrid[nextPlace.y][nextPlace.x];
        return cart.move(nextTrack);
    };

    protected abstract handleCollision(cartWhichJustMoved: Cart, collidingCartIndex: number): string;

    public play() {
        this.cartIndex = 0;
        let tick = 0;
        while (tick < 100000) {
            while (this.cartIndex < this.carts.length) {
                const newCart = this.moveCart();
                const collidingCartIndex = this.checkForCollision(newCart);
                if (collidingCartIndex || collidingCartIndex === 0) {
                    // Boom!
                    // console.log("collision! at " + newCart.position.toString());
                    const ret = this.handleCollision(newCart, collidingCartIndex);
                    if (ret) {
                        return ret;
                    }
                } else {
                    // console.log(`cart ${this.cartIndex} just moved, new position: ${newCart.position.toString()}`);
                    this.carts[this.cartIndex] = newCart;
                    ++this.cartIndex;
                }
            }
            if (this.carts.length === 1) {
                const c = this.carts[0];
                return `${c.position.x},${c.position.y}`;
            }
            this.cartIndex = 0;
            // sort carts for next move
            this.carts = _.sortBy(this.carts, c => c.position.y, c => c.position.x);
            ++tick;
            // console.log(`tick: ${tick}, carts: ${this.carts.map(c => c.toString())}`);
        }
        return "";
    }

    private checkForCollision(cartWhichJustMoved: Cart): number {
        for (let i = 0; i < this.carts.length; ++i) {
            const other = this.carts[i];
            if (other.position.equals(cartWhichJustMoved.position)) {
                return i;
            }
        }
        return null;
    };
}

class PartOneCartTrack extends BaseCartTrack {
    protected handleCollision(cartWhichJustMoved: Cart, collidingCartIndex: number) {
        return `${cartWhichJustMoved.position.x},${cartWhichJustMoved.position.y}`;
    };
}

class PartTwoCartTrack extends BaseCartTrack {
    protected handleCollision(cartWhichJustMoved: Cart, collidingCartIndex: number): string {
        const current = this.carts[this.cartIndex];
        const target = this.carts[collidingCartIndex]
        // console.log("collision! removing " + current.toString() + " and " + target.toString());

        _.remove(this.carts, c => (c === current || c === target));

        // reduce cart index by one if i < cartIndex (i can't be equal)
        if (collidingCartIndex < this.cartIndex) {
            --this.cartIndex;
        }

        // console.log("number of carts left: " + this.carts.length);

        return null;
    };
}

export function solvePartOne(input: string) {
    const track = new PartOneCartTrack(input);
    return track.play();
}

export function solvePartTwo(input: string) {
    const track = new PartTwoCartTrack(input);
    return track.play();
}