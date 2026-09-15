import { expect, test } from "vitest";

import {
  initialBoardGroups,
  moveToGroup,
  toggleGroupRow,
} from "./board-groups";
import { onboardingPages } from "./test-fixtures";

const groups = [
  { name: "AI & MCP", boardIds: ["v1", "v2", "v3"] },
  { name: "V2 iterations", boardIds: ["v4", "v5", "v6"] },
];

test("initial groups follow rows, not per-board idea metadata", () => {
  const page = onboardingPages[0];
  if (!page) {
    throw new Error("Missing fixture");
  }
  expect(initialBoardGroups(page)).toEqual([
    { name: page.title, boardIds: page.boards.map((board) => board.id) },
  ]);
});

test("moves a board into the destination row without splitting the old row", () => {
  expect(moveToGroup(groups, "v1", "V2 iterations")).toEqual([
    { name: "AI & MCP", boardIds: ["v2", "v3"] },
    { name: "V2 iterations", boardIds: ["v4", "v5", "v6", "v1"] },
  ]);
  expect(groups[0]?.boardIds).toEqual(["v1", "v2", "v3"]);
});

test("new groups create rows and empty rows disappear", () => {
  const next = moveToGroup(groups, "v1", "New direction");
  expect(next.at(-1)).toEqual({ name: "New direction", boardIds: ["v1"] });
  expect(moveToGroup(next, "v1", "AI & MCP")).toHaveLength(2);
});

test("splitting and joining rows also splits and merges their groups", () => {
  const split = toggleGroupRow(groups, "v2");
  expect(split.map((group) => group.boardIds)).toEqual([
    ["v1"],
    ["v2", "v3"],
    ["v4", "v5", "v6"],
  ]);
  expect(new Set(split.map((group) => group.name)).size).toBe(3);
  expect(toggleGroupRow(split, "v2")).toEqual(groups);
});
