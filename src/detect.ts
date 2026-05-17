import { execSync } from "child_process";
import fs from "fs-extra";

export function commandExists(cmd: string): boolean {
  try {
    const which = process.platform === "win32" ? "where" : "which";
    execSync(`${which} ${cmd}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export async function anyExists(...paths: string[]): Promise<boolean> {
  for (const p of paths) {
    if (await fs.pathExists(p)) return true;
  }
  return false;
}
