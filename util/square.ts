import Point from "./point";

export default class Square extends Point {
    public size: number;

    public constructor(x: number, y: number, size: number) {
        super(x, y);
        this.size = size;
    }

    public toString() {
        return `${this.x},${this.y},${this.size}`;
    }
}