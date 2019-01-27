import { solvePartOne, solvePartTwo } from ".";
import input from "./input";

const exampleInput = `pos=<0,0,0>, r=4
pos=<1,0,0>, r=1
pos=<4,0,0>, r=3
pos=<0,2,0>, r=1
pos=<0,5,0>, r=3
pos=<0,0,3>, r=1
pos=<1,1,1>, r=1
pos=<1,1,2>, r=1
pos=<1,3,1>, r=1`;

describe("day 23", () => {
  it("should solve first example", () => {
    const answer = solvePartOne(exampleInput);
    expect(answer).toBe(7);
  });

  it("should solve part 1 correctly", () => {
    expect(solvePartOne(input)).toBe(253);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo(`pos=<10,12,12>, r=2
pos=<12,14,12>, r=2
pos=<16,12,12>, r=4
pos=<14,14,14>, r=6
pos=<50,50,50>, r=200
pos=<10,10,10>, r=5`);
    expect(answer).toBe(36);
  });

  it("should solve simple example of part two", () => {
    const answer = solvePartTwo(`pos=<0,10,10>, r=12
pos=<0,-10,10>, r=12
pos=<0,10,-10>, r=2`);
    expect(answer).toBe(8);
  });
});
