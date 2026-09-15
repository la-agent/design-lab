import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { isDesignDecisions, isFavoriteInput } from "./design-decisions";
import { isLocalStudioWrite } from "./local-write";
import type { StudioFile } from "./types";

export function createDecisionHandlers({
  files,
  path = ".studio/decisions.json",
}: {
  files: readonly StudioFile[];
  path?: string;
}) {
  const storePath = resolve(process.cwd(), path);
  let pending: Promise<unknown> = Promise.resolve();
  async function GET() {
    try {
      return Response.json(await readDecisions(), {
        headers: { "Cache-Control": "no-store" },
      });
    } catch {
      return Response.json(
        { error: "Could not read design decisions." },
        { status: 500 }
      );
    }
  }

  async function PUT(request: Request) {
    if (!isLocalStudioWrite(request)) {
      return Response.json(
        { error: "Favorites can only be saved in the local Studio." },
        { status: 403 }
      );
    }
    let input: unknown;
    try {
      const body = await request.text();
      if (body.length > 4096) {
        return Response.json({ error: "Decision too large." }, { status: 413 });
      }
      input = JSON.parse(body);
    } catch {
      return Response.json({ error: "Invalid decision." }, { status: 400 });
    }
    if (
      !isFavoriteInput(input) ||
      !files.some((file) => file.id === input.fileId)
    ) {
      return Response.json({ error: "Invalid decision." }, { status: 400 });
    }
    const favorite = input;
    const save = pending.then(async () => {
      const decisions = await readDecisions();
      const index = decisions.findIndex(
        (item) =>
          item.fileId === favorite.fileId &&
          item.pageId === favorite.pageId &&
          item.boardId === favorite.boardId
      );
      const previous = decisions[index];
      const decision = {
        fileId: favorite.fileId,
        pageId: favorite.pageId,
        boardId: favorite.boardId,
        title: favorite.title,
        source: favorite.source,
        favorite: favorite.favorite,
        updatedAt: new Date().toISOString(),
        reason:
          previous?.reason ??
          "Favorited in Studio; rationale not yet recorded.",
        useFor: previous?.useFor ?? "",
        assembledIn: previous?.assembledIn ?? null,
      };
      if (index === -1) {
        decisions.push(decision);
      } else {
        decisions[index] = decision;
      }
      const temporary = `${storePath}.${randomUUID()}.tmp`;
      await mkdir(dirname(storePath), { recursive: true });
      await writeFile(temporary, `${JSON.stringify(decisions, null, 2)}\n`);
      await rename(temporary, storePath);
      return decisions;
    });
    pending = save.catch(() => undefined);
    try {
      return Response.json(await save);
    } catch {
      return Response.json(
        { error: "Could not save favorite. Please retry." },
        { status: 500 }
      );
    }
  }

  return { GET, PUT };

  async function readDecisions() {
    if (!existsSync(storePath)) return [];
    const value: unknown = JSON.parse(await readFile(storePath, "utf-8"));
    if (!isDesignDecisions(value)) {
      throw new Error("Invalid design decisions file");
    }
    return value;
  }
}
