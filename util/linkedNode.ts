
export default class Node {
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