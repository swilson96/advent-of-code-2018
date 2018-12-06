import { solvePartOne, solvePartTwo, Position } from ".";
import input from "./input";

const exampleInput = `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`;

describe("day 06", () => {
  describe("Position class", () => {
    it("should report closest as null if joint closest", () => {
      const pos = new Position();
      pos.add(1, 12);
      pos.add(2, 12);
      expect(pos.closest).toBeNull;
    });

    it("should report closest", () => {
      const pos = new Position();
      pos.add(1, 10);
      pos.add(2, 8);
      pos.add(3, 12);
      expect(pos.closest).toBe(2);
    });
  });

  it("should solve first example", () => {
    const answer = solvePartOne(exampleInput);
    expect(answer).toBe(17);
  });

  it("should solve first example", () => {
    const answer = solvePartOne(`1, 1
    1, 6
    8, 3
    3, 4
    5, 5`);
    expect(answer).toBe(9);
  });

  it("should solve part 1 correctly", () => {
    expect(solvePartOne(input)).toBe(2342);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo(exampleInput, 32);
    expect(answer).toBe(16);
  });
});
