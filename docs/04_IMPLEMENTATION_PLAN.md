# 04 Implementation Plan

This is DevDeck's canonical roadmap and status ledger.

## Taxonomy

| Term | Meaning | Example |
|---|---|---|
| Milestone | Product/user gate | `P0-M3` |
| Track | Technical stream | `SRC` |
| Phase | Ordered stage inside a track | `SRC-1A` |
| Slice | Commit-sized implementation/verification unit | `SRC-1A.2` |
| Gate | Acceptance/eval check | `AC-007` / `TEST-007` |

## Status Vocabulary

Implementation status: `planned`, `ready`, `in_progress`, `landed`, `accepted`, `blocked`, `deferred`, `dropped`.

Gate status: `defined`, `not_run`, `passing`, `failing`, `waived`.

## Unplanned Feedback

User feedback from real usage is triaged before it enters the roadmap.

- Clear defects, UX regressions, or acceptance failures may become small hotfix slices.
- Broader product or architecture changes go through Q / DEC / PRD / roadmap updates.
- Keep detailed feedback threads in the issue tracker. Record only the actionable
  slice, gate, evidence, and next step here.
- Bug fixes should leave regression evidence when practical.

## Milestones

| Milestone | Product / user gate | Target | Status | Gate | Evidence | Notes |
|---|---|---|---|---|---|---|
| `P0-M1` | Project contract, docs, reviews, acceptance gates, and leaf roadmap are ready for implementation. | now | `accepted` | docs review | source docs + reviews + this ledger | No code yet. |
| `P0-M2` | DevDeck can load config and produce local-only statuses for all dogfood repos. | next | `in_progress` | AC-001..AC-006, AC-021 | scaffold landed | Includes path resolver, source contract probes, and docs/git adapters. |
| `P0-M3` | DevDeck can include GitHub PR/check/review state without blocking local scans. | after P0-M2 | `planned` | AC-007..AC-009, AC-017 | not started | `gh` adapter boundary. |
| `P0-M4` | DevDeck can generate ranked attention feed and handoff prompts from fixtures. | after P0-M3 | `planned` | AC-010..AC-014, AC-024 | not started | Stable identity and domain-first before Ink polish. |
| `P0-M5` | Dogfood TUI works on `actwyn`, `concluv`, and `../xeflabs/xef-scale`. | after P0-M4 | `planned` | AC-015..AC-018, AC-022, AC-023 + dogfood eval | not started | Top item quality and operator pause behavior are release gates; context recovery is dogfood v2. |

## Tracks

| Track | Purpose | Active phase | Status | Notes |
|---|---|---|---|---|
| `DOC` | Source-of-truth docs, reviews, traceability | `DOC-1A` | `accepted` | Current phase complete. |
| `CORE` | TypeScript project, config, cache, local state, CLI shell | `CORE-1A` | `in_progress` | Scaffold landed; source skeleton next. |
| `SRC` | Source adapters for docs/git/GitHub/dev-cycle | `SRC-1A` | `planned` | Fixture-heavy, with source contract probes before parsers. |
| `GH` | GitHub adapter details and `gh` fixture coverage | `GH-1A` | `planned` | Split from local source adapters because failure modes differ. |
| `MODEL` | ProjectStatus and AttentionItem domain | `MODEL-1A` | `planned` | Pure functions first. |
| `RANK` | Ranking bands, scoring, explanations | `RANK-1A` | `planned` | Dogfood-calibrated. |
| `UI` | Ink feed/detail/handoff/command display | `UI-1A` | `planned` | No execution actions. |
| `EVAL` | Dogfood fixtures and top-item quality eval | `EVAL-1A` | `planned` | Product gate. |

## Phases / Slices

