"use client";
import { useCallback, useEffect, useRef, useState } from "react";

import { fileForPath } from "./files";
import { useStudioWorkspace } from "./LabShell";
import { isCanvasLayout } from "./layout-state";
import type { CanvasLayout } from "./layout-state";
export function useStoredLayout(pageId: string) {
  const { files } = useStudioWorkspace();
  const [initial, setInitial] = useState<CanvasLayout | null | undefined>(
    undefined
  );
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const endpoint = useRef("");
  const last = useRef("");
  const baseline = useRef(false);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    const file = fileForPath(window.location.pathname, files);
    if (!file) {
      setInitial(null);
      return;
    }
    const url = `/api/layouts?fileId=${encodeURIComponent(file.id)}&pageId=${encodeURIComponent(pageId)}`;
    endpoint.current = url;
    let disposed = false;
    void fetch(url, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const value: unknown = await response.json();
        if (value !== null && !isCanvasLayout(value)) throw new Error();
        if (!disposed) {
          last.current = JSON.stringify(value);
          setInitial(value);
          setError("");
        }
      })
      .catch(() => {
        if (!disposed) setError("Could not load the saved layout.");
      });
    return () => {
      disposed = true;
    };
  }, [files, pageId, retry]);
  const save = useCallback((layout: CanvasLayout) => {
    const json = JSON.stringify(layout);
    if (!baseline.current) {
      baseline.current = true;
      last.current = json;
      return;
    }
    if (!endpoint.current || json === last.current) return;
    last.current = json;
    const url = endpoint.current;
    queue.current = queue.current.then(async () => {
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: json,
          keepalive: true,
        });
        if (!response.ok) throw new Error();
        setError("");
      } catch {
        last.current = "";
        setError("Layout was not saved. Make another change to retry.");
      }
    });
  }, []);
  return { initial, error, save, retry: () => setRetry((value) => value + 1) };
}
