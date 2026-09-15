import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { createDecisionHandlers } from "./decision-store";
import { createLayoutHandlers } from "./layout-store";
const directories: string[] = [];
afterEach(async () => {
  vi.unstubAllEnvs();
  await Promise.all(
    directories
      .splice(0)
      .map((path) => rm(path, { recursive: true, force: true }))
  );
});
async function setup() {
  const root = await mkdtemp(join(tmpdir(), "design-store-"));
  directories.push(root);
  const files = [{ id: "welcome", title: "Welcome", href: "/files/welcome" }];
  return {
    root,
    decisions: createDecisionHandlers({
      files,
      path: join(root, "decisions.json"),
    }),
    layouts: createLayoutHandlers({ files, path: join(root, "layouts.json") }),
  };
}
function request(
  path: string,
  body: unknown,
  origin = "http://127.0.0.1:4204"
) {
  return new Request(`http://127.0.0.1:4204${path}`, {
    method: "PUT",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
const favorite = {
  fileId: "welcome",
  pageId: "concepts",
  boardId: "welcome-v1",
  title: "V1",
  source: "/files/welcome/exploration",
  favorite: true,
};
const layout = {
  colour: null,
  sizes: {},
  groups: [{ name: "Concepts", boardIds: ["welcome-v1"] }],
  offsets: { "welcome-v1": { x: 200, y: 30 } },
};
describe("local workspace storage", () => {
  it("creates missing files and saves favorites durably", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { root, decisions } = await setup();
    expect(
      (await decisions.PUT(request("/api/design-decisions", favorite))).status
    ).toBe(200);
    expect(
      JSON.parse(await readFile(join(root, "decisions.json"), "utf8"))[0]
        .boardId
    ).toBe("welcome-v1");
  });
  it("rejects cross-origin and production writes", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { decisions, layouts } = await setup();
    expect(
      (
        await decisions.PUT(
          request("/api/design-decisions", favorite, "https://evil.example")
        )
      ).status
    ).toBe(403);
    vi.stubEnv("NODE_ENV", "production");
    expect(
      (
        await layouts.PUT(
          request("/api/layouts?fileId=welcome&pageId=concepts", layout)
        )
      ).status
    ).toBe(403);
  });
  it("keeps different pages during concurrent saves and validates values", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { layouts } = await setup();
    await Promise.all(
      ["concepts", "result"].map((page) =>
        layouts.PUT(
          request(`/api/layouts?fileId=welcome&pageId=${page}`, layout)
        )
      )
    );
    for (const page of ["concepts", "result"])
      expect(
        await (
          await layouts.GET(
            new Request(
              `http://localhost/api/layouts?fileId=welcome&pageId=${page}`
            )
          )
        ).json()
      ).toEqual(layout);
    expect(
      (
        await layouts.PUT(
          request("/api/layouts?fileId=welcome&pageId=concepts", {
            ...layout,
            sizes: { x: { width: -1, height: 10 } },
          })
        )
      ).status
    ).toBe(400);
  });
});
