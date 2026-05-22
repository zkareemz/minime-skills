import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "path";
import os from "os";
import fs from "fs-extra";
import { ClaudeAdapter } from "../../src/adapters/claude";
import type { Skill } from "../../src/types";

const MOCK_SKILL: Skill = {
  meta: { name: "test-skill", description: "A test skill", version: "1.0.0" },
  content: "# Test Skill\n\nBody.",
  sourcePath: "/mock/path/SKILL.md",
};

const NAMESPACED_SKILL: Skill = {
  meta: { name: "ns:test-skill", description: "A namespaced skill" },
  content: "# NS Skill\n\nBody.",
  sourcePath: "/mock/path/SKILL.md",
};

describe("ClaudeAdapter", () => {
  let tmpDir: string;
  const adapter = new ClaudeAdapter();

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "minime-claude-test-"));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("creates the skill file in .claude/skills/<name>/SKILL.md", async () => {
    await adapter.install([MOCK_SKILL], tmpDir);
    const destFile = path.join(
      tmpDir,
      ".claude",
      "skills",
      "test-skill",
      "SKILL.md",
    );
    expect(await fs.pathExists(destFile)).toBe(true);
    const content = await fs.readFile(destFile, "utf8");
    expect(content).toContain("name: test-skill");
    expect(content).toContain("description: A test skill");
    expect(content).toContain("version: 1.0.0");
    expect(content).toContain("# Test Skill");
  });

  it("returns action=created on first install", async () => {
    const results = await adapter.install([MOCK_SKILL], tmpDir);
    expect(results[0].action).toBe("created");
  });

  it("returns action=skipped on second install with identical content", async () => {
    await adapter.install([MOCK_SKILL], tmpDir);
    const results = await adapter.install([MOCK_SKILL], tmpDir);
    expect(results[0].action).toBe("skipped");
  });

  it("does not create CLAUDE.md imports because Claude discovers skills natively", async () => {
    await adapter.install([MOCK_SKILL], tmpDir);
    expect(await fs.pathExists(path.join(tmpDir, "CLAUDE.md"))).toBe(false);
  });

  it("leaves an existing CLAUDE.md untouched", async () => {
    await fs.writeFile(path.join(tmpDir, "CLAUDE.md"), "# Existing content\n");
    await adapter.install([MOCK_SKILL], tmpDir);
    const content = await fs.readFile(path.join(tmpDir, "CLAUDE.md"), "utf8");
    expect(content).toBe("# Existing content\n");
  });

  it("uses a flat hyphenated directory for namespaced skill names", async () => {
    await adapter.install([NAMESPACED_SKILL], tmpDir);
    const flat = path.join(
      tmpDir,
      ".claude",
      "skills",
      "ns-test-skill",
      "SKILL.md",
    );
    const nested = path.join(
      tmpDir,
      ".claude",
      "skills",
      "ns",
      "test-skill",
      "SKILL.md",
    );
    expect(await fs.pathExists(flat)).toBe(true);
    expect(await fs.pathExists(nested)).toBe(false);
  });

  describe("global install", () => {
    it("places skill file at skills/<name>/SKILL.md inside the global target dir", async () => {
      // Simulate ~/.claude as tmpDir
      await adapter.install([MOCK_SKILL], tmpDir, "global");
      const destFile = path.join(tmpDir, "skills", "test-skill", "SKILL.md");
      expect(await fs.pathExists(destFile)).toBe(true);
      // Should NOT write to the wrong nested path
      const wrongFile = path.join(
        tmpDir,
        ".claude",
        "skills",
        "test-skill",
        "SKILL.md",
      );
      expect(await fs.pathExists(wrongFile)).toBe(false);
    });

    it("does not create CLAUDE.md imports for global install", async () => {
      await adapter.install([MOCK_SKILL], tmpDir, "global");
      expect(await fs.pathExists(path.join(tmpDir, "CLAUDE.md"))).toBe(false);
    });
  });
});
