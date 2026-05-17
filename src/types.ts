export interface SkillMeta {
  name: string;
  description: string;
  version?: string;
}

export interface Skill {
  meta: SkillMeta;
  /** Markdown body without frontmatter */
  content: string;
  sourcePath: string;
}

export interface InstallResult {
  skill: string;
  path: string;
  action: "created" | "updated" | "skipped";
}

export interface UninstallResult {
  skill: string;
  path: string;
  action: "removed" | "not_found";
}

export type InstallScope = "project" | "global";

export interface Adapter {
  readonly agentName: string;
  readonly displayName: string;
  /** Whether this agent has a meaningful global config directory */
  readonly supportsGlobal: boolean;
  install(
    skills: Skill[],
    targetDir: string,
    scope?: InstallScope,
  ): Promise<InstallResult[]>;
  /** True if minime-skills files are already installed under targetDir */
  hasInstalledSkills(targetDir: string, scope: InstallScope): Promise<boolean>;
  /**
   * Remove all skills installed by minime-skills.
   * In dryRun mode returns what would be removed without touching the filesystem.
   */
  uninstall(
    targetDir: string,
    scope: InstallScope,
    dryRun?: boolean,
  ): Promise<UninstallResult[]>;
  /** True if the agent appears to be configured in this project directory */
  detectInProject(projectDir: string): Promise<boolean>;
  /** True if the agent appears to be installed on this machine */
  detectOnSystem(): Promise<boolean>;
  /** The global config directory to use as targetDir, or null if supportsGlobal is false */
  getGlobalTargetDir(homeDir: string): string | null;
}
