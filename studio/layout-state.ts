import type { BoardGroup } from "./board-groups";
import type { BoardSize } from "./ResolutionControls";
import type { BoardDelta } from "./useBoardGesture";
export type CanvasLayout = {
  colour: string | null;
  sizes: Record<string, BoardSize>;
  groups: BoardGroup[];
  offsets: Record<string, BoardDelta>;
};
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function number(value: unknown, min: number, max: number): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
  );
}
export function isCanvasLayout(value: unknown): value is CanvasLayout {
  if (
    !record(value) ||
    !(
      value.colour === null ||
      (typeof value.colour === "string" && /^#[\da-f]{6}$/iu.test(value.colour))
    )
  )
    return false;
  if (
    !record(value.sizes) ||
    !Object.values(value.sizes).every(
      (size) =>
        record(size) &&
        number(size.width, 240, 7680) &&
        number(size.height, 1, 1000000) &&
        (size.maxHeight === undefined || number(size.maxHeight, 240, 7680))
    )
  )
    return false;
  if (
    !record(value.offsets) ||
    !Object.values(value.offsets).every(
      (offset) =>
        record(offset) &&
        number(offset.x, -10000000, 10000000) &&
        number(offset.y, -10000000, 10000000)
    )
  )
    return false;
  return (
    Array.isArray(value.groups) &&
    value.groups.every(
      (group) =>
        record(group) &&
        typeof group.name === "string" &&
        group.name.length <= 500 &&
        Array.isArray(group.boardIds) &&
        group.boardIds.every((id) => typeof id === "string" && id.length <= 200)
    )
  );
}
export function isLayoutStore(
  value: unknown
): value is Record<string, CanvasLayout> {
  return record(value) && Object.values(value).every(isCanvasLayout);
}
