import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "path";
import os from "os";
import fs from "fs-extra";
import { ClaudeAdapter } from "../../src/adapters/claude";

describe("ClaudeAdapter - Legacy Uninstall", () => {
  let tmpDir: string;
  const adapter = new ClaudeAdapter();

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "minime-legacy-uninstall-"),
    );
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("removes legacy flat skill directories and their imports", async () => {
    // Manually set up legacy flat structure
    const legacyDir = path.join(tmpDir, ".claude", "skills", "minime-idea");
    const legacyFile = path.join(legacyDir, "SKILL.md");
    await fs.ensureDir(legacyDir);
    await fs.writeFile(
      legacyFile,
      "---\nname: minime:idea\n---\n# Idea",
      "utf8",
    );

    const claudeMd = path.join(tmpDir, "CLAUDE.md");
    await fs.writeFile(
      claudeMd,
      "@.claude/skills/minime-idea/SKILL.md\n",
      "utf8",
    );

    // Verify setup
    expect(await fs.pathExists(legacyFile)).toBe(true);

    // Uninstall
    const results = await adapter.uninstall(tmpDir, "project");

    // Verify removal
    expect(results.some((r) => r.skill === "minime-idea")).toBe(true);
    expect(await fs.pathExists(legacyDir)).toBe(false);
    expect(await fs.pathExists(claudeMd)).toBe(false); // File should be removed if empty
  });

  it("removes both legacy flat and new hierarchical skills simultaneously", async () => {
    // Setup legacy
    const legacyDir = path.join(tmpDir, ".claude", "skills", "minime-old");
    await fs.ensureDir(legacyDir);
    await fs.writeFile(
      path.join(legacyDir, "SKILL.md"),
      "---\nname: minime:old\n---\n# Old",
      "utf8",
    );

    // Setup new hierarchical
    const newDir = path.join(tmpDir, ".claude", "skills", "minime", "new");
    await fs.ensureDir(newDir);
    await fs.writeFile(
      path.join(newDir, "SKILL.md"),
      "---\nname: minime:new\n---\n# New",
      "utf8",
    );

    const claudeMd = path.join(tmpDir, "CLAUDE.md");
    await fs.writeFile(
      claudeMd,
      "@.claude/skills/minime-old/SKILL.md\n@.claude/skills/minime/new/SKILL.md\n",
      "utf8",
    );

    // Uninstall
    await adapter.uninstall(tmpDir, "project");

    // Verify all removed
    expect(await fs.pathExists(legacyDir)).toBe(false);
    expect(await fs.pathExists(newDir)).toBe(false);
    expect(await fs.pathExists(claudeMd)).toBe(false);
  });
});
