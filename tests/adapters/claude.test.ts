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

  it("adds an @import line to CLAUDE.md", async () => {
    await adapter.install([MOCK_SKILL], tmpDir);
    const claudeMd = path.join(tmpDir, "CLAUDE.md");
    expect(await fs.pathExists(claudeMd)).toBe(true);
    const content = await fs.readFile(claudeMd, "utf8");
    expect(content).toContain("@.claude/skills/test-skill/SKILL.md");
  });

  it("does not duplicate the @import line in CLAUDE.md", async () => {
    await adapter.install([MOCK_SKILL], tmpDir);
    await adapter.install([MOCK_SKILL], tmpDir);
    const claudeMd = await fs.readFile(path.join(tmpDir, "CLAUDE.md"), "utf8");
    const count = (
      claudeMd.match(/@\.claude\/skills\/test-skill\/SKILL\.md/g) ?? []
    ).length;
    expect(count).toBe(1);
  });

  it("appends to an existing CLAUDE.md without removing existing content", async () => {
    await fs.writeFile(path.join(tmpDir, "CLAUDE.md"), "# Existing content\n");
    await adapter.install([MOCK_SKILL], tmpDir);
    const content = await fs.readFile(path.join(tmpDir, "CLAUDE.md"), "utf8");
    expect(content).toContain("# Existing content");
    expect(content).toContain("@.claude/skills/test-skill/SKILL.md");
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
    const claudeMd = await fs.readFile(path.join(tmpDir, "CLAUDE.md"), "utf8");
    expect(claudeMd).toContain("@.claude/skills/ns-test-skill/SKILL.md");
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

    it("adds @skills/<name>/SKILL.md import to CLAUDE.md for global install", async () => {
      await adapter.install([MOCK_SKILL], tmpDir, "global");
      const claudeMd = path.join(tmpDir, "CLAUDE.md");
      expect(await fs.pathExists(claudeMd)).toBe(true);
      const content = await fs.readFile(claudeMd, "utf8");
      expect(content).toContain("@skills/test-skill/SKILL.md");
      expect(content).not.toContain("@.claude/skills/test-skill/SKILL.md");
    });
  });
});
