export default class Point {
    public x: number;
    public y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public distanceFrom(x: number, y: number) {
        return Math.abs(x - this.x) + Math.abs(y - this.y);
    }
}