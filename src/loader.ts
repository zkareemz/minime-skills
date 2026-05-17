import path from "path";
import { existsSync } from "fs";
import fs from "fs-extra";
import matter from "gray-matter";
import type { Skill, SkillMeta } from "./types";

function resolveSkillsDir(): string {
  // When compiled to dist/src/, go up two levels to reach the package root.
  // When run via tsx from src/, go up one level.
  const fromDist = path.join(__dirname, "..", "..", "skills");
  if (existsSync(fromDist)) return fromDist;
  return path.join(__dirname, "..", "skills");
}

export const DEFAULT_SKILLS_DIR = resolveSkillsDir();

export async function loadSkills(
  skillsDir = DEFAULT_SKILLS_DIR,
): Promise<Skill[]> {
  const entries = await fs.readdir(skillsDir, { withFileTypes: true });
  const skills: Skill[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillFile = path.join(skillsDir, entry.name, "SKILL.md");
    if (!(await fs.pathExists(skillFile))) continue;

    const raw = await fs.readFile(skillFile, "utf8");
    const { data, content } = matter(raw);

    if (!data.name || !data.description) {
      throw new Error(
        `Invalid SKILL.md at ${skillFile}: missing required fields 'name' and 'description'`,
      );
    }

    skills.push({
      meta: data as SkillMeta,
      content: content.trim(),
      sourcePath: skillFile,
    });
  }

  return skills;
}

export async function loadSkill(
  name: string,
  skillsDir = DEFAULT_SKILLS_DIR,
): Promise<Skill | undefined> {
  const skills = await loadSkills(skillsDir);
  return skills.find((s) => s.meta.name === name);
}
