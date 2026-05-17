import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "path";
import os from "os";
import fs from "fs-extra";
import { CursorAdapter } from "../../src/adapters/cursor";
import type { Skill } from "../../src/types";

const MOCK_SKILL: Skill = {
  meta: { name: "test-skill", description: "A test skill", version: "1.0.0" },
  content: "# Test Skill\n\nBody content here.",
  sourcePath: "/mock/path/SKILL.md",
};

describe("CursorAdapter", () => {
  let tmpDir: string;
  const adapter = new CursorAdapter();

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "minime-cursor-test-"));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("creates a .mdc file in .cursor/rules/", async () => {
    await adapter.install([MOCK_SKILL], tmpDir);
    const destFile = path.join(tmpDir, ".cursor", "rules", "test-skill.mdc");
    expect(await fs.pathExists(destFile)).toBe(true);
  });

  it("writes valid Cursor MDC frontmatter with minime marker", async () => {
    await adapter.install([MOCK_SKILL], tmpDir);
    const content = await fs.readFile(
      path.join(tmpDir, ".cursor", "rules", "test-skill.mdc"),
      "utf8",
    );
    expect(content).toContain("description: A test skill");
    expect(content).toContain("alwaysApply: false");
    expect(content).toContain("minime: true");
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

  it("installs multiple skills as separate .mdc files", async () => {
    const second: Skill = {
      ...MOCK_SKILL,
      meta: { ...MOCK_SKILL.meta, name: "another-skill" },
    };
    await adapter.install([MOCK_SKILL, second], tmpDir);
    const rulesDir = path.join(tmpDir, ".cursor", "rules");
    const files = await fs.readdir(rulesDir);
    expect(files).toContain("test-skill.mdc");
    expect(files).toContain("another-skill.mdc");
  });
});
