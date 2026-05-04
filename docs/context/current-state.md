---
id: devdeck-current-state
type: current_state
title: DevDeck Current State
status: active
created_at: 2026-04-30
updated_at: 2026-05-04
scope: project
project_id: devdeck
provenance: user_curated_ai_assisted
sensitivity: private
retention: long_term
ai_include: true
---

# Current State

Status: Node/TypeScript scaffold is in place; local config and source implementation remain planned.

This repo is now the current truth for DevDeck. The second-brain ideation handoff is history and should be used only for background.

## Product / Project

DevDeck is a dogfood-first developer TUI for managing 3-5 simultaneous Claude Code/Codex projects and agent sessions. It is not a generic Kanban board. The MVP reads boilerplate docs, local git, GitHub PR/check/review state, and `.dev-cycle` / `codex-loop` state, then turns that evidence into a ranked priority feed and on-demand 2-minute handoff prompts.

## Current roadmap position

- current milestone: `P0-M2` local config and local-source status implementation
- active tracks: `CORE`, then `SRC`
- active phase: `CORE-1A`
- active slice: `CORE-1A.2` create source/test directory skeleton and export domain placeholder types
- last accepted gate: `CORE-1A.1` TypeScript/Node scaffold with documented checks
- next gate: `CORE-1A.2` source/test skeleton stays compile-green
- canonical ledger: `docs/04_IMPLEMENTATION_PLAN.md`

## Implemented

- Boilerplate documentation and agent-command scaffold copied into this repo.
- DevDeck PRD, workflow ADR, status model, attention item model, ranking policy, display copy contract, dogfood eval, and project-stage reviews created.
- Implementation readiness review completed; roadmap is decomposed to commit-sized leaf slices.
- Node 22/npm scaffold with strict TypeScript, `tsx` dev loader, Vitest, and CLI startup smoke test exists.
- No config loader, Ink UI, scanner, model, ranking, or cache implementation exists yet.

## Planned

- TypeScript/Node 22 + npm + Ink TUI.
- `devdeck.yml` config with explicit dogfood repos: `actwyn`, `concluv`, `xef-scale`.
- Pull-first scanners for boilerplate docs, git, GitHub through `gh`, and `.dev-cycle` state.
- Source contract probes so evolving boilerplate/project repo shapes degrade safely instead of breaking scans.
- `ProjectStatus` model with trust/freshness/confidence metadata.
- `AttentionItem` generator with deterministic ranking policy, top 1/top 5 feed, detail pane, and handoff prompt generator. Stable identity/fingerprint behavior is implementable for dogfood v1 under the boilerplate workflow profile.
- Operator pause state so high-judgment/external-dependency/milestone-review work can be parked outside the active feed without being forgotten.
- Draft user intent and agent conversation source design for dogfood v2. Dogfood v1 does not persist handoff text, operator notes, or local transcripts as context recovery state.
- MVP actions: open target, generate/copy handoff, display commands, and local pause/unpause state. DevDeck must not execute repo commands in MVP.

## Explicit non-goals

- Generic Kanban or issue-tracker replacement.
- Web/mobile dashboard in MVP.
- Running `codex-loop`, tests, merge, push, or other repo commands from DevDeck in MVP.
- Write-back to boilerplate docs, GitHub, or `.dev-cycle` state in MVP.
- Generic defer/pin/snooze beyond operator pause.
- Supporting non-developer or GitHub-less workflows in the developer MVP.

## Current priorities

1. Start `CORE-1A.2`: create source/test directory skeleton and export domain placeholder types without behavior.
2. Keep `npm run build`, `npm run typecheck`, and `npm test` green.
3. Do not begin GitHub adapter implementation before `GH-1A.1` captures `gh` fixtures.

## Current risks / unknowns

- `Q-005`: Parser depth for boilerplate docs and `.dev-cycle` briefs needs to be right-sized.
- `Q-016`: Boilerplate/project contract drift needs fixture coverage before parser assumptions harden.
- `Q-010`: Generic defer/pin/snooze remains future; dogfood operator pause is accepted as Q-018 / DEC-015.
- `Q-012`: Final product name remains open and does not block implementation.
- `Q-019`: Context recovery for prior user instructions is deferred to dogfood v2, including handoff/operator-note capture.
- `Q-020`: Stable item id/source fingerprint design is decided only for dogfood v1: boilerplate workflow profile, leaf/slice primary anchor, PR/branch as evidence links. Generic identity is deferred.
- `Q-021`: AI agent conversation tracking remains open and is moved toward dogfood v2. Current sources cannot reconstruct arbitrary chat history.
- `Q-022`: Work versus non-work conversation classification remains open.

## Current validation

- Product eval: `docs/evals/dogfood-top-item-quality.md`.
- Automated checks: `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, `npm run dev`, `git diff --check`.

## Needs audit

- Confirm GitHub access for dogfood repos.
- Confirm `gh auth status` in the user's shell before implementing GitHub scans.
- Use boilerplate docs/ops layout as the source fixture baseline, including `.dev-cycle` JSONL and workflow support artifacts when they define parser behavior. Then inspect real `actwyn`, `concluv`, and `../xeflabs/xef-scale` as concrete instances before locking parser fixtures.
- Capture source contract fixtures for current and drifted boilerplate docs/ops shapes.
- Capture a dogfood pause scenario with one high-priority paused repo and one lower-priority active repo.
- Implement only the dogfood v1 identity profile before pause/cache attachments; reopen generic identity later.
- Use local Codex conversation history as reference material for GitHub/Codex flow fixtures when helpful, but do not record personal tokens or secrets.
- Do not treat DevDeck-generated handoffs/operator notes as dogfood v1 context recovery state. Reopen Q-019/Q-021 for dogfood v2 before adding this behavior.
- Verify whether `.dev-cycle` state is always present or must be missing-source tolerant.

## Links

- PRD: `docs/product/PRD.md`
- Initial questions: `docs/discovery/0001-initial-questions.md`
- Workflow ADR: `docs/decisions/ADR-0001-workflow-contract.md`
- Status model: `docs/specs/status-model.md`
- Attention item model: `docs/specs/attention-item-model.md`
- Ranking policy: `docs/specs/ranking-policy.md`
- Display copy contract: `docs/specs/display-copy-contract.md`
- Source contract versioning: `docs/specs/source-contract-versioning.md`
- Operator pause model: `docs/specs/operator-pause-model.md`
- Stable identity/fingerprint: `docs/specs/stable-identity-fingerprint.md`
- Agent conversation source: `docs/specs/agent-conversation-source.md`
- Dogfood eval: `docs/evals/dogfood-top-item-quality.md`
- Reviews: `docs/reviews/`

---

Rules:

- Keep this file short.
- Do not append full history.
- Treat second-brain ideation as history, not active source of truth.
- If historical reasoning matters, link to discovery, ADR, or review docs.
