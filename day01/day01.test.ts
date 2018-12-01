import { solvePartOne, solvePartTwo } from ".";
import input from "./input";

describe("day 01", () => {
  it("should solve first example", () => {
    const answer = solvePartOne("+1, +1, +1");
    expect(answer).toBe(3);
  });

  it("should solve second example", () => {
    const answer = solvePartOne("+1, +1, -2");
    expect(answer).toBe(0);
  });

  it("should solve third example", () => {
    const answer = solvePartOne("-1, -2, -3");
    expect(answer).toBe(-6);
  });

  it("should cope with newlines", () => {
    const answer = solvePartOne(`+3,
+4,
+5`);
    expect(answer).toBe(12);
  });

  it("will output answer to part one", () => {
    console.log("part one: " + solvePartOne(input));
  });

  it("should solve text example of part two", () => {
    const answer = solvePartTwo("+1, -2, +3, +1");
    expect(answer).toBe(2);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo("+1, -1");
    expect(answer).toBe(0);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo("+1, -1");
    expect(answer).toBe(0);
  });

  it("should solve second example of part two", () => {
    const answer = solvePartTwo("+3, +3, +4, -2, -4");
    expect(answer).toBe(10);
  });

  it("should solve third example of part two", () => {
    const answer = solvePartTwo("-6, +3, +8, +5, -6");
    expect(answer).toBe(5);
  });

  it("should solve fourth example of part two", () => {
    const answer = solvePartTwo("+7, +7, -2, -7, -4");
    expect(answer).toBe(14);
  });

  it("will output answer to part two", () => {
    console.log("part two: " + solvePartTwo(input));
  });
});
