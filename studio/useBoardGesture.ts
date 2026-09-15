import { useRef } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

export type BoardDelta = { x: number; y: number };

export function useBoardGesture({
  zoom,
  onPreview,
  onCommit,
}: {
  zoom: number;
  onPreview: (delta: BoardDelta | null) => void;
  onCommit: (delta: BoardDelta) => void;
}) {
  const origin = useRef<{ x: number; y: number; pointerId: number } | null>(
    null
  );
  function cancel() {
    origin.current = null;
    onPreview(null);
  }
  function delta(event: PointerEvent<HTMLButtonElement>) {
    const start = origin.current;
    if (!start || start.pointerId !== event.pointerId) {
      return null;
    }
    return {
      x: (event.clientX - start.x) / zoom,
      y: (event.clientY - start.y) / zoom,
    };
  }
  return {
    onPointerDown(event: PointerEvent<HTMLButtonElement>) {
      if (event.button !== 0) {
        return;
      }
      event.preventDefault();
      event.currentTarget.focus({ preventScroll: true });
      event.currentTarget.setPointerCapture(event.pointerId);
      origin.current = {
        x: event.clientX,
        y: event.clientY,
        pointerId: event.pointerId,
      };
    },
    onPointerMove(event: PointerEvent<HTMLButtonElement>) {
      const next = delta(event);
      if (next) {
        onPreview(next);
      }
    },
    onPointerUp(event: PointerEvent<HTMLButtonElement>) {
      const next = delta(event);
      if (!next) {
        return;
      }
      if (Math.hypot(next.x, next.y) * zoom > 3) {
        onCommit(next);
      }
      cancel();
      event.currentTarget.releasePointerCapture(event.pointerId);
    },
    onPointerCancel: cancel,
    onLostPointerCapture: cancel,
    onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
      if (event.key === "Escape") {
        event.preventDefault();
        cancel();
      }
    },
    onBlur: cancel,
  };
}
