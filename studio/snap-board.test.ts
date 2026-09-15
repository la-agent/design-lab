import { expect, it } from "vitest";

import { snapBoard } from "./snap-board";

const board = { x: 100, y: 100, width: 200, height: 400 };
it("returns to its original slot within eight screen pixels", () => {
  expect(
    snapBoard(board, { x: -94, y: -103 }, { x: 0, y: 0 }, [], 1).delta
  ).toEqual({ x: -100, y: -100 });
});
it("aligns edges and centres with other boards", () => {
  const result = snapBoard(
    board,
    { x: 397, y: 204 },
    { x: 0, y: 0 },
    [{ x: 600, y: 500, width: 200, height: 400 }],
    1
  );
  expect(result.delta).toEqual({ x: 400, y: 200 });
  expect(result.x).toBe(600);
  expect(result.y).toBe(500);
});
it("keeps snap distance consistent when zoomed out, without snapping distant boards", () => {
  expect(
    snapBoard(board, { x: -85, y: 0 }, { x: 0, y: 0 }, [], 0.5).delta.x
  ).toBe(-100);
  expect(
    snapBoard(board, { x: -80, y: 0 }, { x: 0, y: 0 }, [], 0.5).delta.x
  ).toBe(-80);
});
