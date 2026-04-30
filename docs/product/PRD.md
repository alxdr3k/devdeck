---
id: devdeck-prd
type: prd
title: DevDeck Product Requirements
status: active
created_at: 2026-04-30
updated_at: 2026-04-30
scope: product
project_id: devdeck
provenance: user_curated_ai_assisted
sensitivity: private
retention: long_term
ai_include: true
---

# DevDeck PRD

## Summary

DevDeck helps one developer operate 3-5 simultaneous Claude Code/Codex projects without carrying each repo's state in working memory. The MVP is a local TypeScript/Node + Ink TUI that reads project evidence, ranks the next human-attention item, and generates a 2-minute handoff prompt.

## Problem

The user is running multiple AI coding projects at once. The hard part is not listing tasks. The hard part is knowing which repo needs human attention now, why it needs attention, what evidence supports that claim, and how to resume the right Claude/Codex session quickly.

Generic Kanban misses this because the actionable state is distributed across boilerplate docs, local git, GitHub PR/check/review state, and `.dev-cycle` / `codex-loop` artifacts.

## Target User

- Primary user: a solo developer dogfooding Claude Code/Codex across `actwyn`, `concluv`, and `xef-scale`.
- User goal: open one local TUI and know the next best unblock within 30 seconds.
- Workflow goal: produce a handoff that lets the user resume work in under 2 minutes.

## Dogfood Repos

Initial explicit config:

| Repo | Path | Priority | Today focus |
|---|---|---:|---|
| actwyn | `../actwyn` | 100 | yes |
| concluv | `../concluv` | 90 | no |
| xef-scale | `../xeflabs/xef-scale` | 70 | no |

## MVP Thesis

The right MVP is a read-mostly, local-first developer cockpit:

```text
boilerplate docs + git + GitHub + dev-cycle/codex-loop
  -> ProjectStatus
  -> AttentionItem
  -> ranked priority feed
  -> handoff prompt / open target / command display
```

The product should be dogfood-first. It should fit the user's existing terminal workflow before broadening to generic project management.

## Scope

### In Scope

- Explicit `devdeck.yml` project config for dogfood repos.
- Local scans of boilerplate docs and `.dev-cycle` state.
- Local git status, branch, ahead/behind, changed files, and recent commits.
- GitHub PR, checks, review, and Codex review state through `gh`.
- Project-level status model with source, freshness, confidence, and missing-source handling.
- Source contract probing for evolving boilerplate docs, `.dev-cycle`, GitHub CLI output, and parser compatibility.
- Attention item model for human-actionable work.
- Local operator pause state for intentionally parked, high-judgment, external-dependency, or milestone-review work during dogfood.
- Deterministic ranking policy with dogfood/diagnostic explanation. Post-dogfood default UI should keep the feed simple and avoid exposing "why this is #1" as primary copy.
- Ink TUI priority feed with a strong top item and short top 5 queue.
- Secondary project table as a map, not the primary action UI.
- Handoff prompt generation.
- Open target, local pause/unpause, and command display actions.
- Local JSON cache for last scan results, freshness metadata, and operator pause state.
- Read-only scanner shell-outs for `git` and `gh`.

### Out of Scope

- Generic Kanban board.
- Web/mobile dashboard.
- Hosted service or multi-user repo connector.
- Running repo commands, tests, `codex-loop`, merge, push, or deploy from DevDeck.
- Write-back to docs, GitHub, or `.dev-cycle`.
- Team workflow, assignment, notifications, or cross-user collaboration.
- GitHub-less non-developer workflow.
- Generic task-manager defer/pin/snooze beyond the operator pause workflow.

## Functional Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| REQ-001 | Load an explicit project config with repo id, path, priority, and optional `today_focus`. | must | Missing path is a project state, not a process crash. |
| REQ-002 | Scan boilerplate docs for current state, implementation plan, testing guidance, and stale/missing docs. | must | Parser starts with known files and headings. |
| REQ-003 | Scan local git state for branch, dirtiness, upstream relation, recent commits, and open PR branch hints. | must | Read-only. |
| REQ-004 | Read GitHub PR/check/review state through `gh` JSON output. | must | Adapter boundary hides `gh` JSON shape from domain models. |
| REQ-005 | Read `.dev-cycle` and `codex-loop` state when present. | must | Missing state lowers confidence but does not fail the scan. |
| REQ-006 | Produce a `ProjectStatus` for every configured repo. | must | Includes trust metadata per source. |
| REQ-007 | Generate `AttentionItem`s that describe concrete human actions. | must | Items are not raw machine states. |
| REQ-008 | Rank items using severity, project priority, today focus, age, trust, freshness, and estimated effort. | must | Deterministic ties. |
| REQ-009 | Show top 1 item and top 5 queue in the default TUI view. | must | Strong top 1 emphasis. |
| REQ-010 | Preserve ranking explanation for dogfood, diagnostics, and evals. | must | Do not require "why this is #1" as primary end-user copy after dogfood. |
| REQ-011 | Generate a 2-minute handoff prompt with current task, why next, next action, trust, read order, and commands. | must | Copyable output. |
| REQ-012 | Display open targets and commands without executing repo commands. | must | MVP action safety boundary. |
| REQ-013 | Surface stale, missing, auth, and parse errors in plain language. | must | No silent failures. |
| REQ-014 | Cache scan results locally and mark freshness. | should | JSON cache is sufficient for MVP. |
| REQ-015 | Allow manual rescan. | should | Pull-first interaction model. |
| REQ-016 | Provide useful first-run output for missing config, missing repo path, and `gh` auth failure. | must | First run should not collapse into a stack trace. |
| REQ-017 | Resolve repo-specific boilerplate doc paths through a known-path resolver with fallbacks. | must | Dogfood repos are similar but not identical. |
| REQ-018 | Represent current-branch PR state separately from other open PRs and default-branch sync state. | should | Prevents single-PR assumptions from hiding blockers. |
| REQ-019 | Probe source contract compatibility before parsing docs, `.dev-cycle`, git, or `gh` output. | must | Unsupported or partial contracts become trust data and repair items, not scan crashes. |
| REQ-020 | Support local operator pause for work the user intentionally parks because it needs high judgment, external setup, milestone review, or leaf promotion. | should | Paused work leaves the active feed by default but remains visible in a paused queue. |

