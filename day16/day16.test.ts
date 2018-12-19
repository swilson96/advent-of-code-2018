import { solvePartOne, solvePartTwo, countPossibleOpCodes } from ".";
import input from "./input";

const exampleSample = `Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]`;

const exampleInput = [exampleSample, ""];

describe("day 16", () => {
  describe("countPossibleOpCodes", () => {
    it("should count possibilies of example sample", () => {
      const answer = countPossibleOpCodes(exampleSample);
      expect(answer).toBe(3);
    });
  });

  it("should solve first example", () => {
    const answer = solvePartOne(exampleInput);
    expect(answer).toBe(1);
  });

  it("should solve part 1 correctly", () => {
    expect(solvePartOne(input)).toBe(614);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo(exampleInput);
    expect(answer).toBe(0);
  });
});
