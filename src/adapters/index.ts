import type { Adapter } from "../types";
import { ClaudeAdapter } from "./claude";
import { CursorAdapter } from "./cursor";
import { CopilotAdapter } from "./copilot";
import { GeminiAdapter } from "./gemini";
import { CodexAdapter } from "./codex";
import { WindsurfAdapter } from "./windsurf";

export const adapters: Record<string, Adapter> = {
  claude: new ClaudeAdapter(),
  cursor: new CursorAdapter(),
  copilot: new CopilotAdapter(),
  gemini: new GeminiAdapter(),
  codex: new CodexAdapter(),
  windsurf: new WindsurfAdapter(),
};

export const SUPPORTED_AGENTS = Object.keys(adapters);
