import path from "path";
import { commandExists, anyExists } from "../detect";
import { BaseAdapter, type AgentConfig } from "./base";
import type { Skill } from "../types";

const config: AgentConfig = {
  agentName: "copilot",
  displayName: "GitHub Copilot",
  supportsGlobal: false,

  detectInProject: async (projectDir) =>
    anyExists(path.join(projectDir, ".github", "copilot-instructions.md")),

  detectOnSystem: async () => commandExists("gh"),

  getGlobalTargetDir: () => null,

  storage: {
    type: "embedded",
    targetFile: ".github/copilot-instructions.md",
  },

  format: (skill: Skill) => `## ${skill.meta.name}\n\n${skill.content}`,
};

export class CopilotAdapter extends BaseAdapter {
  constructor() {
    super(config);
  }
}
