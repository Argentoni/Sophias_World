# AGENTS.md — Sophia's World

Durable instructions for AI agents (Claude Code, Codex) working on this project.

## Project

Sophia's World — children's "digital dollhouse" sandbox game built for Anderson's 8-year-old daughter Sofia. Hobby-first; might become commercial later.

**Full design:** [`docs/superpowers/specs/2026-05-10-sophias-world-design.md`](docs/superpowers/specs/2026-05-10-sophias-world-design.md)

## Hard rules

### Phaser 3, NEVER Phaser 4

This project uses **Phaser 3 (latest stable 3.x)**. Phaser 4 has different APIs and a much smaller AI corpus — mixing APIs is the #1 source of bugs in agent-written code. Always confirm `package.json` lists `phaser@^3.x` and use Phaser 3 syntax. If a suggestion uses Phaser 4 APIs (different scene lifecycle, new module structure), reject it and use the Phaser 3 equivalent.

### HUD is Phaser-native, not DOM

Build HUD/game UI with Phaser sprites + bitmap text + containers. **Do not use Phaser DOM Elements** for game UI — DOM lives on a separate layer with input/camera limitations and breaks reliably on iOS Safari.

DOM is allowed only for: pre-Phaser loading screen, PWA "atualizando" screen, parental gate dialog (export/import save).

### Data-driven content

Game content (clothes, furniture, interactive objects, scenes) lives in `src/data/*.json` validated by Zod. **New content within existing action types never requires code** — only new JSON entries and sprites. The ~8 action types in `src/systems/interactionSystem.ts` (`play-animation`, `play-sound`, `give-item`, `give-currency`, `set-expression`, `swap-sprite`, `spawn-particle`, `wait`) cover ~95% of cases. New action types DO require code.

### Save persistence

`SaveState` is in IndexedDB via `idb-keyval`, validated by Zod at runtime. **Never silently reset the save** — corruption goes through a parental recovery flow (export broken save + explicit "começar do zero" confirmation). Always call `navigator.storage.persist()` after the first successful save. Handle `QuotaExceededError` without data loss.

### Language

User-facing strings are **Portuguese (BR)** only in MVP. Code identifiers and comments stay in English. JSON keys are English; JSON values that the player reads ("Comprar", "Dormir") are PT-BR.

### Testing

- Vitest for pure logic (currency, save schema, action dispatch, content JSON validation)
- 3 Playwright smoke tests (open, drag character, offline build works)
- No automated E2E for full gameplay — child-led QA covers that

### Orientation

MVP is **landscape only**. Portrait shows a friendly "vire o aparelho" screen. Real portrait support is v1.1.

### Privacy

Save is **local-only**. No network calls for player data, ever. No analytics, no telemetry, no ads, no tracking SDKs, no commercial integrations in the MVP.

## File conventions

- Comments: sparse, English, only non-obvious WHY
- Files: ≤ ~300 lines preferred — if reasoning gets hard, split
- No emojis in code or commit messages unless the user explicitly asks

## Sensitive actions

- Never `git push --force`, `git reset --hard`, or destroy the working tree without explicit user authorization
- Never enable network features for player state
- When in doubt about scope, ask before adding "while you're there" refactors

---

<claude-mem-context>
# Memory Context

# [Sophias_World] recent context, 2026-05-10 10:33pm GMT-3

No previous sessions found.
</claude-mem-context>
