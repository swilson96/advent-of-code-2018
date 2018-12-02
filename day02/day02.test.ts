import { solvePartOne, solvePartTwo } from ".";
import input from "./input";

describe("day XX", () => {
  it("should solve example", () => {
    const answer = solvePartOne(`abcdef
bababc
abbcde
abcccd
aabcdd
abcdee
ababab`);
    expect(answer).toBe(12);
  });

  it("should solve part 1 correctly", () => {
    expect(solvePartOne(input)).toBe(7470);
  });

  it("should solve example of part two", () => {
    const answer = solvePartTwo(`abcde
fghij
klmno
pqrst
fguij
axcye
wvxyz`);
    expect(answer).toBe("fgij");
  });
});
