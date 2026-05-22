import path from "path";
import os from "os";
import { commandExists, anyExists } from "../detect";
import { BaseAdapter, type AgentConfig } from "./base";
import type { Skill } from "../types";

const config: AgentConfig = {
  agentName: "windsurf",
  displayName: "Windsurf",
  supportsGlobal: true,

  detectInProject: async (projectDir) =>
    anyExists(
      path.join(projectDir, ".windsurf", "skills"),
      path.join(projectDir, ".agents", "skills"),
      path.join(projectDir, ".windsurf", "rules"),
    ),

  detectOnSystem: async () =>
    commandExists("windsurf") ||
    anyExists(
      "/Applications/Windsurf.app",
      path.join(
        os.homedir(),
        "AppData",
        "Local",
        "Programs",
        "windsurf",
        "Windsurf.exe",
      ),
      path.join(os.homedir(), ".codeium"),
    ),

  getGlobalTargetDir: (homeDir) => path.join(homeDir, ".codeium", "windsurf"),

  storage: {
    type: "folder",
    baseDir: ".windsurf/skills",
    globalBaseDir: "skills",
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

export class WindsurfAdapter extends BaseAdapter {
  constructor() {
    super(config);
  }
}
