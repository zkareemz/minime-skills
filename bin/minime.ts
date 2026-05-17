#!/usr/bin/env node
import os from "os";
import path from "path";
import { readFileSync, existsSync } from "fs";
import {
  intro,
  outro,
  select,
  multiselect,
  confirm,
  spinner,
  log,
  note,
  isCancel,
  cancel,
} from "@clack/prompts";
import { Command } from "commander";
import { loadSkills } from "../src/loader";
import { install } from "../src/install";
import { uninstall } from "../src/uninstall";
import { adapters, SUPPORTED_AGENTS } from "../src/adapters";
import type { Adapter, InstallScope } from "../src/types";

const pkgFile = existsSync(path.join(__dirname, "../../package.json"))
  ? path.join(__dirname, "../../package.json")
  : path.join(__dirname, "../package.json");
const pkgVersion = (
  JSON.parse(readFileSync(pkgFile, "utf8")) as { version: string }
).version;

const program = new Command();

program
  .name("minime-skills")
  .description("Universal AI skills framework")
  .version(pkgVersion);

// ── helpers ───────────────────────────────────────────────────────────────────

function getTargetDir(
  adapter: Adapter,
  scope: InstallScope,
  dirOverride?: string,
): string | null {
  if (scope === "global") {
    if (!adapter.supportsGlobal) return null;
    return adapter.getGlobalTargetDir(os.homedir());
  }
  return dirOverride ?? process.cwd();
}

async function pickScope(): Promise<InstallScope | null> {
  const answer = await select({
    message: "Where do you want to install?",
    options: [
      { value: "project", label: "This project", hint: process.cwd() },
      { value: "global", label: "Global" },
    ],
  });
  if (isCancel(answer)) return null;
  return answer as InstallScope;
}

async function detectAgents(
  allAdapters: Adapter[],
  scope: InstallScope,
  mode: "installed" | "configured",
  dirOverride?: string,
): Promise<Adapter[]> {
  const found: Adapter[] = [];
  for (const adapter of allAdapters) {
    const targetDir = getTargetDir(adapter, scope, dirOverride);
    if (!targetDir) continue;

    const detected =
      mode === "installed"
        ? await adapter.hasInstalledSkills(targetDir, scope)
        : scope === "global"
          ? await adapter.detectOnSystem()
          : await adapter.detectInProject(targetDir);

    if (detected) found.push(adapter);
  }
  return found;
}

async function pickAgents(
  adapters: Adapter[],
  message: string,
): Promise<string[] | null> {
  const answer = await multiselect({
    message,
    options: adapters.map((a) => ({
      value: a.agentName,
      label: a.displayName,
    })),
    required: true,
  });
  if (isCancel(answer)) return null;
  return answer as string[];
}

function printResults(
  results: { action: string; path: string; skill: string }[],
): void {
  for (const r of results) {
    const sym =
      r.action === "skipped" ? "·" : r.action === "created" ? "+" : "~";
    console.log(`  ${sym} [${r.action}] ${r.path}  (${r.skill})`);
  }
  console.log(
    `\nDone. ${results.filter((r) => r.action !== "skipped").length} file(s) written.`,
  );
}

// ── install ───────────────────────────────────────────────────────────────────

program
  .command("install")
  .description("Install skills into your project or globally")
  .option(
    "-a, --agent <agent>",
    `Skip prompts: ${SUPPORTED_AGENTS.join(", ")}, all`,
  )
  .option("-s, --skill <skill>", "Install a specific skill only")
  .option("-g, --global", "Install globally (non-interactive)")
  .option("-d, --dir <dir>", "Target directory")
  .action(async (opts) => {
    if (opts.agent) {
      try {
        const scope: InstallScope = opts.global ? "global" : "project";
        const results = await install({
          agent: opts.agent,
          targetDir: opts.dir,
          scope,
          skillName: opts.skill,
        });
        printResults(results);
      } catch (err) {
        console.error(`Error: ${(err as Error).message}`);
        process.exit(1);
      }
      return;
    }

    intro("minime-skills install");

    const scope = await pickScope();
    if (!scope) {
      cancel("Cancelled.");
      process.exit(0);
    }

    const s = spinner();
    s.start("Detecting agents…");
    const allAdapters = SUPPORTED_AGENTS.map((n) => adapters[n]);
    let detected = await detectAgents(
      allAdapters,
      scope,
      "configured",
      opts.dir,
    );
    s.stop(`Found ${detected.length} agent(s).`);

    if (detected.length === 0) {
      log.warn(
        scope === "global"
          ? "No supported agents detected on this system. Showing all options."
          : "No agent config found in this project. Showing all options.",
      );
      detected = allAdapters.filter(
        (a) => scope === "project" || a.supportsGlobal,
      );
    }

    const selected = await pickAgents(
      detected,
      "Select agents to install for:",
    );
    if (!selected) {
      cancel("Cancelled.");
      process.exit(0);
    }

    const sp = spinner();
    sp.start("Installing skills…");
    try {
      const results = (
        await Promise.all(
          selected.map((a) =>
            install({ agent: a, scope, targetDir: opts.dir }),
          ),
        )
      ).flat();
      sp.stop("Done.");
      for (const r of results.filter((r) => r.action !== "skipped")) {
        log.step(
          `${r.action === "created" ? "+" : "~"} ${r.path}  (${r.skill})`,
        );
      }
      const created = results.filter((r) => r.action === "created").length;
      const updated = results.filter((r) => r.action === "updated").length;
      outro(`${created} created, ${updated} updated.`);
    } catch (err) {
      sp.stop("Failed.");
      log.error((err as Error).message);
      process.exit(1);
    }
  });

