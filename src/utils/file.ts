import path from "path";
import fs from "fs-extra";

const GITIGNORE_START = "# minime-skills : start";
const GITIGNORE_END = "# minime-skills : end";

const START = (id: string) => `<!-- minime-skill: ${id} -->`;
const END = (id: string) => `<!-- /minime-skill: ${id} -->`;

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Inserts or replaces a named section in a file using HTML comment markers.
 * Idempotent — running twice with the same content returns 'skipped'.
 */
export async function upsertSection(
  filePath: string,
  sectionId: string,
  content: string,
): Promise<"created" | "updated" | "skipped"> {
  const start = START(sectionId);
  const end = END(sectionId);
  const section = `${start}\n${content}\n${end}`;

  if (!(await fs.pathExists(filePath))) {
    await fs.ensureFile(filePath);
    await fs.writeFile(filePath, `${section}\n`, "utf8");
    return "created";
  }

  const existing = await fs.readFile(filePath, "utf8");

  if (existing.includes(start)) {
    const regex = new RegExp(
      `${escapeRegex(start)}[\\s\\S]*?${escapeRegex(end)}`,
      "g",
    );
    const next = existing.replace(regex, section);
    if (next === existing) return "skipped";
    await fs.writeFile(filePath, next, "utf8");
    return "updated";
  }

  const separator = existing.endsWith("\n") ? "\n" : "\n\n";
  await fs.appendFile(filePath, `${separator}${section}\n`, "utf8");
  return "created";
}

/**
 * Returns IDs of all minime-skill sections in the file.
 * If dryRun is false, removes all those sections and deletes the file if it becomes empty.
 */
export async function removeSections(
  filePath: string,
  dryRun = false,
): Promise<string[]> {
  if (!(await fs.pathExists(filePath))) return [];

  const content = await fs.readFile(filePath, "utf8");
  const ids: string[] = [];
  const scanRe = /<!-- minime-skill: (.+?) -->/g;
  let match;
  while ((match = scanRe.exec(content)) !== null) {
    if (!ids.includes(match[1])) ids.push(match[1]);
  }

  if (ids.length === 0 || dryRun) return ids;

  let next = content;
  for (const id of ids) {
    const sectionRe = new RegExp(
      `\n?${escapeRegex(START(id))}[\\s\\S]*?${escapeRegex(END(id))}\n?`,
      "g",
    );
    next = next.replace(sectionRe, "");
  }

  if (next.trim() === "") {
    await fs.remove(filePath);
  } else {
    await fs.writeFile(filePath, next.trimEnd() + "\n", "utf8");
  }

  return ids;
}

/** True if the file contains at least one minime-skill section */
export async function hasAnySections(filePath: string): Promise<boolean> {
  if (!(await fs.pathExists(filePath))) return false;
  const content = await fs.readFile(filePath, "utf8");
  return content.includes("<!-- minime-skill:");
}

/**
 * Add entries to .gitignore wrapped in a minime-managed section.
 * Merges with existing section entries — idempotent.
 */
export async function addToGitignore(
  projectDir: string,
  entries: string[],
): Promise<void> {
  const gitignorePath = path.join(projectDir, ".gitignore");
  const lines = (await fs.pathExists(gitignorePath))
    ? (await fs.readFile(gitignorePath, "utf8")).split("\n")
    : [];

  const startIdx = lines.findIndex((l) => l.trim() === GITIGNORE_START);
  const endIdx = lines.findIndex((l) => l.trim() === GITIGNORE_END);

  // Collect existing entries in the section
  let existing: string[] = [];
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    existing = lines
      .slice(startIdx + 1, endIdx)
      .map((l) => l.trim())
      .filter((l) => l !== "");
  }

  // Merge without duplicates
  const merged = [...existing];
  for (const e of entries) {
    if (!merged.includes(e)) merged.push(e);
  }

  if (merged.length === 0) return;

  const section = [GITIGNORE_START, ...merged, GITIGNORE_END];

  let result: string[];
  if (startIdx !== -1 && endIdx !== -1) {
    result = [
      ...lines.slice(0, startIdx),
      ...section,
      ...lines.slice(endIdx + 1),
    ];
  } else {
    if (lines.length > 0 && lines[lines.length - 1].trim() !== "") {
      result = [...lines, "", ...section];
    } else {
      result = [...lines, ...section];
    }
  }

  // Trim trailing blank lines
  while (result.length > 0 && result[result.length - 1] === "") {
    result.pop();
  }

  await fs.writeFile(gitignorePath, result.join("\n") + "\n", "utf8");
}

/**
 * Remove specific entries from the minime-managed section in .gitignore.
 * If the section becomes empty, it is removed entirely.
 * If the file becomes empty, it is deleted.
 */
export async function removeFromGitignore(
  projectDir: string,
  entries: string[],
): Promise<void> {
  const gitignorePath = path.join(projectDir, ".gitignore");
  if (!(await fs.pathExists(gitignorePath))) return;

  const lines = (await fs.readFile(gitignorePath, "utf8")).split("\n");
  const startIdx = lines.findIndex((l) => l.trim() === GITIGNORE_START);
  const endIdx = lines.findIndex((l) => l.trim() === GITIGNORE_END);
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return;

  const existing = lines
    .slice(startIdx + 1, endIdx)
    .map((l) => l.trim())
    .filter((l) => l !== "");

  const remaining = existing.filter((e) => !entries.includes(e));

  let result: string[];
  if (remaining.length === 0) {
    // Remove the entire section
    result = [...lines.slice(0, startIdx), ...lines.slice(endIdx + 1)];
    // Also remove the blank separator line before the section if present
    if (startIdx > 0 && lines[startIdx - 1].trim() === "") {
      result = [...lines.slice(0, startIdx - 1), ...lines.slice(endIdx + 1)];
    }
  } else {
    const section = [GITIGNORE_START, ...remaining, GITIGNORE_END];
    result = [
      ...lines.slice(0, startIdx),
      ...section,
      ...lines.slice(endIdx + 1),
    ];
  }

  // Trim trailing blank lines
  while (result.length > 0 && result[result.length - 1] === "") {
    result.pop();
  }

  if (result.every((l) => l.trim() === "")) {
    await fs.remove(gitignorePath);
  } else {
    await fs.writeFile(gitignorePath, result.join("\n") + "\n", "utf8");
  }
}
