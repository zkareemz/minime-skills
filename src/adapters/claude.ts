import path from "path";
import os from "os";
import { commandExists, anyExists } from "../detect";
import { BaseAdapter, type AgentConfig } from "./base";
import type { Skill } from "../types";

const config: AgentConfig = {
  agentName: "claude",
  displayName: "Claude Code",
  supportsGlobal: true,

  detectInProject: async (projectDir) =>
    anyExists(
      path.join(projectDir, ".claude"),
      path.join(projectDir, "CLAUDE.md"),
    ),

  detectOnSystem: async () =>
    commandExists("claude") || anyExists(path.join(os.homedir(), ".claude")),

  getGlobalTargetDir: (homeDir) => path.join(homeDir, ".claude"),

  storage: {
    type: "folder",
    baseDir: ".claude/skills",
    entryFile: "SKILL.md",
  },

  format: (skill: Skill) => {
    const { name, description, version } = skill.meta;
    const lines = ["---", `name: ${name}`, `description: ${description}`];
    if (version) lines.push(`version: ${version}`);
    lines.push("---", "", skill.content, "");
    return lines.join("\n");
  },

  imports: {
    file: "CLAUDE.md",
    format: (skillPath, isGlobal) =>
      isGlobal
        ? `@skills/${skillPath}/SKILL.md`
        : `@.claude/skills/${skillPath}/SKILL.md`,
  },
};

export class ClaudeAdapter extends BaseAdapter {
  constructor() {
    super(config);
  }
}
