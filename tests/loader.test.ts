import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "path";
import os from "os";
import fs from "fs-extra";
import { loadSkills, loadSkill } from "../src/loader";

const MOCK_SKILL = `---
name: test-skill
description: A test skill for unit tests
version: 1.0.0
---

# Test Skill

This is the skill body.
`;

async function makeTmpDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "minime-test-"));
}

describe("loadSkills", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTmpDir();
    await fs.mkdirp(path.join(tmpDir, "test-skill"));
    await fs.writeFile(path.join(tmpDir, "test-skill", "SKILL.md"), MOCK_SKILL);
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("loads a skill from the directory", async () => {
    const skills = await loadSkills(tmpDir);
    expect(skills).toHaveLength(1);
    expect(skills[0].meta.name).toBe("test-skill");
    expect(skills[0].meta.description).toBe("A test skill for unit tests");
    expect(skills[0].meta.version).toBe("1.0.0");
  });

  it("populates content without frontmatter", async () => {
    const skills = await loadSkills(tmpDir);
    expect(skills[0].content).toContain("# Test Skill");
    expect(skills[0].content).not.toContain("---");
  });

  it("returns empty array for an empty directory", async () => {
    const empty = await makeTmpDir();
    try {
      const skills = await loadSkills(empty);
      expect(skills).toHaveLength(0);
    } finally {
      await fs.remove(empty);
    }
  });

  it("ignores directories without a SKILL.md", async () => {
    await fs.mkdirp(path.join(tmpDir, "not-a-skill"));
    await fs.writeFile(path.join(tmpDir, "not-a-skill", "README.md"), "# nope");
    const skills = await loadSkills(tmpDir);
    expect(skills).toHaveLength(1);
  });

  it("loads multiple skills", async () => {
    await fs.mkdirp(path.join(tmpDir, "second-skill"));
    await fs.writeFile(
      path.join(tmpDir, "second-skill", "SKILL.md"),
      MOCK_SKILL.replace("test-skill", "second-skill").replace(
        "A test skill for unit tests",
        "Second skill",
      ),
    );
    const skills = await loadSkills(tmpDir);
    expect(skills).toHaveLength(2);
  });
});

describe("loadSkill", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTmpDir();
    await fs.mkdirp(path.join(tmpDir, "test-skill"));
    await fs.writeFile(path.join(tmpDir, "test-skill", "SKILL.md"), MOCK_SKILL);
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("finds a skill by name", async () => {
    const skill = await loadSkill("test-skill", tmpDir);
    expect(skill).toBeDefined();
    expect(skill!.meta.name).toBe("test-skill");
  });

  it("returns undefined for an unknown skill name", async () => {
    const skill = await loadSkill("does-not-exist", tmpDir);
    expect(skill).toBeUndefined();
  });
});
