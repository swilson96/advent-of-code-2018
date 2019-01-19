import { solvePartOne, solvePartTwo } from ".";
import input from "./input";

const exampleInput = String.raw`|
v
|
|
|
^
|`;

const exampleInputTwo = String.raw`/->-\        
|   |  /----\
| /-+--+-\  |
| | |  | v  |
\-+-/  \-+--/
  \------/   `;

describe("day 13", () => {
  it("should solve first example", () => {
    const answer = solvePartOne(exampleInput);
    expect(answer).toBe("0,3");
  });

  it("should solve second example", () => {
    const answer = solvePartOne(exampleInputTwo);
    expect(answer).toBe("7,3");
  });

  it("should solve part 1 correctly", () => {
    expect(solvePartOne(input)).toBe("");
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo(exampleInput);
    expect(answer).toBe(0);
  });
});
