import fs from "fs-extra";

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
