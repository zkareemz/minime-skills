import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "path";
import os from "os";
import fs from "fs-extra";
import { ClaudeAdapter } from "../../src/adapters/claude";
import { CursorAdapter } from "../../src/adapters/cursor";
import { CopilotAdapter } from "../../src/adapters/copilot";
import { WindsurfAdapter } from "../../src/adapters/windsurf";
import type { Skill } from "../../src/types";

const MOCK_SKILL: Skill = {
  meta: { name: "test-skill", description: "A test skill", version: "1.0.0" },
  content: "# Test Skill\n\nBody.",
  sourcePath: "/mock/SKILL.md",
};

async function makeTmp(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "minime-uninstall-"));
}

// ── Claude ────────────────────────────────────────────────────────────────────

describe("ClaudeAdapter.uninstall", () => {
  let tmpDir: string;
  const adapter = new ClaudeAdapter();

  beforeEach(async () => {
    tmpDir = await makeTmp();
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
        path.join(tmpDir, ".claude", "skills", "test-skill", "SKILL.md"),
      ),
    ).toBe(true);
  });

  it("removes the skill file", async () => {
    await adapter.uninstall(tmpDir, "project");
    expect(
      await fs.pathExists(
        path.join(tmpDir, ".claude", "skills", "test-skill", "SKILL.md"),
      ),
    ).toBe(false);
  });

  it("removes the @import line from CLAUDE.md", async () => {
    await adapter.uninstall(tmpDir, "project");
    const claudeMd = path.join(tmpDir, "CLAUDE.md");
    if (await fs.pathExists(claudeMd)) {
      const content = await fs.readFile(claudeMd, "utf8");
      expect(content).not.toContain("@.claude/skills/test-skill/SKILL.md");
    }
  });

  it("deletes CLAUDE.md if it becomes empty after uninstall", async () => {
    await adapter.uninstall(tmpDir, "project");
    expect(await fs.pathExists(path.join(tmpDir, "CLAUDE.md"))).toBe(false);
  });

  it("hasInstalledSkills returns false after uninstall", async () => {
    await adapter.uninstall(tmpDir, "project");
    expect(await adapter.hasInstalledSkills(tmpDir, "project")).toBe(false);
  });

  it("returns empty when nothing is installed", async () => {
    const empty = await makeTmp();
    try {
      const results = await adapter.uninstall(empty, "project");
      expect(results).toHaveLength(0);
    } finally {
      await fs.remove(empty);
    }
  });
});

// ── Cursor ────────────────────────────────────────────────────────────────────

describe("CursorAdapter.uninstall", () => {
  let tmpDir: string;
  const adapter = new CursorAdapter();

  beforeEach(async () => {
    tmpDir = await makeTmp();
    await adapter.install([MOCK_SKILL], tmpDir, "project");
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("dry-run returns files without removing them", async () => {
    const results = await adapter.uninstall(tmpDir, "project", true);
    expect(results[0].action).toBe("removed");
    expect(
      await fs.pathExists(
        path.join(tmpDir, ".cursor", "rules", "test-skill.mdc"),
      ),
    ).toBe(true);
  });

  it("removes the .mdc file", async () => {
    await adapter.uninstall(tmpDir, "project");
    expect(
      await fs.pathExists(
        path.join(tmpDir, ".cursor", "rules", "test-skill.mdc"),
      ),
    ).toBe(false);
  });

  it("hasInstalledSkills returns false after uninstall", async () => {
    await adapter.uninstall(tmpDir, "project");
    expect(await adapter.hasInstalledSkills(tmpDir, "project")).toBe(false);
  });

  it("does not remove .mdc files that were not created by minime", async () => {
    const userRule = path.join(tmpDir, ".cursor", "rules", "my-own-rule.mdc");
    await fs.writeFile(
      userRule,
      "---\ndescription: My rule\nalwaysApply: true\n---\n\n# Custom\n",
    );
    await adapter.uninstall(tmpDir, "project");
    expect(await fs.pathExists(userRule)).toBe(true);
  });
});

// ── Copilot ───────────────────────────────────────────────────────────────────

describe("CopilotAdapter.uninstall", () => {
  let tmpDir: string;
  const adapter = new CopilotAdapter();

  beforeEach(async () => {
    tmpDir = await makeTmp();
    await adapter.install([MOCK_SKILL], tmpDir, "project");
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("dry-run returns section IDs without modifying the file", async () => {
    const results = await adapter.uninstall(tmpDir, "project", true);
    expect(results[0].skill).toBe("test-skill");
    const content = await fs.readFile(
      path.join(tmpDir, ".github", "copilot-instructions.md"),
      "utf8",
    );
    expect(content).toContain("<!-- minime-skill: test-skill -->");
  });

  it("removes the section from copilot-instructions.md", async () => {
    await adapter.uninstall(tmpDir, "project");
    expect(
      await fs.pathExists(
        path.join(tmpDir, ".github", "copilot-instructions.md"),
      ),
    ).toBe(false);
  });

  it("deletes the file when it becomes empty", async () => {
    await adapter.uninstall(tmpDir, "project");
    expect(
      await fs.pathExists(
        path.join(tmpDir, ".github", "copilot-instructions.md"),
      ),
    ).toBe(false);
  });

  it("preserves non-minime content in the file", async () => {
    const filePath = path.join(tmpDir, ".github", "copilot-instructions.md");
    await fs.appendFile(filePath, "\n# My own instructions\n");
    await adapter.uninstall(tmpDir, "project");
    expect(await fs.pathExists(filePath)).toBe(true);
    const content = await fs.readFile(filePath, "utf8");
    expect(content).toContain("# My own instructions");
    expect(content).not.toContain("<!-- minime-skill:");
  });
});

// ── Windsurf ──────────────────────────────────────────────────────────────────

describe("WindsurfAdapter.uninstall", () => {
  let tmpDir: string;
  const adapter = new WindsurfAdapter();

  beforeEach(async () => {
    tmpDir = await makeTmp();
    await adapter.install([MOCK_SKILL], tmpDir, "project");
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it("dry-run returns files without removing them", async () => {
    const results = await adapter.uninstall(tmpDir, "project", true);
    expect(results[0].action).toBe("removed");
    expect(
      await fs.pathExists(
        path.join(tmpDir, ".windsurf", "rules", "test-skill.md"),
      ),
    ).toBe(true);
  });

  it("removes the .md file", async () => {
    await adapter.uninstall(tmpDir, "project");
    expect(
      await fs.pathExists(
        path.join(tmpDir, ".windsurf", "rules", "test-skill.md"),
      ),
    ).toBe(false);
  });

  it("hasInstalledSkills returns false after uninstall", async () => {
    await adapter.uninstall(tmpDir, "project");
    expect(await adapter.hasInstalledSkills(tmpDir, "project")).toBe(false);
  });

  it("does not remove .md files that were not created by minime", async () => {
    const userRule = path.join(tmpDir, ".windsurf", "rules", "my-own-rule.md");
    await fs.writeFile(
      userRule,
      "# My own Windsurf rule\n\nDo something custom.\n",
    );
    await adapter.uninstall(tmpDir, "project");
    expect(await fs.pathExists(userRule)).toBe(true);
  });
});
