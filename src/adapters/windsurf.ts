import path from "path";
import os from "os";
import { commandExists, anyExists } from "../detect";
import { BaseAdapter, type AgentConfig } from "./base";
import type { Skill } from "../types";

const MINIME_MARKER = "<!-- minime-managed -->";

const config: AgentConfig = {
  agentName: "windsurf",
  displayName: "Windsurf",
  supportsGlobal: true,

  detectInProject: async (projectDir) =>
    anyExists(path.join(projectDir, ".windsurf")),

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

  getGlobalTargetDir: (homeDir) => homeDir,

  storage: {
    type: "file",
    baseDir: ".windsurf/rules",
    extension: ".md",
  },

  format: (skill: Skill) => {
    return `${MINIME_MARKER}\n\n${skill.content}\n`;
  },

  marker: MINIME_MARKER,
};

export class WindsurfAdapter extends BaseAdapter {
  constructor() {
    super(config);
  }
}
