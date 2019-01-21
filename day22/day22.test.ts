import { solvePartOne, solvePartTwo, Cave } from ".";
import input from "./input";
import Point from "../util/point";

const exampleCave = `M=.|=.|.|=.|=|=.
.|=|=|||..|.=...
.==|....||=..|==
=.|....|.==.|==.
=|..==...=.|==..
=||.=.=||=|=..|=
|.=.===|||..=..|
|..==||=.|==|===
.=..===..=|.|||.
.======|||=|=.|=
.===|=|===T===||
=|||...|==..|=.|
=.=|=.=..=.||==|
||=|=...|==.=|==
|=.=||===.|||===
||.|==.|.|.||=||
`;

describe("day 22", () => {
  describe("the example Cave", () => {
    const cave = new Cave({ depth: 510, target: new Point(10, 10)});
    describe("geologic index", () => {
      it("should be 0 at origin", () => {
        expect(cave.geoIndexAt(0, 0)).toEqual(0);
      });
      it("should be multiplied by 48271 along y axis", () => {
        expect(cave.geoIndexAt(0, 1)).toEqual(48271 % 20183);
      });
      it("should be multiplied by 16807 along x axis", () => {
        expect(cave.geoIndexAt(1, 0)).toEqual(16807 % 20183);
      });
      it("should be multiplied by neighbours' erosion levels", () => {
        expect(cave.geoIndexAt(1, 1)).toEqual(8415 * 17317 % 20183);
      });
      it("should be 0 at target", () => {
        expect(cave.geoIndexAt(10, 10)).toEqual(0);
      });

      it("should be multiplied by 16807 along x axis", () => {
        expect(cave.geoIndexAt(6, 0)).toEqual((16807 * 6) % 20183);
      });
    });

    describe("erosion index", () => {
      it("should be 510 at origin", () => {
        expect(cave.erosionIndexAt(0, 0)).toEqual(510);
      });
      it("should be multiplied by 8415 along y axis", () => {
        expect(cave.erosionIndexAt(0, 1)).toEqual(8415);
      });
      it("should be multiplied by 17317 along x axis", () => {
        expect(cave.erosionIndexAt(1, 0)).toEqual(17317);
      });
      it("should be multiplied by neighbours", () => {
        expect(cave.erosionIndexAt(1, 1)).toEqual(1805);
      });
      it("should be 510 at target", () => {
        expect(cave.erosionIndexAt(10, 10)).toEqual(510);
      });
    });

    describe("risk level", () => {
      it("should be 0 at origin", () => {
        expect(cave.riskAt(0, 0)).toEqual(0);
      });
      it("should be multiplied by 0 along y axis", () => {
        expect(cave.riskAt(0, 1)).toEqual(0);
      });
      it("should be multiplied by 1 along x axis", () => {
        expect(cave.riskAt(1, 0)).toEqual(1);
      });
      it("should be multiplied by neighbours", () => {
        expect(cave.riskAt(1, 1)).toEqual(2);
      });
      it("should be 0 at target", () => {
        expect(cave.riskAt(10, 10)).toEqual(0);
      });
    });

    it("cave strata to match q example", () => {
      expect(cave.draw()).toEqual(exampleCave);
    });
  });

  it("should solve first example", () => {
    const answer = solvePartOne({ depth: 510, target: { x: 10, y: 10 } });
    expect(answer).toBe(114);
  });

  it("should solve part 1 correctly", () => {
    expect(solvePartOne(input)).toBe(6323);
  });

  it("should solve first example of part two", () => {
    const answer = solvePartTwo({ depth: 510, target: { x: 10, y: 10 } });
    expect(answer).toBe(45);
  });

  it("should solve part two", () => {
    // const answer = solvePartTwo(input);
    // expect(answer).toBe(0);
  });
});
