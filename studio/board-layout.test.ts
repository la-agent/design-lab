import { describe, expect, it } from "vitest";

import { dropBoard } from "./board-layout";
import type { BoardSlot } from "./board-layout";

const positions = {
  a: { row: 1, column: 1 },
  b: { row: 2, column: 1 },
  v2: { row: 2, column: 2 },
  c: { row: 3, column: 1 },
};
const slots: BoardSlot[] = [
  { id: "a", ...positions.a, left: 0, top: 0, width: 400, height: 300 },
  { id: "b", ...positions.b, left: 0, top: 400, width: 500, height: 300 },
  { id: "v2", ...positions.v2, left: 564, top: 400, width: 500, height: 400 },
  { id: "c", ...positions.c, left: 0, top: 900, width: 400, height: 300 },
];

describe("idea and iteration layout", () => {
  it("reorders iterations horizontally without changing other ideas", () => {
    expect(dropBoard(positions, slots, "v2", 5, 410)).toEqual({
      ...positions,
      b: positions.v2,
      v2: positions.b,
    });
  });
  it("moves all iterations together when dragging an idea upward", () => {
    expect(dropBoard(positions, slots, "v2", 564, 0)).toEqual({
      a: { row: 2, column: 1 },
      b: { row: 1, column: 1 },
      v2: { row: 1, column: 2 },
      c: positions.c,
    });
    expect(positions.b).toEqual({ row: 2, column: 1 });
  });
  it("moves a whole idea downward and closes the vacant row", () => {
    expect(dropBoard(positions, slots, "b", 0, 950)).toEqual({
      a: positions.a,
      b: { row: 3, column: 1 },
      v2: { row: 3, column: 2 },
      c: { row: 2, column: 1 },
    });
  });
  it("does not create empty columns when dragging a single iteration sideways", () => {
    expect(dropBoard(positions, slots, "a", 2000, 0)).toEqual(positions);
  });
});
