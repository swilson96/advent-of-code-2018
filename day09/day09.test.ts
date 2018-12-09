import { solvePartOne } from ".";
import input from "./input";

describe("day 09", () => {
  it("should solve question example", () => {
    const answer = solvePartOne("9 players; last marble is worth 25 points");
    expect(answer).toBe(32);
  });

  it("should solve first example", () => {
    const answer = solvePartOne("10 players; last marble is worth 1618 points");
    expect(answer).toBe(8317);
  });

  it("should solve second example", () => {
    const answer = solvePartOne("13 players; last marble is worth 7999 points");
    expect(answer).toBe(146373);
  });

  it("should solve third example", () => {
    const answer = solvePartOne("17 players; last marble is worth 1104 points");
    expect(answer).toBe(2764);
  });

  it("should solve fourth example", () => {
    const answer = solvePartOne("21 players; last marble is worth 6111 points");
    expect(answer).toBe(54718);
  });

  it("should solve fifth example", () => {
    const answer = solvePartOne("30 players; last marble is worth 5807 points");
    expect(answer).toBe(37305);
  });

  it("should solve part 1 correctly", () => {
    expect(solvePartOne(input)).toBe(422980);
  });
});
