import type { StudioFile } from "./types";
export type StudioFileTab = { id: StudioFile["id"]; href: string };

export function defaultFilePath(file: StudioFile) {
  return `${file.href}/${file.final ? "final" : "exploration"}`;
}

export function fileForPath(path: string, files: readonly StudioFile[]) {
  return files.find(
    (file) =>
      path === file.href ||
      path === `${file.href}/exploration` ||
      path === `${file.href}/final` ||
      path === `${file.href}/explore`
  );
}

export function parseTabs(
  value: string | null,
  files: readonly StudioFile[]
): StudioFileTab[] {
  try {
    const parsed: unknown = JSON.parse(value ?? "[]");
    if (!Array.isArray(parsed)) {
      return [];
    }
    const tabs: StudioFileTab[] = [];
    for (const item of parsed) {
      if (
        typeof item !== "object" ||
        item === null ||
        !("href" in item) ||
        typeof item.href !== "string"
      ) {
        continue;
      }
      const file = fileForPath(item.href, files);
      if (file && !tabs.some((tab) => tab.id === file.id)) {
        tabs.push({ id: file.id, href: item.href });
      }
    }
    return tabs;
  } catch {
    return [];
  }
}
