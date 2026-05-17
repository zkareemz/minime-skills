import os from "os";
import { adapters, SUPPORTED_AGENTS } from "./adapters";
import type { UninstallResult, InstallScope } from "./types";

export interface UninstallOptions {
  agent: string;
  targetDir?: string;
  scope?: InstallScope;
  dryRun?: boolean;
}

export async function uninstall(
  opts: UninstallOptions,
): Promise<UninstallResult[]> {
  const { agent, scope = "project", dryRun = false } = opts;

  const agentsToProcess =
    agent === "all" ? SUPPORTED_AGENTS : agent.split(",").map((a) => a.trim());
  const results: UninstallResult[] = [];

  for (const agentName of agentsToProcess) {
    const adapter = adapters[agentName];
    if (!adapter) {
      throw new Error(
        `Unknown agent: ${agentName}. Supported: ${SUPPORTED_AGENTS.join(", ")}, all`,
      );
    }

    if (scope === "global" && !adapter.supportsGlobal) continue;

    const targetDir =
      opts.targetDir ??
      (scope === "global"
        ? (adapter.getGlobalTargetDir(os.homedir()) ?? process.cwd())
        : process.cwd());

    const agentResults = await adapter.uninstall(targetDir, scope, dryRun);
    results.push(...agentResults);
  }

  return results;
}
