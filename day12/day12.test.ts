import { solvePartOne, solvePartTwo, Room, stringToNumber, reverseBits } from ".";
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

const exampleInitialState = "#..#.#..##......###...###";

const exampleMap = [0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0];

describe("day 12", () => {
  describe("stringToNumber", () => {
    it("0", () => {
      expect(stringToNumber(".")).toBe(0);
    });

    it("1", () => {
      expect(stringToNumber("#")).toBe(1);
    });

    it("1 with padding", () => {
      expect(stringToNumber("#.")).toBe(1);
    });

    it("2", () => {
      expect(stringToNumber(".#")).toBe(2);
    });

    it("3", () => {
      expect(stringToNumber("##")).toBe(3);
    });

    it("5", () => {
      expect(stringToNumber("#.#")).toBe(5);
    });

    it("11", () => {
      expect(stringToNumber("##.#.")).toBe(11);
    });

    it("11", () => {
      expect(stringToNumber("..#.#")).toBe(20);
    });
  });
  
  describe("Room class", () => {
    it("should describe itself", () => {
      const room = new Room(exampleInitialState);
      expect(room.positivePotsToString()).toBe(exampleInitialState);
    });

    it("should sum simple input", () => {
      const room = new Room("###");
      expect(room.sum).toBe(3);
    });

    it("should sum simple with different zero pot", () => {
      const room = new Room(".##");
      expect(room.sum).toBe(3);
    });

    it("should sum another simple input", () => {
      const room = new Room("####");
      expect(room.sum).toBe(6);
    });
  
    it("should sum initial input", () => {
      const room = new Room("#..#.#..##");
      expect(room.sum).toBe(3 + 5 + 8 + 9);
    });

    it("should evolve once a single pot into one", () => {
      const room = new Room("#", [0,0,0,0,1]);
      room.evolve();
      expect(room.positivePotsToString()).toBe("#");
    });

    it("should evolve once a single pot into one", () => {
      const room = new Room("#", [0,0,1,0,0]);
      room.evolve();
      expect(room.positivePotsToString()).toBe(".#");
    });

    it("should evolve once a single pot into two", () => {
      const room = new Room("#", [0,0,1,0,1]);
      room.evolve();
      expect(room.positivePotsToString()).toBe("##");
    });

    it("should evolve once a non-zero single pot", () => {
      const room = new Room(".#", [0,0,1,0,0]);
      room.evolve();
      expect(room.positivePotsToString()).toBe("..#");
    });

    it("should evolve and sum negative pots", () => {
      const room = new Room("#", [0,0,0,0,0,0,0,0,1]);
      room.evolve();
      expect(room.positivePotsToString()).toBe("");
    });

    it("should evolve and sum both negative and positive pots", () => {
      // 1 and 8 map to new plants
      // that's #.... and ...#.
      const room = new Room("#", [0,1,0,0,0,0,0,0,1]);
      room.evolve();
      expect(room.positivePotsToString()).toBe("..#");
      expect(room.sum).toBe(1);
    });

    it("should evolve twice and sum both negative and positive pots", () => {
      const room = new Room("#", [0,1,0,0,0,0,0,0,1]);
      room.evolve();
      // Now looks like (starting from -1) #..#
      room.evolve();
      // should be (starting from -2) #.....#
      expect(room.positivePotsToString()).toBe("....#");
      expect(room.sum).toBe(2);
    });

    it("should evolve first example", () => {
      const room = new Room(exampleInitialState, exampleMap);
      room.evolve();
      expect(room.positivePotsToString()).toBe("#...#....#.....#..#..#..#");
      room.evolve();
      expect(room.positivePotsToString()).toBe("##..##...##....#..#..#..##");
      room.evolve();
      expect(room.positivePotsToString()).toBe(".#...#..#.#....#..#..#...#");
      room.evolve();
      expect(room.positivePotsToString()).toBe("#.#..#...#.#...#..#..##..##");
      
    });
  });

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
