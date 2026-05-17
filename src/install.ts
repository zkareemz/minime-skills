import os from "os";
import { loadSkills, DEFAULT_SKILLS_DIR } from "./loader";
import { adapters, SUPPORTED_AGENTS } from "./adapters";
import type { InstallResult, InstallScope } from "./types";

export interface InstallOptions {
  agent: string;
  targetDir?: string;
  scope?: InstallScope;
  skillName?: string;
  skillsDir?: string;
}

export async function install(opts: InstallOptions): Promise<InstallResult[]> {
  const {
    agent,
    scope = "project",
    skillName,
    skillsDir = DEFAULT_SKILLS_DIR,
  } = opts;

  let skills = await loadSkills(skillsDir);
  if (skillName) {
    skills = skills.filter((s) => s.meta.name === skillName);
    if (skills.length === 0) throw new Error(`Skill not found: ${skillName}`);
  }

  const agentsToInstall =
    agent === "all" ? SUPPORTED_AGENTS : agent.split(",").map((a) => a.trim());
  const results: InstallResult[] = [];

  for (const agentName of agentsToInstall) {
    const adapter = adapters[agentName];
    if (!adapter) {
      throw new Error(
        `Unknown agent: ${agentName}. Supported: ${SUPPORTED_AGENTS.join(", ")}, all`,
      );
    }

    if (scope === "global" && !adapter.supportsGlobal) {
      continue;
    }

    const targetDir =
      opts.targetDir ??
      (scope === "global"
        ? (adapter.getGlobalTargetDir(os.homedir()) ?? process.cwd())
        : process.cwd());

    const agentResults = await adapter.install(skills, targetDir, scope);
    results.push(...agentResults);
  }

  return results;
}
