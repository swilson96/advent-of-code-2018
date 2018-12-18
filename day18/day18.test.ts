import { solvePartOne, solvePartTwo } from ".";
import input from "./input";

const exampleInput = `.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.
`;

describe("day 18", () => {
  it("should solve first example", () => {
    const answer = solvePartOne(exampleInput);
    expect(answer).toBe(1147);
  });

  it("should solve part 1 correctly", () => {
    expect(solvePartOne(input)).toBe(536370);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo(exampleInput);
    expect(answer).toBe(0);
  });

  it("should solve part two", () => {
    const answer = solvePartTwo(input);
    expect(answer).toBe(190512);
  });
});
