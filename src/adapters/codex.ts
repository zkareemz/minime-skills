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
    anyExists(path.join(projectDir, "AGENTS.md")),

  detectOnSystem: async () =>
    commandExists("codex") ||
    commandExists("openai") ||
    anyExists(
      path.join(os.homedir(), ".codex"),
      path.join(os.homedir(), "AGENTS.md"),
    ),

  getGlobalTargetDir: (homeDir) => homeDir,

  storage: {
    type: "embedded",
    targetFile: "AGENTS.md",
  },

  format: (skill: Skill) => `## ${skill.meta.name}\n\n${skill.content}`,
};

export class CodexAdapter extends BaseAdapter {
  constructor() {
    super(config);
  }
}
