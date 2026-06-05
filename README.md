# minime-skills

A universal AI skills framework. Define a skill once — install it into Claude Code, Cursor, GitHub Copilot, Gemini CLI, OpenAI Codex, Windsurf, and more.

## Supported agents

| Agent             | Command           | Storage                          |
| ----------------- | ----------------- | -------------------------------- |
| Claude Code       | `claude`          | `.claude/skills/*/SKILL.md`      |
| Cursor            | `cursor`          | `.cursor/rules/*.mdc`            |
| GitHub Copilot    | `copilot`         | `.github/copilot-instructions.md` |
| Gemini CLI        | `gemini`          | `.gemini/skills/*/SKILL.md`      |
| OpenAI Codex      | `codex`           | `.agents/skills/*/SKILL.md`      |
| Windsurf          | `windsurf`        | `.windsurf/skills/*/SKILL.md`    |

## Bundled skills

This package ships with three skills:

- **idea** — brainstorming and idea generation
- **planner** — implementation planning and architecture
- **decomposer** — breaking down tasks into manageable steps

## Usage

### Interactive

```bash
npx minime-skills
```

You'll be guided through install, uninstall, or listing skills.

### Non-interactive

#### Install

```bash
# Install for a specific agent
npx minime-skills install --agent claude
npx minime-skills install --agent cursor
npx minime-skills install --agent copilot
npx minime-skills install --agent gemini
npx minime-skills install --agent codex
npx minime-skills install --agent windsurf

# Install for all agents at once
npx minime-skills install --agent all

# Install a specific skill only
npx minime-skills install --agent claude --skill idea

# Install globally (instead of current project)
npx minime-skills install --agent claude --global

# Install to a custom directory
npx minime-skills install --agent claude --dir /path/to/project

# Install and add generated directories to .gitignore
npx minime-skills install --agent claude --gitignore
```

| Flag | Short | Description |
| ---- | ----- | ----------- |
| `--agent` | `-a` | Target agent: `claude`, `cursor`, `copilot`, `gemini`, `codex`, `windsurf`, or `all` |
| `--skill` | `-s` | Install a specific skill by name |
| `--global` | `-g` | Install globally instead of the current project |
| `--dir` | `-d` | Target directory (defaults to cwd for project installs) |
| `--gitignore` | | Add installed directories to `.gitignore` |

#### Uninstall

```bash
# Uninstall from a specific agent
npx minime-skills uninstall --agent claude

# Uninstall from all agents
npx minime-skills uninstall --agent all

# Uninstall from global config
npx minime-skills uninstall --agent claude --global
```

| Flag | Short | Description |
| ---- | ----- | ----------- |
| `--agent` | `-a` | Target agent: `claude`, `cursor`, `copilot`, `gemini`, `codex`, `windsurf`, or `all` |
| `--global` | `-g` | Uninstall from global config instead of the current project |
| `--dir` | `-d` | Target directory (defaults to cwd for project uninstalls) |

#### List

```bash
npx minime-skills list
```

## Skill structure

A skill is a directory containing a `SKILL.md` file with YAML frontmatter:

```
skills/my-skill/
├── SKILL.md        # required: name, description in frontmatter
└── ...             # optional: additional files copied during install
```

Example `SKILL.md`:

```markdown
---
name: my-skill
description: Does something useful
---

Your skill content here. This is the prompt that gets loaded by the agent.
```

## License

MIT
