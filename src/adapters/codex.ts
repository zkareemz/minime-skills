import path from "path";
import os from "os";
import { commandExists, anyExists } from "../detect";
import { BaseAdapter, type AgentConfig } from "./base";
import type { Skill } from "../types";

const config: AgentConfig = {
  agentName: "codex",
  displayName: "OpenAI Codex",
  supportsGlobal: true,

  detectInProject: async (projectDir) =>
    anyExists(
      path.join(projectDir, ".agents", "skills"),
      path.join(projectDir, "AGENTS.md"),
    ),

  detectOnSystem: async () =>
    commandExists("codex") ||
    commandExists("openai") ||
    anyExists(
      path.join(os.homedir(), ".codex"),
      path.join(os.homedir(), ".agents", "skills"),
    ),

  getGlobalTargetDir: (homeDir) => homeDir,

  storage: {
    type: "folder",
    baseDir: ".agents/skills",
    globalBaseDir: ".agents/skills",
    namespaceSeparator: "-",
    entryFile: "SKILL.md",
  },

  format: (skill: Skill) => {
    const { name, description, version } = skill.meta;
    const sanitizedName = name.replace(":", "-");
    const lines = [
      "---",
      `name: ${sanitizedName}`,
      `description: ${description}`,
    ];
    if (version) lines.push(`version: ${version}`);
    lines.push("---", "", skill.content, "");
    return lines.join("\n");
  },
};

export class CodexAdapter extends BaseAdapter {
  constructor() {
    super(config);
  }
}
