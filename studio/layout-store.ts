import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { resolve, dirname } from "node:path";

import { isCanvasLayout, isLayoutStore } from "./layout-state";
import type { StudioFile } from "./types";
export function createLayoutHandlers({
  files,
  path = ".studio/layouts.json",
}: {
  files: readonly StudioFile[];
  path?: string;
}) {
  const storePath = resolve(process.cwd(), path);
  let pending: Promise<unknown> = Promise.resolve();
  async function read() {
    if (!existsSync(storePath)) return {};
    const value: unknown = JSON.parse(await readFile(storePath, "utf8"));
    if (!isLayoutStore(value)) throw new Error("Invalid layout store");
    return value;
  }
  function key(url: URL) {
    const file = url.searchParams.get("fileId");
    const page = url.searchParams.get("pageId");
    return file &&
      page &&
      files.some((item) => item.id === file) &&
      /^[a-z0-9][a-z0-9-]{0,119}$/u.test(page)
      ? `${file}/${page}`
      : null;
  }
  async function GET(request: Request) {
    const id = key(new URL(request.url));
    if (!id)
      return Response.json({ error: "Invalid file or page" }, { status: 400 });
    try {
      return Response.json((await read())[id] ?? null, {
        headers: { "Cache-Control": "no-store" },
      });
    } catch {
      return Response.json(
        { error: "Could not read layouts" },
        { status: 500 }
      );
    }
  }
  async function PUT(request: Request) {
    const url = new URL(request.url);
    if (
      process.env.NODE_ENV !== "development" ||
      !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
      request.headers.get("origin") !== url.origin
    )
      return Response.json(
        { error: "Layouts can only be saved in the local Studio" },
        { status: 403 }
      );
    const id = key(url);
    if (!id)
      return Response.json({ error: "Invalid file or page" }, { status: 400 });
    let value: unknown;
    try {
      const body = await request.text();
      if (body.length > 250000)
        return Response.json({ error: "Layout too large" }, { status: 413 });
      value = JSON.parse(body);
    } catch {
      return Response.json({ error: "Invalid layout" }, { status: 400 });
    }
    if (!isCanvasLayout(value))
      return Response.json({ error: "Invalid layout" }, { status: 400 });
    const layout = value;
    const save = pending.then(async () => {
      const state = await read();
      const temp = `${storePath}.${randomUUID()}.tmp`;
      await mkdir(dirname(storePath), { recursive: true });
      await writeFile(
        temp,
        JSON.stringify({ ...state, [id]: layout }, null, 2) + "\n"
      );
      await rename(temp, storePath);
    });
    pending = save.catch(() => undefined);
    try {
      await save;
      return Response.json({ saved: true });
    } catch {
      return Response.json({ error: "Could not save layout" }, { status: 500 });
    }
  }
  return { GET, PUT };
}
