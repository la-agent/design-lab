import { expect, it } from "vitest";

import { alignBoards, canvasRows } from "./auto-layout";
import { onboardingPages } from "./test-fixtures";
const [page] = onboardingPages;
if (!page) {
  throw new Error("Missing fixture");
}
const sizes = Object.fromEntries(page.boards.map((board) => [board.id, board]));
it("puts all designs on one row regardless of idea tags", () => {
  const positions = alignBoards(page, sizes, {});
  expect(new Set(Object.values(positions).map((point) => point.y)).size).toBe(
    1
  );
  expect(positions.workspace?.x).toBe(1024);
});
it("only breaks on an explicit new row, below the tallest content", () => {
  const breaks = { goals: true };
  const positions = alignBoards(
    page,
    { ...sizes, "workspace-all": { width: 1280, height: 8000 } },
    {},
    breaks
  );
  expect(positions.goals?.x).toBe(0);
  expect(positions.goals?.y).toBe(8336);
  expect(canvasRows(page, breaks).map((row) => row.boards.length)).toEqual([
    3, 1,
  ]);
});
it("uses a height cap when present", () => {
  const positions = alignBoards(
    page,
    {
      ...sizes,
      "workspace-all": { width: 1280, height: 8000, maxHeight: 900 },
    },
    {},
    { goals: true }
  );
  expect(positions.goals?.y).toBe(1236);
});
