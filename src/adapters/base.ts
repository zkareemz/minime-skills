import path from "path";
import fs from "fs-extra";
import type {
  Adapter,
  Skill,
  InstallResult,
  UninstallResult,
  InstallScope,
} from "../types";
import { upsertSection, removeSections, hasAnySections } from "../utils/file";

export interface AgentConfig {
  agentName: string;
  displayName: string;
  supportsGlobal: boolean;

  // Detection logic
  detectInProject: (projectDir: string) => Promise<boolean>;
  detectOnSystem: () => Promise<boolean>;
  getGlobalTargetDir: (homeDir: string) => string | null;

  // Storage logic
  storage: {
    type: "folder" | "file" | "embedded";
    baseDir?: string; // e.g. ".claude/skills" (relative to project root)
    globalBaseDir?: string; // override baseDir for global scope (relative to getGlobalTargetDir)
    namespaceSeparator?: string; // folder type only: "/" (nested, default) or "-" (flat)
    extension?: string; // e.g. ".mdc"
    entryFile?: string; // e.g. "SKILL.md"
    targetFile?: string; // e.g. "AGENTS.md" (embedded only)
  };

  // Content formatting
  format: (skill: Skill) => string;

  // Import management (optional)
  imports?: {
    file: string; // e.g. "CLAUDE.md"
    format: (skillPath: string, isGlobal: boolean) => string;
  };

  /** Unique marker to identify minime-managed files (non-folder types) */
  marker?: string;
}

export class BaseAdapter implements Adapter {
  constructor(private config: AgentConfig) {}

  get agentName() {
    return this.config.agentName;
  }
  get displayName() {
    return this.config.displayName;
  }
  get supportsGlobal() {
    return this.config.supportsGlobal;
  }

  getGlobalTargetDir(homeDir: string): string | null {
    return this.config.getGlobalTargetDir(homeDir);
  }

  async detectInProject(projectDir: string): Promise<boolean> {
    return this.config.detectInProject(projectDir);
  }

  async detectOnSystem(): Promise<boolean> {
    return this.config.detectOnSystem();
  }

  async hasInstalledSkills(
    targetDir: string,
    scope: InstallScope,
  ): Promise<boolean> {
    const { type, baseDir, targetFile } = this.config.storage;

    if (type === "embedded") {
      return hasAnySections(path.join(targetDir, targetFile!));
    }

    if (type === "file") {
      const dir = path.join(targetDir, baseDir!);
      if (!(await fs.pathExists(dir))) return false;
      const files = await fs.readdir(dir);
      for (const file of files) {
        if (
          this.config.storage.extension &&
          !file.endsWith(this.config.storage.extension)
        )
          continue;
        const content = await fs.readFile(path.join(dir, file), "utf8");
        if (this.config.marker && content.includes(this.config.marker))
          return true;
      }
      return false;
    }

    // folder type
    const skillsBase = this.skillsBase(targetDir, scope);
    const found = await this.findInstalledSkillsInFolder(skillsBase);
    return found.length > 0;
  }

  async install(
    skills: Skill[],
    targetDir: string,
    scope: InstallScope = "project",
  ): Promise<InstallResult[]> {
    const results: InstallResult[] = [];
    const { type, targetFile } = this.config.storage;

    if (type === "embedded") {
      const filePath = path.join(targetDir, targetFile!);
      await fs.ensureDir(path.dirname(filePath));
      for (const skill of skills) {
        const action = await upsertSection(
          filePath,
          skill.meta.name,
          this.config.format(skill),
        );
        results.push({ skill: skill.meta.name, path: targetFile!, action });
      }
      return results;
    }

    const isGlobal = scope === "global";
    const skillsBase = this.skillsBase(targetDir, scope);
    const importFilePath = this.config.imports
      ? path.join(targetDir, this.config.imports.file)
      : null;

    for (const skill of skills) {
      const skillPath = this.nameToPath(skill.meta.name);
      const destFile =
        type === "file"
          ? path.join(
              skillsBase,
              `${skillPath}${this.config.storage.extension}`,
            )
          : path.join(skillsBase, skillPath, this.config.storage.entryFile!);

      await fs.ensureDir(path.dirname(destFile));

      const newContent = this.config.format(skill);
      const exists = await fs.pathExists(destFile);

      const relPath = path.relative(targetDir, destFile);

      let action: "created" | "updated" | "skipped" = "created";

      if (exists) {
        const current = await fs.readFile(destFile, "utf8");
        if (current === newContent) {
          action = "skipped";
        } else {
          await fs.writeFile(destFile, newContent, "utf8");
          action = "updated";
        }
      } else {
        await fs.writeFile(destFile, newContent, "utf8");
        action = "created";
      }

      // Copy additional files (references/, assets/, etc.) from source skill directory
      if (type === "folder") {
        const sourceSkillDir = path.dirname(skill.sourcePath);
        if (await fs.pathExists(sourceSkillDir)) {
          const sourceEntries = await fs.readdir(sourceSkillDir, {
            withFileTypes: true,
          });
          for (const entry of sourceEntries) {
            if (entry.name === this.config.storage.entryFile) continue;
            await fs.copy(
              path.join(sourceSkillDir, entry.name),
              path.join(path.dirname(destFile), entry.name),
              { overwrite: true },
            );
          }
        }
      }

      results.push({ skill: skill.meta.name, path: relPath, action });

      if (this.config.imports && importFilePath) {
        const importLine = this.config.imports.format(skillPath, isGlobal);
        await this.upsertImport(importFilePath, importLine);
      }
    }

    return results;
  }

