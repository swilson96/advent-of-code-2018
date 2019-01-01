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
    // expect(solvePartOne(input)).toBe(0);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo(exampleInput);
    expect(answer).toBe(0);
  });
});
