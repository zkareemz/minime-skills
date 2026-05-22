import path from "path";
import os from "os";
import { commandExists, anyExists } from "../detect";
import { BaseAdapter, type AgentConfig } from "./base";
import type { Skill } from "../types";

const MINIME_MARKER = "minime: true";

const config: AgentConfig = {
  agentName: "cursor",
  displayName: "Cursor",
  supportsGlobal: false,

  detectInProject: async (projectDir) =>
    anyExists(
      path.join(projectDir, ".cursor"),
      path.join(projectDir, ".cursorrules"),
    ),

  detectOnSystem: async () =>
    commandExists("cursor") ||
    anyExists(
      "/Applications/Cursor.app",
      path.join(
        os.homedir(),
        "AppData",
        "Local",
        "Programs",
        "cursor",
        "Cursor.exe",
      ),
      path.join(os.homedir(), ".cursor"),
    ),

  getGlobalTargetDir: () => null,

  storage: {
    type: "file",
    baseDir: ".cursor/rules",
    extension: ".mdc",
  },

  format: (skill: Skill) => {
    return [
      "---",
      `description: ${skill.meta.description}`,
      "alwaysApply: false",
      MINIME_MARKER,
      "---",
      "",
      skill.content,
      "",
    ].join("\n");
  },

  marker: MINIME_MARKER,
};

export class CursorAdapter extends BaseAdapter {
  constructor() {
    super(config);
  }
}