| Slice | Milestone | Track | Phase | Goal | Depends | Gate | Gate status | Status | Evidence | Next |
|---|---|---|---|---|---|---|---|---|---|---|
| `DOC-1A.1` | `P0-M1` | `DOC` | `DOC-1A` | Create source-of-truth docs from second-brain handoff. | handoff | docs review | `passing` | `accepted` | `docs/product/PRD.md`, specs, eval | Complete. |
| `DOC-1A.2` | `P0-M1` | `DOC` | `DOC-1A` | Run CEO, Design, DevEx, Engineering reviews and backfill findings. | `DOC-1A.1` | review backfill | `passing` | `accepted` | `docs/reviews/`, this ledger | Complete. |
| `DOC-1A.3` | `P0-M1` | `DOC` | `DOC-1A` | Run implementation readiness review, close implementation-blocking decisions, and decompose roadmap to leaf slices. | `DOC-1A.2` | readiness review | `passing` | `accepted` | `docs/reviews/0005-implementation-readiness-review.md`, DEC-010..DEC-012 | Complete. |
| `DOC-1A.4` | `P0-M1` | `DOC` | `DOC-1A` | Define source contract versioning and drift handling for evolving boilerplate/project repos. | `DOC-1A.3` | docs review | `passing` | `accepted` | `docs/specs/source-contract-versioning.md`, DEC-014 | Complete. |
| `CORE-1A.1` | `P0-M2` | `CORE` | `CORE-1A` | Scaffold `package.json`, Node 22/npm scripts, TypeScript strict config, TSX dev entrypoint, Vitest. | `DOC-1A.4` | AC-001, TEST-001 | `passing` | `landed` | `package.json`, `tsconfig.json`, `src/cli.ts`, `tests/cli/startup.test.ts`; `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, `npm run dev` | Complete. |
| `CORE-1A.2` | `P0-M2` | `CORE` | `CORE-1A` | Create source/test directory skeleton and export domain placeholder types without behavior. | `CORE-1A.1` | TEST-001 | `defined` | `ready` | not started | Keep compile green. |
| `CORE-1A.3` | `P0-M2` | `CORE` | `CORE-1A` | Implement config schema, YAML loader, snake_case to camelCase mapping, workflow contract, identity profile, and no-config first-run output. | `CORE-1A.2` | AC-002, TEST-002 | `defined` | `planned` | not started | Include dogfood example with `identity_profile: boilerplate_v1`. |
| `CORE-1A.4` | `P0-M2` | `CORE` | `CORE-1A` | Implement `ProjectLocator` local_path provider and path validation for dogfood repos. | `CORE-1A.3` | AC-003, TEST-002 | `defined` | `planned` | not started | Do not leak raw path into domain beyond `LocatedProject`. |
| `CORE-1A.5` | `P0-M2` | `CORE` | `CORE-1A` | Implement scan orchestration shell with per-project result collection and non-fatal source errors. | `CORE-1A.4` | AC-004, TEST-004 | `defined` | `planned` | not started | Local sources can be stubbed initially. |
| `CORE-1A.6` | `P0-M2` | `CORE` | `CORE-1A` | Implement user-local JSON cache path resolution, read/write, stale marker, and `DEVDECK_CACHE_PATH`. | `CORE-1A.5` | AC-014, TEST-014 | `defined` | `planned` | not started | Do not write into dogfood repos. |
| `CORE-1A.7` | `P0-M5` | `CORE` | `CORE-1A` | Implement user-local operator state path resolution, read/write, and `DEVDECK_STATE_PATH`. | `CORE-1A.6` | AC-022, TEST-017 | `defined` | `planned` | not started | Local state only; no repo writes. |
| `SRC-1A.0` | `P0-M2` | `SRC` | `SRC-1A` | Implement source contract probe types, support matrix, capability result shape, and drift fixture harness. | `CORE-1A.2` | AC-021, TEST-016 | `defined` | `planned` | not started | Probe before parsing; no broad markdown crawl. |
| `SRC-1A.1` | `P0-M2` | `SRC` | `SRC-1A` | Add adapter result/test fixture conventions shared by filesystem, git, docs, dev-cycle, GitHub. | `CORE-1A.2`, `SRC-1A.0` | TEST-004, TEST-016 | `defined` | `planned` | not started | Keeps adapters consistent. |
| `SRC-1A.2` | `P0-M2` | `SRC` | `SRC-1A` | Implement filesystem adapter for exists/not-directory/missing state and mtimes. | `SRC-1A.1`, `CORE-1A.4` | AC-004, TEST-004 | `defined` | `planned` | not started | Missing project does not abort scan. |
| `SRC-1A.3` | `P0-M2` | `SRC` | `SRC-1A` | Implement read-only git adapter for repo root, branch, default branch, dirty files, ahead/behind, recent commit. | `SRC-1A.1`, `CORE-1A.5` | AC-005, TEST-004 | `defined` | `planned` | not started | Use bounded shell wrapper. |
| `SRC-1A.4` | `P0-M2` | `SRC` | `SRC-1A` | Implement known-path docs resolver for current/testing/runtime/data/code/operations docs. | `SRC-1A.2`, `SPIKE-002` | AC-006, TEST-006 | `defined` | `planned` | not started | Include `docs/TESTING.md` fallback. |
| `SRC-1A.5` | `P0-M2` | `SRC` | `SRC-1A` | Parse current-state doc summary, roadmap position, current priorities, and needs-audit sections. | `SRC-1A.4` | AC-006, TEST-006 | `defined` | `planned` | not started | Preserve raw anchors on parse gaps. |
| `SRC-1A.6` | `P0-M2` | `SRC` | `SRC-1A` | Parse implementation plan active milestone/track/phase/slice and next ready leaf. | `SRC-1A.4` | AC-006, TEST-006 | `defined` | `planned` | not started | Start with table/heading parser. |
| `SRC-1A.7` | `P0-M2` | `SRC` | `SRC-1A` | Parse testing docs for known validation commands and mark unknown commands explicitly. | `SRC-1A.4` | AC-006, TEST-006 | `defined` | `planned` | not started | No invented commands. |
| `SRC-1A.8` | `P0-M3` | `SRC` | `SRC-1A` | Parse `.dev-cycle` latest run id plus canonical JSONL latest cycle, result, work, verification, review/ship, and risk. | `SRC-1A.2` | AC-008, TEST-008 | `defined` | `planned` | not started | Markdown brief log is fallback/display evidence only; handles missing `.dev-cycle`. |
| `GH-1A.1` | `P0-M3` | `GH` | `GH-1A` | Run SPIKE-001 and capture read-only `gh` JSON/error fixtures; use local Codex history only as private reference for dogfood signal interpretation. | `CORE-1A.1` | spike result | `defined` | `planned` | not started | Do not add transcript parsing in v1; redact tokens/secrets from any minimized notes. |
| `GH-1A.2` | `P0-M3` | `GH` | `GH-1A` | Implement `gh` availability, auth, repo resolution, timeout, and error-code mapping. | `GH-1A.1` | AC-017, TEST-007 | `defined` | `planned` | not started | Local scan remains usable on failure. |
| `GH-1A.3` | `P0-M3` | `GH` | `GH-1A` | Implement current-branch PR and open PR summary adapter. | `GH-1A.2` | AC-007, TEST-007 | `defined` | `planned` | not started | Avoid single-PR domain assumption. |
| `GH-1A.4` | `P0-M3` | `GH` | `GH-1A` | Implement checks, review decision, actionable count, and Codex pass/feedback best-effort adapter using baseline/pass/feedback signal mapping. | `GH-1A.3` | AC-007, AC-017, TEST-007 | `defined` | `planned` | not started | Align dogfood fixtures with `wait-codex-review.sh`; weak signals lower confidence. |
| `GH-1A.5` | `P0-M3` | `GH` | `GH-1A` | Integrate GitHub adapter into scan orchestration with cache fallback and source trust. | `GH-1A.4`, `CORE-1A.6` | AC-007, AC-017, TEST-007, TEST-014 | `defined` | `planned` | not started | No `--watch` commands. |
| `MODEL-1A.0` | `P0-M4` | `MODEL` | `MODEL-1A` | Implement dogfood v1 stable identity/source fingerprint helpers for the boilerplate workflow profile. | Q-020 dogfood decision, `CORE-1A.2` | AC-024, TEST-018 | `defined` | `planned` | dogfood profile decided | Leaf/slice primary anchor; generic workflow identity deferred. |
| `MODEL-1A.1` | `P0-M4` | `MODEL` | `MODEL-1A` | Define and export concrete TypeScript domain models matching specs. | `MODEL-1A.0` | TEST-009 | `defined` | `planned` | not started | Keep raw adapter output separate. |
| `MODEL-1A.2` | `P0-M4` | `MODEL` | `MODEL-1A` | Build source trust aggregation and project confidence rules. | `MODEL-1A.1`, `SRC-1A.3`, `SRC-1A.4` | AC-009, TEST-009 | `defined` | `planned` | not started | Trust is visible data. |
| `MODEL-1A.3` | `P0-M4` | `MODEL` | `MODEL-1A` | Build `ProjectStatus` builder and derived work-status rules. | `MODEL-1A.2`, `SRC-1A.8`, `GH-1A.5` | AC-009, TEST-009 | `defined` | `planned` | not started | Evaluate status rule order. |
| `MODEL-1B.1` | `P0-M4` | `MODEL` | `MODEL-1B` | Generate urgent blocker and ship-ready attention items from PR/check/review/dev-cycle states. | `MODEL-1A.3` | AC-010, TEST-010 | `defined` | `planned` | not started | Root-cause item first. |
| `MODEL-1B.2` | `P0-M4` | `MODEL` | `MODEL-1B` | Generate resume, trust-repair, hygiene, and unknown-state items. | `MODEL-1A.3` | AC-010, TEST-010 | `defined` | `planned` | not started | No noisy duplicates. |
| `MODEL-1B.3` | `P0-M4` | `MODEL` | `MODEL-1B` | Apply stable identity/fingerprint helpers to attention items and suppression rules. | `MODEL-1A.0`, `MODEL-1B.1`, `MODEL-1B.2` | AC-010, AC-024, TEST-010, TEST-018 | `defined` | `planned` | not started | Prevent feed flicker and stale local state. |
| `MODEL-1B.4` | `P0-M4` | `MODEL` | `MODEL-1B` | Implement command suggestions as display-only data with prohibited execution coverage. | `MODEL-1B.3`, `DEC-011` | AC-013, TEST-013 | `defined` | `planned` | not started | `executesInMvp: false`. |
| `MODEL-1B.5` | `P0-M4` | `MODEL` | `MODEL-1B` | Implement handoff generator from attention items and known doc path fallbacks. | `MODEL-1B.4`, `SRC-1A.4` | AC-010, AC-016, TEST-010, TEST-015 | `defined` | `planned` | not started | Keep prompt under 2-minute resume target. |
| `MODEL-1C.1` | `P0-M5` | `MODEL` | `MODEL-1C` | Define `OperatorPause`, pause reasons, resume triggers, and source fingerprint attachment. | `CORE-1A.7`, `MODEL-1A.0`, `MODEL-1B.3` | AC-022, AC-024, TEST-017, TEST-018 | `defined` | `planned` | not started | Model observed red-light workflow, not generic defer. |
| `MODEL-1C.2` | `P0-M5` | `MODEL` | `MODEL-1C` | Apply pause overlays to projects/items and split generated items into active feed and paused queue. | `MODEL-1C.1` | AC-022, TEST-017 | `defined` | `planned` | not started | Pause beats priority for active-feed eligibility. |
| `MODEL-1C.3` | `P0-M5` | `MODEL` | `MODEL-1C` | Generate `pause_review` items for due pauses, source changes, external-ready hints, and empty active feed. | `MODEL-1C.2` | AC-023, TEST-017 | `defined` | `planned` | not started | Review pause, do not mark original task done. |
| `MODEL-1D.1` | dogfood v2 | `MODEL` | `MODEL-1D` | Define user intent snapshot model attached to stable identity/fingerprint. | future Q-019/Q-021 decision | AC-025, TEST-019 | `deferred` | `deferred` | out of v1 | Dogfood v1 does not persist handoff/operator-note intent state. |
| `MODEL-1D.2` | dogfood v2 | `MODEL` | `MODEL-1D` | Include intent snapshot in detail/handoff generation when available. | `MODEL-1D.1`, future connector/capture design | AC-025, TEST-019 | `deferred` | `deferred` | out of v1 | Do not show "You asked" in v1. |
| `RANK-1A.1` | `P0-M4` | `RANK` | `RANK-1A` | Implement ranking band assignment and band-order sort. | `MODEL-1B.3` | AC-011, TEST-011 | `defined` | `planned` | not started | Blockers outrank hygiene. |
| `RANK-1A.2` | `P0-M4` | `RANK` | `RANK-1A` | Implement score within band, trust/freshness/effort modifiers, and deterministic tie-breakers. | `RANK-1A.1` | AC-011, TEST-011 | `defined` | `planned` | not started | No tuning without eval. |
| `RANK-1A.3` | `P0-M4` | `RANK` | `RANK-1A` | Implement diagnostic ranking explanation and nearby-item explanation fields for dogfood/evals. | `RANK-1A.2` | AC-011, TEST-011 | `defined` | `planned` | not started | Explanation names decisive factors but is not primary post-dogfood UI. |
| `RANK-1B.1` | `P0-M5` | `RANK` | `RANK-1B` | Implement pause-aware ranking: active feed excludes paused work, paused queue ranks by priority/review trigger/age. | `MODEL-1C.2`, `RANK-1A.2` | AC-022, AC-023, TEST-017 | `defined` | `planned` | not started | Priority does not break pause by itself. |
| `UI-1A.1` | `P0-M5` | `UI` | `UI-1A` | Implement CLI bootstrap for no-config, scan-start, and non-interactive smoke rendering. | `CORE-1A.5`, `RANK-1A.3` | AC-001, AC-002, TEST-001, TEST-012 | `defined` | `planned` | not started | Useful before full TUI. |
| `UI-1A.2` | `P0-M5` | `UI` | `UI-1A` | Implement Ink top item and top 5 feed layout from ranked items. | `UI-1A.1` | AC-012, TEST-012 | `defined` | `planned` | not started | Top item dominates. |
| `UI-1A.3` | `P0-M5` | `UI` | `UI-1A` | Implement project table as secondary map with plain-language copy. | `UI-1A.2` | AC-012, TEST-012 | `defined` | `planned` | not started | Table must not outrank feed. |
| `UI-1A.4` | `P0-M5` | `UI` | `UI-1A` | Implement detail pane with trust, source refs, checked timestamps, and dogfood diagnostic ranking explanation. | `UI-1A.2` | AC-018, TEST-012 | `defined` | `planned` | not started | Evidence visible during dogfood; keep default feed simple. |
| `UI-1A.5` | `P0-M5` | `UI` | `UI-1A` | Implement keyboard flow for selection, detail, rescan, handoff pane, command pane, quit. | `UI-1A.4` | AC-012, AC-013, TEST-012, TEST-013 | `defined` | `planned` | not started | No execution handlers. |
| `UI-1A.6` | `P0-M5` | `UI` | `UI-1A` | Implement handoff and command text panes with clipboard copy fallback to selectable text. | `UI-1A.5`, `DEC-012` | AC-013, AC-016, TEST-013 | `defined` | `planned` | not started | Copy failure is non-blocking. |
| `UI-1A.7` | `P0-M5` | `UI` | `UI-1A` | Implement loading, empty, stale cache, missing repo, GitHub unavailable, and parser-failed states. | `UI-1A.5` | AC-012, AC-017, AC-018, TEST-012 | `defined` | `planned` | not started | Plain-language errors. |
| `UI-1B.1` | `P0-M5` | `UI` | `UI-1B` | Render paused count, paused queue, pause reason, review trigger, and changed-since-pause warning. | `UI-1A.7`, `RANK-1B.1` | AC-022, AC-023, TEST-012, TEST-017 | `defined` | `planned` | not started | Active feed stays uncluttered. |
| `UI-1B.2` | `P0-M5` | `UI` | `UI-1B` | Add pause/unpause keyboard flow with small reason set and note fallback for `other`. | `UI-1B.1`, `CORE-1A.7` | AC-022, TEST-017 | `defined` | `planned` | not started | Local state mutation only; no repo command. |
| `EVAL-1A.1` | `P0-M5` | `EVAL` | `EVAL-1A` | Capture minimized dogfood source fixtures for docs/git/dev-cycle/GitHub states. | `SRC-1A.8`, `GH-1A.5` | TEST-015 | `defined` | `planned` | not started | Redact private content if needed. |
| `EVAL-1A.2` | `P0-M5` | `EVAL` | `EVAL-1A` | Implement automated top-item fixture eval and rubric output. | `EVAL-1A.1`, `RANK-1A.3`, `MODEL-1B.5` | AC-015, AC-016, TEST-015 | `defined` | `planned` | not started | Product gate. |
| `EVAL-1A.3` | `P0-M5` | `EVAL` | `EVAL-1A` | Run live dogfood eval and record false positives/negatives plus follow-up slices. | `UI-1A.7`, `EVAL-1A.2` | AC-015..AC-018 | `defined` | `planned` | not started | Must pass before MVP accepted. |
| `EVAL-1A.4` | `P0-M5` | `EVAL` | `EVAL-1A` | Run dogfood pause scenario: high-priority paused repo, lower-priority active repo, stale paused item. | `UI-1B.2`, `EVAL-1A.2` | AC-022, AC-023 | `defined` | `planned` | not started | Confirms red-light workflow maps to DevDeck. |
| `DOC-1B.1` | `P0-M5` | `DOC` | `DOC-1B` | Update current docs, testing commands, and traceability after implementation slices land. | each implementation slice | docs freshness | `defined` | `planned` | not started | Keep docs current during implementation. |

## Dependencies

- Local dogfood repos: `../actwyn`, `../concluv`, `../xeflabs/xef-scale`.
- CLI tools: Node 22+, npm, git, `gh`.
- GitHub auth: required for GitHub source trust, not for local-only scan.
- Fixture baseline: boilerplate docs/ops layout; dogfood repo fixtures should be concrete instances of that contract.

## Risks

- `gh` output may not expose Codex review state cleanly.
- Local Codex history may contain private tokens or credentials; v1 must not parse transcripts, and any minimized reference notes must redact secrets and avoid storing personal tokens.
- Boilerplate docs differ enough to break hard-coded paths.
- Boilerplate/project contract drift may break parser assumptions unless probes and fixtures land first.
- Ranking may feel wrong if hygiene/source-trust items outrank PR-loop blockers.
- Pause may hide important work if count/review triggers are weak.
- Unstable item identity may break pause, cache, suppression, and intent recovery.
- User intent recovery is dogfood v2; v1 should not present handoff/operator notes as remembered chat context.
- Agent transcript connectors are intentionally dogfood v2 scope; v1 must not claim arbitrary chat-history recovery.
- TUI may hide evidence and lose user trust.

## Acceptance

- Gate definitions live in `docs/06_ACCEPTANCE_TESTS.md`.
- Test commands live in `docs/current/TESTING.md` once implementation exists.
- Product quality gate lives in `docs/evals/dogfood-top-item-quality.md`.
