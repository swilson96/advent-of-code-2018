import { solvePartOne, solvePartTwo } from ".";
import input from "./input";

describe("day 03", () => {
  it("should solve first example", () => {
    const answer = solvePartOne(`#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2`);
    expect(answer).toBe(4);
  });

  it("should solve trivial example", () => {
    const answer = solvePartOne("#1 @ 5,5: 4x4");
    expect(answer).toBe(0);
  });

  it("should solve part 1 correctly", () => {
    expect(solvePartOne(input)).toBe(107820);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo(`#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2`);
    expect(answer).toBe(3);
  });
});
