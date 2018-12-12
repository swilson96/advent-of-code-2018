import { solvePartOne, solvePartTwo } from ".";
import input from "./input";

const exampleInput = `initial state: #..#.#..##......###...###

...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #`;

describe("day 12", () => {
  it("should solve first example", () => {
    const answer = solvePartOne(exampleInput);
    expect(answer).toBe(325);
  });

  it("should solve part 1 correctly", () => {
    expect(solvePartOne(input)).toBe(2542);
  });

  it("should solve first example of part two", () => {
    // const answer = solvePartTwo(exampleInput);
    // expect(answer).toBe(0);
  });
});
