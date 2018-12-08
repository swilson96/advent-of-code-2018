import { solvePartOne, solvePartTwo } from ".";
import input from "./input";

const exampleInput = `2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2`;

describe("day 08", () => {
  it("should solve first example", () => {
    const answer = solvePartOne(exampleInput);
    expect(answer).toBe(138);
  });

  it("should solve part 1 correctly", () => {
    // expect(solvePartOne(input)).toBe(0);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo(exampleInput);
    expect(answer).toBe(66);
  });
});