  async uninstall(
    targetDir: string,
    scope: InstallScope,
    dryRun = false,
  ): Promise<UninstallResult[]> {
    const results: UninstallResult[] = [];
    const { type, targetFile } = this.config.storage;

    if (type === "embedded") {
      const filePath = path.join(targetDir, targetFile!);
      const ids = await removeSections(filePath, dryRun);
      return ids.map((skill) => ({
        skill,
        path: targetFile!,
        action: "removed",
      }));
    }

    const isGlobal = scope === "global";
    const skillsBase = this.skillsBase(targetDir, scope);
    const importFilePath = this.config.imports
      ? path.join(targetDir, this.config.imports.file)
      : null;

    if (type === "file") {
      if (!(await fs.pathExists(skillsBase))) return [];
      const files = await fs.readdir(skillsBase);
      for (const file of files) {
        if (
          this.config.storage.extension &&
          !file.endsWith(this.config.storage.extension)
        )
          continue;
        const filePath = path.join(skillsBase, file);
        const content = await fs.readFile(filePath, "utf8");
        if (this.config.marker && content.includes(this.config.marker)) {
          results.push({
            skill: file.replace(this.config.storage.extension!, ""),
            path: path.relative(targetDir, filePath),
            action: "removed",
          });
          if (!dryRun) await fs.remove(filePath);
        }
      }
      return results;
    }

    // folder type
    const installed = await this.findInstalledSkillsInFolder(skillsBase);
    for (const { name, dir } of installed) {
      const skillFile = path.join(dir, this.config.storage.entryFile!);
      const skillPath = path.relative(skillsBase, dir);
      results.push({
        skill: name,
        path: path.relative(targetDir, skillFile),
        action: "removed",
      });

      if (!dryRun) {
        await fs.remove(dir);
        if (this.config.imports && importFilePath) {
          // Try removing both hierarchical and flat import formats for legacy support
          const hierarchicalImport = this.config.imports.format(
            skillPath,
            isGlobal,
          );
          const flatImport = this.config.imports.format(
            skillPath.replace(/\//g, "-"),
            isGlobal,
          );
          await this.removeImport(importFilePath, hierarchicalImport);
          await this.removeImport(importFilePath, flatImport);
        }
      }
    }

    return results;
  }

  private skillsBase(targetDir: string, scope: InstallScope): string {
    const { baseDir, globalBaseDir } = this.config.storage;
    const effectiveBase =
      scope === "global" ? (globalBaseDir ?? baseDir!) : baseDir!;
    return path.join(targetDir, effectiveBase);
  }

  private nameToPath(name: string): string {
    if (this.config.storage.type === "folder") {
      const sep = this.config.storage.namespaceSeparator ?? "/";
      return name.replace(":", sep);
    }
    return name.replace(":", "-");
  }

  private async findInstalledSkillsInFolder(
    skillsBase: string,
  ): Promise<{ name: string; dir: string }[]> {
    if (!(await fs.pathExists(skillsBase))) return [];

    const { entryFile } = this.config.storage;
    const result: { name: string; dir: string }[] = [];
    const level1 = await fs.readdir(skillsBase, { withFileTypes: true });

    for (const e of level1) {
      if (!e.isDirectory()) continue;
      const level1Dir = path.join(skillsBase, e.name);

      if (await fs.pathExists(path.join(level1Dir, entryFile!))) {
        // This could be a top-level skill (e.g. "my-skill")
        // OR a legacy flat namespaced skill (e.g. "minime-idea")
        result.push({ name: e.name, dir: level1Dir });
      } else {
        // Check for hierarchical namespaced skill (e.g. "minime/idea")
        const level2 = await fs.readdir(level1Dir, { withFileTypes: true });
        for (const e2 of level2) {
          if (!e2.isDirectory()) continue;
          const level2Dir = path.join(level1Dir, e2.name);
          if (await fs.pathExists(path.join(level2Dir, entryFile!))) {
            result.push({ name: `${e.name}:${e2.name}`, dir: level2Dir });
          }
        }
      }
    }

    return result;
  }

  private async upsertImport(
    importFilePath: string,
    importLine: string,
  ): Promise<void> {
    if (!(await fs.pathExists(importFilePath))) {
      await fs.writeFile(importFilePath, `${importLine}\n`, "utf8");
      return;
    }
    const content = await fs.readFile(importFilePath, "utf8");
    if (content.includes(importLine)) return;
    const sep = content.endsWith("\n") ? "" : "\n";
    await fs.appendFile(importFilePath, `${sep}${importLine}\n`, "utf8");
  }

  private async removeImport(
    importFilePath: string,
    importLine: string,
  ): Promise<void> {
    if (!(await fs.pathExists(importFilePath))) return;
    const lines = (await fs.readFile(importFilePath, "utf8")).split("\n");
    const filtered = lines.filter((l) => l.trim() !== importLine);
    const next = filtered.join("\n");
    if (next.trim() === "") {
      await fs.remove(importFilePath);
    } else {
      await fs.writeFile(importFilePath, next, "utf8");
    }
  }
}