// ── uninstall ─────────────────────────────────────────────────────────────────

program
  .command("uninstall")
  .description("Remove all installed skills for selected agents")
  .option(
    "-a, --agent <agent>",
    `Skip prompts: ${SUPPORTED_AGENTS.join(", ")}, all`,
  )
  .option("-g, --global", "Uninstall from global config (non-interactive)")
  .option("-d, --dir <dir>", "Target directory")
  .action(async (opts) => {
    if (opts.agent) {
      try {
        const scope: InstallScope = opts.global ? "global" : "project";
        const results = await uninstall({
          agent: opts.agent,
          targetDir: opts.dir,
          scope,
        });
        for (const r of results) {
          console.log(`  - [${r.action}] ${r.path}  (${r.skill})`);
        }
        console.log(
          `\nDone. ${results.filter((r) => r.action === "removed").length} file(s) removed.`,
        );
      } catch (err) {
        console.error(`Error: ${(err as Error).message}`);
        process.exit(1);
      }
      return;
    }

    intro("minime-skills uninstall");

    const scope = await pickScope();
    if (!scope) {
      cancel("Cancelled.");
      process.exit(0);
    }

    const s = spinner();
    s.start("Detecting installed agents…");
    const allAdapters = SUPPORTED_AGENTS.map((n) => adapters[n]);
    const detected = await detectAgents(
      allAdapters,
      scope,
      "installed",
      opts.dir,
    );
    s.stop(`Found ${detected.length} agent(s) with skills installed.`);

    if (detected.length === 0) {
      log.warn("No agents found with skills installed.");
      outro("Nothing to uninstall.");
      return;
    }

    const selected = await pickAgents(
      detected,
      "Select agents to uninstall from:",
    );
    if (!selected) {
      cancel("Cancelled.");
      process.exit(0);
    }

    const preview = (
      await Promise.all(
        selected.map((agentName) => {
          const adapter = adapters[agentName];
          const targetDir = getTargetDir(adapter, scope, opts.dir)!;
          return adapter.uninstall(targetDir, scope, true);
        }),
      )
    ).flat();

    if (preview.length === 0) {
      log.warn("Nothing to remove.");
      outro("Done.");
      return;
    }

    note(
      preview.map((r) => `  - ${r.path}  (${r.skill})`).join("\n"),
      "Files to be removed",
    );

    const ok = await confirm({ message: "Proceed with removal?" });
    if (isCancel(ok) || !ok) {
      cancel("Aborted.");
      process.exit(0);
    }

    const sp = spinner();
    sp.start("Removing…");
    try {
      const results = (
        await Promise.all(
          selected.map((agentName) => {
            const adapter = adapters[agentName];
            const targetDir = getTargetDir(adapter, scope, opts.dir)!;
            return adapter.uninstall(targetDir, scope, false);
          }),
        )
      ).flat();
      sp.stop("Done.");
      for (const r of results) {
        log.step(`- ${r.path}  (${r.skill})`);
      }
      outro(
        `${results.filter((r) => r.action === "removed").length} file(s) removed.`,
      );
    } catch (err) {
      sp.stop("Failed.");
      log.error((err as Error).message);
      process.exit(1);
    }
  });

// ── list ──────────────────────────────────────────────────────────────────────

program
  .command("list")
  .description("List all available skills")
  .action(async () => {
    try {
      const skills = await loadSkills();
      if (skills.length === 0) {
        console.log("No skills found.");
        return;
      }
      console.log(`\nAvailable skills (${skills.length}):\n`);
      for (const s of skills) {
        const v = s.meta.version ? ` v${s.meta.version}` : "";
        console.log(`  ${s.meta.name}${v}`);
        console.log(`    ${s.meta.description}\n`);
      }
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      process.exit(1);
    }
  });

(async () => {
  if (process.argv.length <= 2) {
    intro("minime-skills");
    const action = await select({
      message: "What would you like to do?",
      options: [
        {
          value: "install",
          label: "Install skills",
          hint: "add skills to your project or globally",
        },
        {
          value: "uninstall",
          label: "Uninstall skills",
          hint: "remove installed skills",
        },
        {
          value: "list",
          label: "List available skills",
          hint: "see all skills bundled in this package",
        },
      ],
    });
    if (isCancel(action)) {
      cancel("Cancelled.");
      process.exit(0);
    }
    process.argv.push(action as string);
  }

  program.parse();
})();
