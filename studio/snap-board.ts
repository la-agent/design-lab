import type { BoardDelta } from "./useBoardGesture";

export type SnapRect = BoardDelta & { width: number; height: number };
export type SnapResult = { delta: BoardDelta; x?: number; y?: number };

export function snapBoard(
  board: SnapRect,
  delta: BoardDelta,
  slot: BoardDelta,
  others: SnapRect[],
  zoom: number
): SnapResult {
  const threshold = 8 / zoom;
  const x = snapAxis(
    board.x + delta.x,
    board.width,
    slot.x,
    others.map((rect) => [rect.x, rect.width]),
    threshold
  );
  const y = snapAxis(
    board.y + delta.y,
    board.height,
    slot.y,
    others.map((rect) => [rect.y, rect.height]),
    threshold
  );
  return {
    delta: { x: x.position - board.x, y: y.position - board.y },
    x: x.guide,
    y: y.guide,
  };
}

function snapAxis(
  position: number,
  size: number,
  slot: number,
  others: number[][],
  threshold: number
) {
  if (Math.abs(position - slot) <= threshold) {
    return { position: slot, guide: slot };
  }
  let distance = threshold;
  let result: { position: number; guide?: number } = { position };
  for (const [start = 0, length = 0] of others) {
    for (const target of [start, start + length / 2, start + length]) {
      for (const anchor of [0, size / 2, size]) {
        const adjustment = target - (position + anchor);
        if (Math.abs(adjustment) < distance) {
          distance = Math.abs(adjustment);
          result = { position: position + adjustment, guide: target };
        }
      }
    }
  }
  return result;
}
