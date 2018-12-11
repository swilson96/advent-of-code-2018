import { solvePartOne, solvePartTwo, scoreSinglePoint } from ".";
import input from "./input";
import Point from "../util/point";
import Square from "../util/square";

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
    expect(answer).toEqual(new Point(33, 45));
  });

  it("should solve second example", () => {
    const answer = solvePartOne(42);
    expect(answer).toEqual(new Point(21, 61));
  });

  it("should solve part 1 correctly", () => {
    const answer = solvePartOne(input);
    expect(answer).toEqual(new Point(235, 60));
  });

  // it("should solve first example of part two", () => {
  //   const answer = solvePartTwo(18);
  //   expect(answer).toEqual(new Square(90, 269, 16));
  // });

  // it("should solve first example of part two", () => {
  //   const answer = solvePartTwo(42);
  //   expect(answer).toEqual(new Square(232, 251, 12));
  // });

  // it("should solve part two correctly", () => {
  //   const answer = solvePartTwo(input);
  //   expect(answer).toEqual(new Square(0, 0, 12));
  // });
});
