import type { BoardSize } from "./ResolutionControls";
import type { CanvasPage } from "./types";
import type { BoardDelta } from "./useBoardGesture";

export function canvasRows(
  page: CanvasPage,
  breaks: Record<string, boolean> = {}
) {
  const rows: { boards: CanvasPage["boards"] }[] = [{ boards: [] }];
  for (const board of page.boards) {
    if ((breaks[board.id] ?? board.newRow) && rows.at(-1)?.boards.length) {
      rows.push({ boards: [] });
    }
    rows.at(-1)?.boards.push(board);
  }
  return rows;
}
export function alignBoards(
  page: CanvasPage,
  sizes: Record<string, BoardSize>,
  _tags: Record<string, string>,
  breaks: Record<string, boolean> = {}
) {
  const positions: Record<string, BoardDelta> = {};
  let y = 0;
  for (const row of canvasRows(page, breaks)) {
    let x = 0;
    let height = 0;
    for (const board of row.boards) {
      const size = sizes[board.id];
      if (!size) {
        continue;
      }
      positions[board.id] = { x, y };
      x += size.width + 64;
      height = Math.max(height, (size.maxHeight ?? size.height) + 240);
    }
    y += height + 96;
  }
  return positions;
}
