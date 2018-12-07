import { solvePartOne, solvePartTwo, allDone } from ".";
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
    expect(solvePartOne(input)).toBe("OVXCKZBDEHINPFSTJLUYRWGAMQ");
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo(exampleInput, 0, 2);
    expect(answer).toBe(15);
  });

  describe("allDone", () => {
    it("should be false if someone working", () => {
      const answer = allDone(2, [["A", "A"], ["B", "B", "B"]]);
      expect(answer).toBeFalsy;
    });

    it("should be true if noone left working", () => {
      const answer = allDone(2, [["A", "A"], ["B", "B"]]);
      expect(answer).toBeTruthy;
    });
  });
});
