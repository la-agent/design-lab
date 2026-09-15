import { canvasRows } from "./auto-layout";
import type { CanvasPage } from "./types";

export type BoardGroup = { name: string; boardIds: string[] };

export function initialBoardGroups(page: CanvasPage): BoardGroup[] {
  return canvasRows(page).map((row, index) => ({
    name:
      row.boards[0]?.groupName ??
      (index === 0 ? page.title : `Group ${index + 1}`),
    boardIds: row.boards.map((board) => board.id),
  }));
}

export function moveToGroup(
  groups: BoardGroup[],
  id: string,
  name: string
): BoardGroup[] {
  const targetName = name.trim();
  const source = groups.find((group) => group.boardIds.includes(id));
  if (!targetName || !source || source.name === targetName) {
    return groups;
  }
  const next = groups.map((group) => ({
    ...group,
    boardIds: group.boardIds.filter((boardId) => boardId !== id),
  }));
  const target = next.find((group) => group.name === targetName);
  if (target) {
    target.boardIds.push(id);
  } else {
    next.push({ name: targetName, boardIds: [id] });
  }
  return next.filter((group) => group.boardIds.length > 0);
}

export function toggleGroupRow(groups: BoardGroup[], id: string): BoardGroup[] {
  const row = groups.findIndex((group) => group.boardIds.includes(id));
  const group = groups[row];
  if (!group) {
    return groups;
  }
  const column = group.boardIds.indexOf(id);
  const previous = groups[row - 1];
  if (column === 0 && previous) {
    return groups.flatMap((item, index) => {
      if (index === row) {
        return [];
      }
      if (index === row - 1) {
        return [{ ...item, boardIds: [...item.boardIds, ...group.boardIds] }];
      }
      return [item];
    });
  }
  if (column === 0) {
    return groups;
  }
  let number = groups.length + 1;
  while (groups.some((item) => item.name === `Group ${number}`)) {
    number += 1;
  }
  return groups.flatMap((item, index) =>
    index === row
      ? [
          { ...item, boardIds: item.boardIds.slice(0, column) },
          { name: `Group ${number}`, boardIds: item.boardIds.slice(column) },
        ]
      : [item]
  );
}
