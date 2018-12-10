import { solvePartOne, buildInitialSky, Sky } from ".";
import input from "./input";

const exampleInput = `position=< 9,  1> velocity=< 0,  2>
position=< 7,  0> velocity=<-1,  0>
position=< 3, -2> velocity=<-1,  1>
position=< 6, 10> velocity=<-2, -1>
position=< 2, -4> velocity=< 2,  2>
position=<-6, 10> velocity=< 2, -2>
position=< 1,  8> velocity=< 1, -1>
position=< 1,  7> velocity=< 1,  0>
position=<-3, 11> velocity=< 1, -2>
position=< 7,  6> velocity=<-1, -1>
position=<-2,  3> velocity=< 1,  0>
position=<-4,  3> velocity=< 2,  0>
position=<10, -3> velocity=<-1,  1>
position=< 5, 11> velocity=< 1, -2>
position=< 4,  7> velocity=< 0, -1>
position=< 8, -2> velocity=< 0,  1>
position=<15,  0> velocity=<-2,  0>
position=< 1,  6> velocity=< 1,  0>
position=< 8,  9> velocity=< 0, -1>
position=< 3,  3> velocity=<-1,  1>
position=< 0,  5> velocity=< 0, -1>
position=<-2,  2> velocity=< 2,  0>
position=< 5, -2> velocity=< 1,  2>
position=< 1,  4> velocity=< 2,  1>
position=<-2,  7> velocity=< 2, -2>
position=< 3,  6> velocity=<-1, -1>
position=< 5,  0> velocity=< 1,  0>
position=<-6,  0> velocity=< 2,  0>
position=< 5,  9> velocity=< 1, -2>
position=<14,  7> velocity=<-2,  0>
position=<-3,  6> velocity=< 2, -1>`;

describe("day10", () => {
  describe("first example after three secs", () => {
    let sky: Sky;

    beforeAll(() => {
      sky = buildInitialSky(exampleInput);
      sky.tick();
      sky.tick();
      sky.tick();
    });

    it("should have correct range", () => {
      const range = sky.range();
      // sky.print();
      expect(range).toEqual([0, 0, 9, 7]);
    });
  });

  it("should solve first example of part one", () => {
    const answer = solvePartOne(exampleInput, 8, 10);
    expect(answer).toBe(3);
  });

  it("should solve part one and two", () => {
    const answer = solvePartOne(input, 16, 11000);
    expect(answer).toBe(10905);
  });
});
