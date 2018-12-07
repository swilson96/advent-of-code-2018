import { solvePartOne, solvePartTwo } from ".";
import input from "./input";

const exampleInput = `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`;

describe("day 07", () => {
  it("should solve first example", () => {
    const answer = solvePartOne(exampleInput);
    expect(answer).toBe("CABDFE");
  });

  it("should solve part 1 correctly", () => {
    // expect(solvePartOne(input)).toBe(0);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo(exampleInput);
    expect(answer).toBe(0);
  });
});
