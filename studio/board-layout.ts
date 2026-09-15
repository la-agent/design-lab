export type BoardPosition = { row: number; column: number };
export type BoardSlot = BoardPosition & {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

export function dropBoard(
  positions: Record<string, BoardPosition>,
  slots: BoardSlot[],
  id: string,
  left: number,
  top: number
): Record<string, BoardPosition> {
  const origin = positions[id];
  const [firstSlot] = slots;
  if (!origin || !firstSlot) {
    return positions;
  }
  let nearestRow = firstSlot;
  for (const slot of slots) {
    if (Math.abs(slot.top - top) < Math.abs(nearestRow.top - top)) {
      nearestRow = slot;
    }
  }
  if (nearestRow.row !== origin.row) {
    const rows = [
      ...new Set(Object.values(positions).map((position) => position.row)),
    ].sort((a, b) => a - b);
    const destination = rows.indexOf(nearestRow.row);
    const reordered = rows.filter((row) => row !== origin.row);
    reordered.splice(destination, 0, origin.row);
    return Object.fromEntries(
      Object.entries(positions).map(([boardId, position]) => [
        boardId,
        { ...position, row: reordered.indexOf(position.row) + 1 },
      ])
    );
  }
  const siblings = slots
    .filter((slot) => slot.row === origin.row)
    .sort((a, b) => a.column - b.column);
  let destination = 0;
  let distance = Number.POSITIVE_INFINITY;
  for (let index = 0; index < siblings.length; index += 1) {
    const slot = siblings[index];
    if (slot && Math.abs(slot.left - left) < distance) {
      destination = index;
      distance = Math.abs(slot.left - left);
    }
  }
  const reordered = siblings.filter((slot) => slot.id !== id);
  const source = slots.find((slot) => slot.id === id);
  if (!source) {
    return positions;
  }
  reordered.splice(destination, 0, source);
  const next = { ...positions };
  for (const [index, slot] of reordered.entries()) {
    next[slot.id] = { row: origin.row, column: index + 1 };
  }
  return next;
}