## Non-functional Requirements

| ID | Category | Requirement | Measurement |
|---|---|---|---|
| NFR-001 | Safety | DevDeck must not execute external project commands in MVP. | Code review and command action tests. |
| NFR-002 | Privacy | Repo state stays local except user-initiated `gh` calls to GitHub. | No telemetry, no external service. |
| NFR-003 | Determinism | Same scan input and policy produce same ranking order. | Fixture tests. |
| NFR-004 | Resilience | One missing repo, auth failure, parse error, or slow source must not block other projects. | Integration fixtures. |
| NFR-005 | Speed | Local-only scan across 3 configured repos should feel interactive. | Target under 2 seconds without GitHub. |
| NFR-006 | Trust | Every item shows source, freshness, confidence, and missing source. | Display contract checks. |
| NFR-007 | Testability | Domain models, ranking, and handoff generation are pure or easily fixture-driven. | Unit test coverage before TUI polish. |
| NFR-008 | Contract evolution | Boilerplate/project workflow drift must be managed with versioned probes, capability checks, and fixtures. | Source contract tests and dogfood evals. |
| NFR-009 | Focus control | User-declared pause state must not be overridden by project priority in the active feed, and must not silently hide work forever. | Pause/ranking/display fixtures. |

## Implementation Stack

- Runtime: Node.js 22 or newer.
- Language: TypeScript.
- Package manager: npm.
- TUI: Ink.
- Config: YAML parsed and validated into typed config.
- GitHub adapter: `gh` shell-out with JSON output.
- Local adapters: filesystem and git read-only commands.
- Cache: user-local JSON cache for MVP, with freshness metadata. Do not start with SQLite.
- Tests: Vitest for model, parser, ranking, and handoff fixtures.

Planned initial package set:

- Runtime/UI: `ink`, `react`.
- Config/validation: `yaml`, `zod`.
- Shell adapters: Node `child_process` or a thin local wrapper; add `execa` only if the wrapper becomes noisy.
- Tests/tooling: `typescript`, `tsx`, `vitest`, `@types/node`.

This stack is accepted for MVP. The reasoning is workflow fit, fast iteration, and future model sharing with a possible web dashboard, not inherited boilerplate implementation.

## Future Service Boundary

MVP config uses local repo paths because DevDeck is dogfood-first and runs on the user's machine. The implementation should still isolate this behind a project locator/source provider boundary:

```text
ProjectConfig -> ProjectLocator -> LocatedProject -> source adapters
```

The first provider is local filesystem. A later service could add hosted connectors, repo snapshots, remote agents, or explicit uploads without changing `ProjectStatus`, `AttentionItem`, ranking, or display contracts.

Source contract versioning is part of this boundary. Local paths can remain dogfood-only, but each provider still has to report which `boilerplate_docs`, `dev_cycle`, `git_cli`, and `github_gh` capabilities it can satisfy before DevDeck trusts parsed state.

Hosted production contract operations are intentionally deferred. Before serviceizing DevDeck, reopen Q-017 to design a source contract registry, connector health model, raw snapshot storage, parser-versioned reprocessing, and rollout policy.

## Success Metrics

- User can identify the top human-attention item within 30 seconds of opening DevDeck.
- Generated handoff lets the user resume the target repo in under 2 minutes.
- Dogfood scan works across 3 configured repos, including one stale/error source without crashing the whole TUI.
- Top item quality eval passes against real `actwyn`, `concluv`, and `../xeflabs/xef-scale` fixtures.
- User does not need to open all repos manually to know where to start.

## First-run Contract

The first usable path should be:

```text
npm install
npm run dev
DevDeck opens
No config? show a minimal devdeck.yml example
Config present? scan repos
GitHub auth missing? keep local results and show gh auth fix
Top item appears or a clear empty state appears
```

No first-run state should require reading source code to recover.

## Command Safety Boundary

DevDeck may execute bounded read-only scanner commands for its own data collection:

- `git` status/log/branch/rev-parse style reads
- `gh` JSON/API reads

DevDeck must not execute workflow or mutation commands in MVP:

- no `codex-loop`
- no tests/builds in dogfood repos
- no `git add`, `commit`, `push`, `merge`, checkout/switch, reset, stash
- no `gh pr merge`, `gh pr create`, `gh pr checks --watch`
- no shell command generated from an `AttentionItem`

Generated commands are display/copy text only. Clipboard copy should fall back to showing selectable text when clipboard support is unavailable.

Local pause/unpause may mutate DevDeck's user-local state, but it must not mutate dogfood repos, GitHub, git state, `.dev-cycle`, or project docs.

## Open Questions

See `docs/discovery/0001-initial-questions.md`.
