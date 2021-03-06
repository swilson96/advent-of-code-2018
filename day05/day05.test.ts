import { solvePartOne, solvePartTwo } from ".";
import input from "./input";

const exampleInput = `dabAcCaCBAcCcaDA`;

describe("day 05", () => {
  it("should solve first example", () => {
    const answer = solvePartOne(exampleInput);
    expect(answer).toBe(10);
  });

  it("should solve part 1 correctly", () => {
    expect(solvePartOne(input)).toBe(10766);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo(exampleInput);
    expect(answer).toBe(4);
  });
});
