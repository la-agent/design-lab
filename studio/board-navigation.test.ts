import { expect, it } from "vitest";

import { boardNeighbours } from "./board-navigation";

const groups = [
  { boards: [{ id: "a" }] },
  { boards: [{ id: "b1" }, { id: "b2" }] },
  { boards: [{ id: "c1" }, { id: "c2" }, { id: "c3" }] },
];
it("navigates iterations horizontally and preserves column between ideas", () => {
  expect(boardNeighbours(groups, "b2")).toEqual({
    ArrowLeft: "b1",
    ArrowRight: undefined,
    ArrowUp: "a",
    ArrowDown: "c2",
  });
});
it("clamps shorter rows and stops at collection edges", () => {
  expect(boardNeighbours(groups, "c3").ArrowUp).toBe("b2");
  expect(boardNeighbours(groups, "a").ArrowUp).toBeUndefined();
  expect(boardNeighbours(groups, "c3").ArrowDown).toBeUndefined();
  expect(boardNeighbours(groups, "missing")).toEqual({});
});
