# minime-skills

A universal AI skills framework. Define a skill once — install it into Claude Code, Cursor, GitHub Copilot, Gemini CLI, OpenAI Codex, Windsurf, and more.

## Usage

```bash
npx minime-skills
```

You'll be prompted to install, uninstall, or list skills interactively.

### Non-interactive

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

# Install globally
npx minime-skills install --agent claude --global

# Uninstall
npx minime-skills uninstall --agent claude

# List available skills
npx minime-skills list
```

## License

MIT
