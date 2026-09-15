export type BoardDirection =
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUp"
  | "ArrowDown";

export function boardNeighbours(
  groups: { boards: { id: string }[] }[],
  id: string
): Partial<Record<BoardDirection, string>> {
  const row = groups.findIndex((group) =>
    group.boards.some((board) => board.id === id)
  );
  const group = groups[row];
  if (!group) {
    return {};
  }
  const column = group.boards.findIndex((board) => board.id === id);
  function vertical(index: number) {
    const boards = groups[index]?.boards;
    return boards?.[Math.min(column, boards.length - 1)]?.id;
  }
  return {
    ArrowLeft: group.boards[column - 1]?.id,
    ArrowRight: group.boards[column + 1]?.id,
    ArrowUp: vertical(row - 1),
    ArrowDown: vertical(row + 1),
  };
}
