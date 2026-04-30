# 04 Implementation Plan

This is DevDeck's canonical roadmap and status ledger.

## Taxonomy

| Term | Meaning | Example |
|---|---|---|
| Milestone | Product/user gate | `P0-M3` |
| Track | Technical stream | `SRC` |
| Phase | Ordered stage inside a track | `SRC-1A` |
| Slice | Commit-sized unit | `SRC-1A.2` |
| Gate | Acceptance/eval check | `AC-007` / `TEST-007` |

## Status Vocabulary

Implementation status: `planned`, `ready`, `in_progress`, `landed`, `accepted`, `blocked`, `deferred`, `dropped`.

Gate status: `defined`, `not_run`, `passing`, `failing`, `waived`.

## Milestones

| Milestone | Product / user gate | Target | Status | Gate | Evidence | Notes |
|---|---|---|---|---|---|---|
| `P0-M1` | Project contract, docs, reviews, and acceptance gates are ready for implementation. | now | `accepted` | docs review | source docs + reviews + this ledger | No code yet. |
| `P0-M2` | DevDeck can load config and produce local-only statuses for all dogfood repos. | next | `planned` | AC-001..AC-006 | not started | Includes path resolver and docs/git/dev-cycle adapters. |
| `P0-M3` | DevDeck can include GitHub PR/check/review state without blocking local scans. | after P0-M2 | `planned` | AC-007..AC-009, AC-017 | not started | `gh` adapter boundary. |
| `P0-M4` | DevDeck can generate ranked attention feed and handoff prompts from fixtures. | after P0-M3 | `planned` | AC-010..AC-014 | not started | Domain-first before Ink polish. |
| `P0-M5` | Dogfood TUI works on `actwyn`, `concluv`, and `../xeflabs/xef-scale`. | after P0-M4 | `planned` | AC-015..AC-018 + dogfood eval | not started | Top item quality is release gate. |

## Tracks

| Track | Purpose | Active phase | Status | Notes |
|---|---|---|---|---|
| `DOC` | Source-of-truth docs, reviews, traceability | `DOC-1A` | `accepted` | Current phase complete. |
| `CORE` | TypeScript project, config, cache, CLI shell | `CORE-1A` | `ready` | First code track. |
| `SRC` | Source adapters for docs/git/GitHub/dev-cycle | `SRC-1A` | `planned` | Fixture-heavy. |
| `MODEL` | ProjectStatus and AttentionItem domain | `MODEL-1A` | `planned` | Pure functions first. |
| `RANK` | Ranking bands, scoring, explanations | `RANK-1A` | `planned` | Dogfood-calibrated. |
| `UI` | Ink feed/detail/handoff/command display | `UI-1A` | `planned` | No execution actions. |
| `EVAL` | Dogfood fixtures and top-item quality eval | `EVAL-1A` | `planned` | Product gate. |

## Phases / Slices

