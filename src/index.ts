export { loadSkills, loadSkill, DEFAULT_SKILLS_DIR } from "./loader";
export { install } from "./install";
export { uninstall } from "./uninstall";
export { adapters, SUPPORTED_AGENTS } from "./adapters";
export type {
  Skill,
  SkillMeta,
  Adapter,
  InstallResult,
  UninstallResult,
  InstallScope,
} from "./types";
