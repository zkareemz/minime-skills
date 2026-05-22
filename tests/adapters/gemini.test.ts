import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "path";
import os from "os";
import fs from "fs-extra";
import { GeminiAdapter } from "../../src/adapters/gemini";
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

describe("GeminiAdapter", () => {
  let tmpDir: string;
  const adapter = new GeminiAdapter();

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "minime-gemini-test-"));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("creates the skill file at a flat path .gemini/skills/<name>/SKILL.md", async () => {
    await adapter.install([MOCK_SKILL], tmpDir);
    const destFile = path.join(
      tmpDir,
      ".gemini",
      "skills",
      "test-skill",
      "SKILL.md",
    );
    expect(await fs.pathExists(destFile)).toBe(true);
  });

  it("uses a flat hyphenated directory for namespaced skill names", async () => {
    await adapter.install([NAMESPACED_SKILL], tmpDir);
    const flat = path.join(
      tmpDir,
      ".gemini",
      "skills",
      "ns-test-skill",
      "SKILL.md",
    );
    const nested = path.join(
      tmpDir,
      ".gemini",
      "skills",
      "ns",
      "test-skill",
      "SKILL.md",
    );
    expect(await fs.pathExists(flat)).toBe(true);
    expect(await fs.pathExists(nested)).toBe(false);
  });

  it("writes frontmatter + content to the skill file", async () => {
    await adapter.install([MOCK_SKILL], tmpDir);
    const content = await fs.readFile(
      path.join(tmpDir, ".gemini", "skills", "test-skill", "SKILL.md"),
      "utf8",
    );
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

  it("does not create GEMINI.md imports because Gemini discovers skills natively", async () => {
    await adapter.install([MOCK_SKILL], tmpDir);
    expect(await fs.pathExists(path.join(tmpDir, "GEMINI.md"))).toBe(false);
  });

  it("leaves an existing GEMINI.md untouched", async () => {
    await fs.writeFile(path.join(tmpDir, "GEMINI.md"), "# Existing content\n");
    await adapter.install([MOCK_SKILL], tmpDir);
    const content = await fs.readFile(path.join(tmpDir, "GEMINI.md"), "utf8");
    expect(content).toBe("# Existing content\n");
  });
});

describe("GeminiAdapter.uninstall", () => {
  let tmpDir: string;
  const adapter = new GeminiAdapter();

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "minime-gemini-uninstall-"),
    );
    await adapter.install([MOCK_SKILL], tmpDir, "project");
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("dry-run returns files to remove without touching disk", async () => {
    const results = await adapter.uninstall(tmpDir, "project", true);
    expect(results).toHaveLength(1);
    expect(results[0].action).toBe("removed");
    expect(
      await fs.pathExists(
        path.join(tmpDir, ".gemini", "skills", "test-skill", "SKILL.md"),
      ),
    ).toBe(true);
  });

  it("removes the skill file", async () => {
    await adapter.uninstall(tmpDir, "project");
    expect(
      await fs.pathExists(
        path.join(tmpDir, ".gemini", "skills", "test-skill", "SKILL.md"),
      ),
    ).toBe(false);
  });

  it("does not create GEMINI.md during install or uninstall", async () => {
    await adapter.uninstall(tmpDir, "project");
    expect(await fs.pathExists(path.join(tmpDir, "GEMINI.md"))).toBe(false);
  });

  it("hasInstalledSkills returns false after uninstall", async () => {
    await adapter.uninstall(tmpDir, "project");
    expect(await adapter.hasInstalledSkills(tmpDir, "project")).toBe(false);
  });

  it("returns empty when nothing is installed", async () => {
    const empty = await fs.mkdtemp(
      path.join(os.tmpdir(), "minime-gemini-empty-"),
    );
    try {
      const results = await adapter.uninstall(empty, "project");
      expect(results).toHaveLength(0);
    } finally {
      await fs.remove(empty);
    }
  });

  it("preserves non-minime content in GEMINI.md", async () => {
    const geminiMd = path.join(tmpDir, "GEMINI.md");
    await fs.writeFile(geminiMd, "# My own instructions\n");
    await adapter.uninstall(tmpDir, "project");
    expect(await fs.pathExists(geminiMd)).toBe(true);
    const content = await fs.readFile(geminiMd, "utf8");
    expect(content).toContain("# My own instructions");
  });
});
