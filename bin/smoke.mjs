import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";

import { syncWorkspace } from "./sync.mjs";
const port = 4298;
const base = `http://127.0.0.1:${port}`;
const files = syncWorkspace();
try {
  await fetch(base, { signal: AbortSignal.timeout(500) });
  throw new Error(
    `Port ${port} is already in use; stop its owner or choose another smoke-test port.`
  );
} catch (error) {
  if (error.message.includes("already in use")) throw error;
}
let logs = "";
const server = spawn(
  process.execPath,
  ["bin/design-lab.mjs", "dev", "--port", String(port)],
  { stdio: ["ignore", "pipe", "pipe"], detached: process.platform !== "win32" }
);
server.stdout.on("data", (chunk) => {
  logs = (logs + chunk).slice(-8000);
});
server.stderr.on("data", (chunk) => {
  logs = (logs + chunk).slice(-8000);
});
async function get(route) {
  const response = await fetch(base + route, {
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`${route}: HTTP ${response.status}`);
  return response;
}
try {
  const deadline = Date.now() + 30000;
  let ready = false;
  while (Date.now() < deadline && server.exitCode === null) {
    try {
      await get("/");
      ready = true;
      break;
    } catch {
      await delay(200);
    }
  }
  if (!ready) throw new Error("Dev server did not become ready.");
  for (const file of files) {
    await get(`${file.href}/exploration`);
    for (const board of file.pages.flatMap((page) => page.boards)) {
      const preview = await get(board.preview);
      const html = await preview.text();
      if (board.exportUrl) {
        const output = await get(board.exportUrl);
        if (
          !output.headers.get("content-disposition")?.startsWith("attachment;")
        )
          throw new Error("Missing attachment header");
        if ((await output.text()) !== html)
          throw new Error("Email preview and export differ");
        const plain = await (
          await get(`${board.exportUrl}?format=text`)
        ).text();
        if (!plain.trim()) throw new Error("Empty plain text");
      }
    }
  }
  console.log(
    `Smoke passed: ${files.length} files, every registered preview, and matching email exports.`
  );
} catch (error) {
  console.error(logs);
  throw error;
} finally {
  const exited = once(server, "exit");
  if (server.exitCode === null) {
    if (process.platform === "win32") server.kill("SIGTERM");
    else process.kill(-server.pid, "SIGTERM");
    await Promise.race([exited, delay(5000)]);
  }
}