| Slice | Milestone | Track | Phase | Goal | Depends | Gate | Gate status | Status | Evidence | Next |
|---|---|---|---|---|---|---|---|---|---|---|
| `DOC-1A.1` | `P0-M1` | `DOC` | `DOC-1A` | Create source-of-truth docs from second-brain handoff. | handoff | docs review | `passing` | `accepted` | `docs/product/PRD.md`, specs, eval | Complete. |
| `DOC-1A.2` | `P0-M1` | `DOC` | `DOC-1A` | Run CEO, Design, DevEx, Engineering reviews and backfill findings. | `DOC-1A.1` | review backfill | `passing` | `accepted` | `docs/reviews/`, this ledger | Complete. |
| `CORE-1A.1` | `P0-M2` | `CORE` | `CORE-1A` | Scaffold Node 22 + npm + TypeScript + Vitest project. | `DOC-1A.2` | AC-001, TEST-001 | `defined` | `ready` | not started | Start here. |
| `CORE-1A.2` | `P0-M2` | `CORE` | `CORE-1A` | Add `devdeck.yml` loader, validation, `ProjectLocator`, path resolution, first-run missing-config output. | `CORE-1A.1` | AC-002, AC-003, TEST-002 | `defined` | `planned` | not started | Implement after scaffold. |
| `CORE-1A.3` | `P0-M2` | `CORE` | `CORE-1A` | Add user-local JSON scan cache with freshness metadata and override path. | `CORE-1A.1` | AC-014, TEST-014 | `defined` | `planned` | not started | Implement after scanner shape exists. |
| `SRC-1A.1` | `P0-M2` | `SRC` | `SRC-1A` | Implement filesystem/path and git read-only adapters. | `CORE-1A.2` | AC-004, AC-005, TEST-004 | `defined` | `planned` | not started | Use fixtures. |
| `SRC-1A.2` | `P0-M2` | `SRC` | `SRC-1A` | Implement known-path docs resolver and boilerplate docs adapter. | `SRC-1A.1`, `SPIKE-002` | AC-006, TEST-006 | `defined` | `planned` | not started | Include `docs/TESTING.md` fallback. |
| `SRC-1A.3` | `P0-M3` | `SRC` | `SRC-1A` | Implement `gh` adapter for current branch PR, open PRs, checks, reviews. | `SPIKE-001` | AC-007, AC-017, TEST-007 | `defined` | `planned` | not started | Add timeouts. |
| `SRC-1A.4` | `P0-M3` | `SRC` | `SRC-1A` | Implement `.dev-cycle` latest brief parser. | `SRC-1A.1` | AC-008, TEST-008 | `defined` | `planned` | not started | Parse latest cycle. |
| `MODEL-1A.1` | `P0-M4` | `MODEL` | `MODEL-1A` | Build `ProjectStatus` and source trust builder. | `SRC-1A.1` | AC-009, TEST-009 | `defined` | `planned` | not started | Keep adapter output out of UI. |
| `MODEL-1A.2` | `P0-M4` | `MODEL` | `MODEL-1A` | Build `AttentionItem` generator and suppression rules. | `MODEL-1A.1` | AC-010, TEST-010 | `defined` | `planned` | not started | Prefer one root-cause item. |
| `RANK-1A.1` | `P0-M4` | `RANK` | `RANK-1A` | Implement hard ranking bands, score, tie-breakers, explanation. | `MODEL-1A.2` | AC-011, TEST-011 | `defined` | `planned` | not started | Tune after eval, not before. |
| `UI-1A.1` | `P0-M5` | `UI` | `UI-1A` | Implement Ink feed, top item, top 5 queue, project table, detail pane. | `RANK-1A.1` | AC-012, AC-018, TEST-012 | `defined` | `planned` | not started | Evidence must remain visible. |
| `UI-1A.2` | `P0-M5` | `UI` | `UI-1A` | Implement handoff and command display panes with no execution. | `UI-1A.1` | AC-013, TEST-013 | `defined` | `planned` | not started | No execution handlers. |
| `EVAL-1A.1` | `P0-M5` | `EVAL` | `EVAL-1A` | Capture dogfood fixtures and run top-item quality eval. | `UI-1A.2`, `SPIKE-003` | AC-015..AC-018, TEST-015 | `defined` | `planned` | not started | Product release gate. |

## Dependencies

- Local dogfood repos: `../actwyn`, `../concluv`, `../xeflabs/xef-scale`.
- CLI tools: Node 22+, npm, git, `gh`.
- GitHub auth: required for GitHub source trust, not for local-only scan.

## Risks

- `gh` output may not expose Codex review state cleanly.
- Boilerplate docs differ enough to break hard-coded paths.
- Ranking may feel wrong if hygiene/source-trust items outrank PR-loop blockers.
- TUI may hide evidence and lose user trust.

## Acceptance

- Gate definitions live in `docs/06_ACCEPTANCE_TESTS.md`.
- Test commands live in `docs/current/TESTING.md` once implementation exists.
- Product quality gate lives in `docs/evals/dogfood-top-item-quality.md`.
