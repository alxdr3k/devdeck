# 02 HLD — High-Level Design

## Overview

DevDeck is a local TypeScript/Node CLI/TUI. It loads explicit repo config, scans read-only project sources, normalizes them into `ProjectStatus`, derives `AttentionItem`s, ranks them with transparent policy, and renders an Ink priority feed plus handoff/command display.

## Architecture Diagram

```text
devdeck.yml
   |
   v
Config loader + project locator
   |
   v
+------------------+   +-------------+   +-------------+   +----------------+
| docs adapter     |   | git adapter |   | gh adapter  |   | dev-cycle      |
| known path map   |   | read-only   |   | JSON only   |   | adapter        |
+------------------+   +-------------+   +-------------+   +----------------+
          \                 |                 |                    /
           \                |                 |                   /
            v               v                 v                  v
                    ProjectStatus builder + SourceTrust
                               |
                               v
                    AttentionItem generator
                               |
                               v
                 ranking bands + score + explanation
                               |
                               v
              Ink TUI feed/detail + handoff + command display
                               |
                               v
                    user-local JSON scan cache
```

## Components

| Component | Responsibility | Dependencies |
|---|---|---|
| Config loader | Parse `devdeck.yml`, validate project ids, priorities, paths, workflow settings. | YAML parser |
| Project locator | Resolve configured project references into readable source handles. MVP provider is local filesystem paths. | filesystem for MVP |
| Path resolver | Resolve known boilerplate doc paths with fallbacks inside a located project. | project locator |
| Docs adapter | Read `current-state`, implementation plan, testing/current docs, timestamps, active slice hints. | path resolver |
| Git adapter | Read branch, worktree dirtiness, upstream/ahead/behind, recent commits. | `git` read-only commands |
| GitHub adapter | Read current branch PR, open PR summaries, checks, reviews, Codex feedback/pass state. | `gh --json`, timeouts |
| Dev-cycle adapter | Read `.dev-cycle/dev-cycle-run-id` and brief log latest cycle. | filesystem |
| Status builder | Combine source outputs into `ProjectStatus` and `SourceTrust`. | adapters |
| Attention generator | Convert status into human-actionable `AttentionItem`s. | status model |
| Ranking engine | Apply hard bands, score within band, produce explanation. | ranking policy |
| Handoff generator | Produce copyable Claude/Codex resume prompt. | attention item |
| Ink UI | Render top item, top 5 queue, project table, detail, handoff/command panes. | domain outputs |
| Cache | Store last scan summaries and freshness metadata outside dogfood repos. | user-local JSON |

## Data Model Summary

| Entity | Key fields | Storage |
|---|---|---|
| `ProjectConfig` | id, path, priority, todayFocus, githubRepo | `devdeck.yml` |
| `LocatedProject` | config, locator, absolutePath, pathState, repoName | derived in memory |
| `SourceTrust` | source, state, checkedAt, confidence, summary, fixHint | derived; cached |
| `ProjectStatus` | project, workStatus, docs, git, github, devCycle, validation, trust | derived; cached |
| `AttentionItem` | id, kind, rankingBand, severity, nextAction, sourceRefs, commands, handoff | derived; cached |
| `RankingResult` | ordered items, score, band, explanation | derived |
| `ScanCache` | projects, statuses, items, scannedAt, source versions | user-local JSON |

## Key Interfaces

- CLI/TUI entrypoint: planned `npm run dev` for local development, later `devdeck`.
- Config input: `devdeck.yml`.
- Adapter inputs: repo filesystem, `git`, `gh`, `.dev-cycle`.
- UI outputs: priority feed, project table, detail pane, handoff text, command display.
- External integrations: GitHub through installed/authenticated `gh`; no direct API client in MVP.

## Cross-cutting

- Safety: command suggestions are display-only in MVP. No repo command execution.
- Scanner command boundary: adapters may run bounded read-only `git` and `gh` reads; workflow/mutation commands are prohibited.
- Privacy: local repo state stays local except user-triggered `gh` calls to GitHub.
- Errors: source failures become `SourceTrust` entries; one failed repo/source does not stop the scan.
- Determinism: ranking is pure for a fixed input fixture.
- Timeouts: shell-outs need bounded execution so UI does not hang on `gh`.
- Observability: MVP shows source freshness/confidence in UI; no telemetry.
- Service boundary: domain models consume located project/source handles, not raw local paths. Local paths are the MVP provider, not a permanent product assumption.

## Trade-offs & Alternatives

- ADR-0001: workflow-specific developer cockpit over generic Kanban.
- DEC-002: TypeScript/Node 22 + npm + Ink for MVP.
- DEC-003: `gh` shell-out before GitHub API client.
- DEC-004: user-local JSON cache before SQLite.
- DEC-005: ranking bands before numeric score.
- DEC-006: display-only commands in MVP.
- DEC-009: project locator abstraction with local filesystem provider for dogfood MVP.
- DEC-010: initial npm package/tooling set.
- DEC-011: read-only scanner shell-outs are allowed; workflow command execution is prohibited.
- DEC-012: clipboard copy falls back to selectable text.

## Open Questions

- Q-002: exact `gh` JSON fields and failure modes.
- Q-005: boilerplate parser depth for implementation plan and `.dev-cycle`.
- Q-010: future defer/pin/snooze item state.
- Q-012: final product name.

## Related Requirements

- REQ-001, REQ-016, REQ-017 -> Config loader and path resolver.
- REQ-002, REQ-003, REQ-004, REQ-005, REQ-018 -> Source adapters.
- REQ-006, NFR-004, NFR-006 -> Status builder and trust model.
- REQ-007, REQ-008, REQ-010, NFR-003 -> Attention/ranking domain.
- REQ-009, REQ-011, REQ-012, REQ-013 -> Ink UI, handoff, display copy.
- REQ-014, REQ-015 -> Cache and rescan.
