import path from "path";
import os from "os";
import { commandExists, anyExists } from "../detect";
import { BaseAdapter, type AgentConfig } from "./base";
import type { Skill } from "../types";

const config: AgentConfig = {
  agentName: "gemini",
  displayName: "Gemini CLI",
  supportsGlobal: true,

  detectInProject: async (projectDir) => anyExists(path.join(projectDir, ".gemini")),

  detectOnSystem: async () =>
    commandExists("gemini") || anyExists(path.join(os.homedir(), ".gemini")),

  getGlobalTargetDir: (homeDir) => path.join(homeDir, ".gemini"),

  storage: {
    type: "folder",
    baseDir: ".gemini/skills",
    globalBaseDir: "skills",
    namespaceSeparator: "-",
    entryFile: "SKILL.md",
  },

  format: (skill: Skill) => {
    const { name, description, version } = skill.meta;
    const sanitizedName = name.replace(":", "-");
    const lines = ["---", `name: ${sanitizedName}`, `description: ${description}`];
    if (version) lines.push(`version: ${version}`);
    lines.push("---", "", skill.content, "");
    return lines.join("\n");
  },

  imports: {
    file: "GEMINI.md",
    format: (skillPath, isGlobal) =>
      isGlobal
        ? `@skills/${skillPath}/SKILL.md`
        : `@.gemini/skills/${skillPath}/SKILL.md`,
  },
};

export class GeminiAdapter extends BaseAdapter {
  constructor() {
    super(config);
  }
}
