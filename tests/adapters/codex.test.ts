import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "path";
import os from "os";
import fs from "fs-extra";
import { CodexAdapter } from "../../src/adapters/codex";
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

describe("CodexAdapter", () => {
  let tmpDir: string;
  const adapter = new CodexAdapter();

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "minime-codex-test-"));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("creates project skills in .agents/skills/<name>/SKILL.md", async () => {
    const results = await adapter.install([MOCK_SKILL], tmpDir, "project");
    const skillFile = path.join(
      tmpDir,
      ".agents",
      "skills",
      "test-skill",
      "SKILL.md",
    );

    expect(results[0]).toEqual({
      skill: "test-skill",
      path: path.join(".agents", "skills", "test-skill", "SKILL.md"),
      action: "created",
    });
    expect(await fs.pathExists(skillFile)).toBe(true);

    const content = await fs.readFile(skillFile, "utf8");
    expect(content).toContain("name: test-skill");
    expect(content).toContain("description: A test skill");
    expect(content).toContain("version: 1.0.0");
    expect(content).toContain("# Test Skill");
  });

  it("uses ~/.agents/skills as the global skill location", async () => {
    expect(adapter.getGlobalTargetDir("/home/example")).toBe("/home/example");

    await adapter.install([MOCK_SKILL], tmpDir, "global");
    expect(
      await fs.pathExists(
        path.join(tmpDir, ".agents", "skills", "test-skill", "SKILL.md"),
      ),
    ).toBe(true);
  });

  it("uses a flat hyphenated directory for namespaced skill names", async () => {
    await adapter.install([NAMESPACED_SKILL], tmpDir, "project");
    const flat = path.join(
      tmpDir,
      ".agents",
      "skills",
      "ns-test-skill",
      "SKILL.md",
    );
    const nested = path.join(
      tmpDir,
      ".agents",
      "skills",
      "ns",
      "test-skill",
      "SKILL.md",
    );

    expect(await fs.pathExists(flat)).toBe(true);
    expect(await fs.pathExists(nested)).toBe(false);
  });

  it("returns action=skipped on second install with identical content", async () => {
    await adapter.install([MOCK_SKILL], tmpDir, "project");
    const results = await adapter.install([MOCK_SKILL], tmpDir, "project");

    expect(results[0].action).toBe("skipped");
  });

  it("detects installed minime skills", async () => {
    await adapter.install([MOCK_SKILL], tmpDir, "project");

    expect(await adapter.hasInstalledSkills(tmpDir, "project")).toBe(true);
  });

  it("removes installed skills", async () => {
    await adapter.install([MOCK_SKILL], tmpDir, "project");
    await adapter.uninstall(tmpDir, "project");

    expect(
      await fs.pathExists(
        path.join(tmpDir, ".agents", "skills", "test-skill", "SKILL.md"),
      ),
    ).toBe(false);
  });
});
