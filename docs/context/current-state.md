---
id: devdeck-current-state
type: current_state
title: DevDeck Current State
status: active
created_at: 2026-04-30
updated_at: 2026-04-30
scope: project
project_id: devdeck
provenance: user_curated_ai_assisted
sensitivity: private
retention: long_term
ai_include: true
---

# Current State

Status: implementation-ready docs and leaf roadmap complete. No implementation exists yet.

This repo is now the current truth for DevDeck. The second-brain ideation handoff is history and should be used only for background.

## Product / Project

DevDeck is a dogfood-first developer TUI for managing 3-5 simultaneous Claude Code/Codex projects. It is not a generic Kanban board. The MVP reads boilerplate docs, local git, GitHub PR/check/review state, and `.dev-cycle` / `codex-loop` state, then turns that evidence into a ranked priority feed and 2-minute handoff prompts.

## Current roadmap position

- current milestone: `P0-M2` local config and local-source status implementation
- active tracks: `CORE`, then `SRC`
- active phase: `CORE-1A`
- active slice: `CORE-1A.1` scaffold Node 22 + npm + TypeScript + Vitest project
- last accepted gate: implementation readiness review findings backfilled on 2026-04-30
- next gate: `CORE-1A.1` TypeScript/Node scaffold with documented checks
- canonical ledger: `docs/04_IMPLEMENTATION_PLAN.md`

## Implemented

- Boilerplate documentation and agent-command scaffold copied into this repo.
- DevDeck PRD, workflow ADR, status model, attention item model, ranking policy, display copy contract, dogfood eval, and project-stage reviews created.
- Implementation readiness review completed; roadmap is decomposed to commit-sized leaf slices.
- No TypeScript, Node, Ink, scanner, model, ranking, cache, or TUI implementation exists yet.

## Planned

- TypeScript/Node 22 + npm + Ink TUI.
- `devdeck.yml` config with explicit dogfood repos: `actwyn`, `concluv`, `xef-scale`.
- Pull-first scanners for boilerplate docs, git, GitHub through `gh`, and `.dev-cycle` state.
- `ProjectStatus` model with trust/freshness/confidence metadata.
- `AttentionItem` generator, deterministic ranking policy, top 1/top 5 feed, detail pane, and handoff prompt generator.
- MVP actions: open target, generate/copy handoff, display commands. DevDeck must not execute repo commands in MVP.

## Explicit non-goals

- Generic Kanban or issue-tracker replacement.
- Web/mobile dashboard in MVP.
- Running `codex-loop`, tests, merge, push, or other repo commands from DevDeck in MVP.
- Write-back to boilerplate docs, GitHub, or `.dev-cycle` state in MVP.
- Supporting non-developer or GitHub-less workflows in the developer MVP.

## Current priorities

1. Start `CORE-1A.1`: scaffold TypeScript/Node 22 + npm + strict TypeScript + Vitest.
2. Keep `npm run build`, `npm run typecheck`, and `npm test` green as soon as scripts exist.
3. Do not begin GitHub adapter implementation before `GH-1A.1` captures `gh` fixtures.

## Current risks / unknowns

- `Q-005`: Parser depth for boilerplate docs and `.dev-cycle` briefs needs to be right-sized.
- `Q-010`: Manual defer/pin/snooze remains undecided for post-MVP.
- `Q-012`: Final product name remains open and does not block implementation.

## Current validation

- Product eval: `docs/evals/dogfood-top-item-quality.md`.
- Automated checks: none yet. Do not invent commands before implementation exists.

## Needs audit

- Confirm GitHub access for dogfood repos.
- Confirm `gh auth status` in the user's shell before implementing GitHub scans.
- Inspect real `actwyn`, `concluv`, and `../xeflabs/xef-scale` boilerplate docs before locking parser fixtures.
- Verify whether `.dev-cycle` state is always present or must be missing-source tolerant.

## Links

- PRD: `docs/product/PRD.md`
- Initial questions: `docs/discovery/0001-initial-questions.md`
- Workflow ADR: `docs/decisions/ADR-0001-workflow-contract.md`
- Status model: `docs/specs/status-model.md`
- Attention item model: `docs/specs/attention-item-model.md`
- Ranking policy: `docs/specs/ranking-policy.md`
- Display copy contract: `docs/specs/display-copy-contract.md`
- Dogfood eval: `docs/evals/dogfood-top-item-quality.md`
- Reviews: `docs/reviews/`

---

Rules:

- Keep this file short.
- Do not append full history.
- Treat second-brain ideation as history, not active source of truth.
- If historical reasoning matters, link to discovery, ADR, or review docs.
