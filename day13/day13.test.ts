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

const partTwoExampleInput = String.raw`/>-<\  
|   |  
| /<+-\
| | | v
\>+</ |
  |   ^
  \<->/`;

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
    expect(solvePartOne(input)).toBe("129,50");
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo(partTwoExampleInput);
    expect(answer).toBe("6,4");
  });

  it("should solve part two", () => {
    const answer = solvePartTwo(input);
    expect(answer).toBe("69,73");
  });
});
