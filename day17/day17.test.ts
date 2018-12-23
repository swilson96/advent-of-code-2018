import { solvePartOne, solvePartTwo, Ground } from ".";
import input from "./input";

const exampleInput = `x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504`;

describe("day 17", () => {
  describe("Ground class", () => {
    it("should tell us the extent of the ground, plus one each side", () => {
      const ground = new Ground(input);
      expect(ground.bounds).toEqual([423, 4, 697, 1901]);
    });
  });

  it("should solve first example", () => {
    const answer = solvePartOne(exampleInput);
    expect(answer).toBe(57);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo(exampleInput);
    expect(answer).toBe(29);
  });
});
