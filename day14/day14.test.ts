import { solvePartOne, solvePartTwo, solvePartOneInner } from ".";
import input from "./input";

describe("day 14", () => {
  it("should solve first example", () => {
    const answer = solvePartOneInner(9);
    expect(answer).toBe("5158916779");
  });

  it("should solve second example", () => {
    const answer = solvePartOneInner(5);
    expect(answer).toBe("0124515891");
  });

  it("should solve second example", () => {
    const answer = solvePartOneInner(18);
    expect(answer).toBe("9251071085");
  });

  it("should solve second example", () => {
    const answer = solvePartOneInner(2018);
    expect(answer).toBe("5941429882");
  });

  it("should solve part 1 correctly", () => {
    expect(solvePartOne(input)).toBe("7861362411");
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo("51589");
    expect(answer).toBe(9);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo("01245");
    expect(answer).toBe(5);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo("92510");
    expect(answer).toBe(18);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo("59414");
    expect(answer).toBe(2018);
  });
});
