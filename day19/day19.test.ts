import { solvePartOne, solvePartTwo } from ".";
import input from "./input";

const exampleInput = `#ip 0
seti 5 0 1
seti 6 0 2
addi 0 1 0
addr 1 2 3
setr 1 0 0
seti 8 0 4
seti 9 0 5`;

describe("day 19", () => {
  it("should solve first example", () => {
    const answer = solvePartOne(exampleInput);
    expect(answer).toBe(6);
  });

  it("should solve part 1 correctly", () => {
    expect(solvePartOne(input)).toBe(1344);
  });
});
