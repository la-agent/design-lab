"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

type Change = { undo: () => void; redo: () => void; label: string };
type Entry = { changes: Change[]; label: string };
type History = {
  record: (change: Change) => void;
  undo: () => void;
  redo: () => void;
  undoLabel?: string;
  redoLabel?: string;
};
const Context = createContext<History | null>(null);

export function CanvasHistory({ children }: { children: ReactNode }) {
  const past = useRef<Entry[]>([]);
  const future = useRef<Entry[]>([]);
  const pending = useRef<Change[]>([]);
  const [, refresh] = useState(0);
  function flush() {
    const changes = pending.current;
    if (!changes.length) {
      return;
    }
    past.current.push({ changes, label: changes[0]?.label ?? "Change" });
    if (past.current.length > 100) {
      past.current.shift();
    }
    pending.current = [];
    future.current = [];
    refresh((value) => value + 1);
  }
  function record(change: Change) {
    pending.current.push(change);
    if (pending.current.length === 1) {
      queueMicrotask(flush);
    }
  }
  function undo() {
    flush();
    const entry = past.current.pop();
    if (!entry) {
      return;
    }
    for (const change of [...entry.changes].toReversed()) {
      change.undo();
    }
    future.current.push(entry);
    refresh((value) => value + 1);
  }
  function redo() {
    flush();
    const entry = future.current.pop();
    if (!entry) {
      return;
    }
    for (const change of entry.changes) {
      change.redo();
    }
    past.current.push(entry);
    refresh((value) => value + 1);
  }
  return (
    <Context
      value={{
        record,
        undo,
        redo,
        undoLabel: past.current.at(-1)?.label,
        redoLabel: future.current.at(-1)?.label,
      }}
    >
      {children}
    </Context>
  );
}

export function useCanvasHistory() {
  const history = useContext(Context);
  if (!history) {
    throw new Error("Canvas history requires a provider");
  }
  return history;
}

export function useUndoState<T>(
  initial: T | (() => T),
  label = "Change design state"
): [T, Dispatch<SetStateAction<T>>] {
  const history = useContext(Context);
  const [value, setValue] = useState(initial);
  const current = useRef(value);
  const historyRef = useRef(history);
  historyRef.current = history;
  const update = useCallback(
    (action: SetStateAction<T>) => {
      const previous = current.current;
      const next =
        typeof action === "function"
          ? (action as (value: T) => T)(previous)
          : action;
      if (Object.is(previous, next)) {
        return;
      }
      function apply(state: T) {
        current.current = state;
        setValue(state);
      }
      apply(next);
      historyRef.current?.record({
        label,
        undo: () => apply(previous),
        redo: () => apply(next),
      });
    },
    [label]
  );
  return [value, update];
}

export function CanvasHistoryRelay({ children }: { children: ReactNode }) {
  const interacting = useRef(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function interaction() {
      interacting.current = true;
      clearTimeout(timer);
      timer = setTimeout(() => {
        interacting.current = false;
      }, 0);
    }
    const events = [
      "click",
      "input",
      "change",
      "keydown",
      "pointerdown",
      "pointerup",
    ];
    for (const name of events) {
      document.addEventListener(name, interaction, true);
    }
    return () => {
      clearTimeout(timer);
      for (const name of events) {
        document.removeEventListener(name, interaction, true);
      }
    };
  }, []);
  return (
    <Context
      value={{
        record: (change) => {
          if (interacting.current) {
            window.dispatchEvent(
              new CustomEvent("design-history-change", { detail: change })
            );
          }
        },
        undo: () =>
          window.parent.dispatchEvent(
            new KeyboardEvent("keydown", { code: "KeyZ", ctrlKey: true })
          ),
        redo: () =>
          window.parent.dispatchEvent(
            new KeyboardEvent("keydown", {
              code: "KeyZ",
              ctrlKey: true,
              shiftKey: true,
            })
          ),
      }}
    >
      {children}
    </Context>
  );
}
