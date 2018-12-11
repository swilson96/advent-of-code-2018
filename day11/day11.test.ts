import { solvePartOne, solvePartTwo, scoreSinglePoint } from ".";
import input from "./input";

describe("day 11", () => {
  describe("power level calculations", () => {
    it("should get the right power for the first example", () => {
      const answer = scoreSinglePoint(3, 5, 8);
      expect(answer).toBe(4);
    });

    it("should get the right power for the second example", () => {
      const answer = scoreSinglePoint(122, 79, 57);
      expect(answer).toBe(-5);
    });

    it("should get the right power for the third example", () => {
      const answer = scoreSinglePoint(217, 196, 39);
      expect(answer).toBe(0);
    });

    it("should get the right power for the fourth example", () => {
      const answer = scoreSinglePoint(101, 153, 71);
      expect(answer).toBe(4);
    });
  });

  it("should solve first example", () => {
    const answer = solvePartOne(18);
    expect(answer.x).toBe(33);
    expect(answer.y).toBe(45);
  });

  it("should solve second example", () => {
    const answer = solvePartOne(42);
    expect(answer.x).toBe(21);
    expect(answer.y).toBe(61);
  });

  it("should solve part 1 correctly", () => {
    const answer = solvePartOne(input);
    expect(answer.x).toBe(235);
    expect(answer.y).toBe(60);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo(0);
    expect(answer).toBe(0);
  });
});
