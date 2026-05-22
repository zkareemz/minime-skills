import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "path";
import os from "os";
import fs from "fs-extra";
import { WindsurfAdapter } from "../../src/adapters/windsurf";
import type { Skill } from "../../src/types";

const MOCK_SKILL: Skill = {
  meta: { name: "test-skill", description: "A test skill", version: "1.0.0" },
  content: "# Test Skill\n\nBody.",
  sourcePath: "/mock/path/SKILL.md",
};

describe("WindsurfAdapter", () => {
  let tmpDir: string;
  const adapter = new WindsurfAdapter();

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "minime-windsurf-test-"));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("creates workspace skills in .windsurf/skills/<name>/SKILL.md", async () => {
    await adapter.install([MOCK_SKILL], tmpDir, "project");
    const skillFile = path.join(
      tmpDir,
      ".windsurf",
      "skills",
      "test-skill",
      "SKILL.md",
    );

    expect(await fs.pathExists(skillFile)).toBe(true);
    const content = await fs.readFile(skillFile, "utf8");
    expect(content).toContain("name: test-skill");
    expect(content).toContain("description: A test skill");
    expect(content).toContain("version: 1.0.0");
    expect(content).toContain("# Test Skill");
  });

  it("uses ~/.codeium/windsurf/skills for global skills", async () => {
    expect(adapter.getGlobalTargetDir("/home/example")).toBe(
      path.join("/home/example", ".codeium", "windsurf"),
    );

    await adapter.install([MOCK_SKILL], tmpDir, "global");
    expect(
      await fs.pathExists(
        path.join(tmpDir, "skills", "test-skill", "SKILL.md"),
      ),
    ).toBe(true);
  });

  it("returns action=skipped on second install with identical content", async () => {
    await adapter.install([MOCK_SKILL], tmpDir, "project");
    const results = await adapter.install([MOCK_SKILL], tmpDir, "project");

    expect(results[0].action).toBe("skipped");
  });
});
