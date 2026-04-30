---
id: devdeck-review-0005-implementation-readiness
type: review
title: Implementation Readiness Review
status: complete
created_at: 2026-04-30
updated_at: 2026-04-30
scope: project_stage_review
project_id: devdeck
provenance: ai_generated_review
sensitivity: private
retention: long_term
ai_include: true
---

# Implementation Readiness Review

## Verdict

Ready to start implementation at `CORE-1A.1`.

The previous docs were directionally correct but not leaf-level enough. This review decomposed the roadmap into commit-sized slices and closed the implementation-blocking decisions around package set, command safety, clipboard fallback, dogfood identity, dev-cycle source shape, and v1/v2 agent-source boundaries.

## Findings Fixed

| Finding | Fix |
|---|---|
| Roadmap slices were too broad for direct implementation. | `docs/04_IMPLEMENTATION_PLAN.md` now splits CORE/SRC/GH/MODEL/RANK/UI/EVAL into leaf slices. |
| Command safety boundary was ambiguous because scanners must run `git`/`gh`. | DEC-011 allows bounded read-only scanner shell-outs and prohibits workflow/mutation commands. |
| Initial dependency set was not explicit. | DEC-010 defines Node 22/npm/TypeScript/TSX/Vitest/Ink/React/YAML/Zod. |
| Copy behavior could fail in some terminals. | DEC-012 requires fallback to selectable text. |
| Acceptance gates did not cover scanner command boundary or copy fallback. | AC-019 and AC-020 added. |
| "Why this is #1" may be too much for post-dogfood users. | DEC-013 keeps ranking explanation diagnostic after dogfood. |
| Q-020 was decided only in one place and other docs still treated identity as blocked. | Dogfood v1 identity/fingerprint is now accepted for the boilerplate profile; generic identity remains deferred. |
| `.dev-cycle` parser contract was stale. | JSONL is now canonical; Markdown brief log is fallback/display evidence only. |
| Codex review signals were under-modeled. | Status model now captures baseline/pass/feedback/acknowledgement signal shape aligned with `wait-codex-review.sh`. |
| Agent transcript and intent-capture scope could leak into v1. | Transcript/session connectors, handoff capture, and operator-note capture are explicitly dogfood v2. |
| Identity profile was implied but not configurable. | `devdeck.yml` now includes `workflow.identity_profile: boilerplate_v1` in schema/examples. |
| Item-scoped pause could attach to unstable generated ids. | Item pause now requires stable `identityId` plus `sourceFingerprint`; `itemId` is display/debug context only. |

## Remaining Open Questions

These do not block `CORE-1A.1`.

| Question | Blocks | Action |
|---|---|---|
| Q-005 parser depth | `SRC-1A.5` / `SRC-1A.6` | Start with known headings and expand from fixtures. |
| Q-010 defer/pin/snooze | partially superseded | Generic defer/pin/snooze remain future; dogfood operator pause is accepted in DEC-015. |
| Q-012 final name | packaging/release | Keep DevDeck as working name. |
| Q-020 generic identity | future non-boilerplate profiles | Dogfood v1 is decided; reopen only when adding generic/production workflows. |
| Q-019/Q-021/Q-022 intent and agent conversation source/classification | dogfood v2 | Do not persist handoffs, operator notes, or transcripts in v1. |

## Implementation Start Conditions

- Start at `CORE-1A.1`.
- Include `workflow.identity_profile: boilerplate_v1` in config schema and first-run sample.
- Do not implement GitHub adapter before `GH-1A.1` captures actual `gh` JSON/error fixtures.
- Do not implement transcript parsing, handoff capture, or operator-note intent capture in v1; local Codex history is private reference material only.
- Keep UI implementation after domain ranking can run from fixtures.
- Keep command suggestions data-only; no execution handlers.

## Review Result

No additional product or architecture decision is needed before `CORE-1A.1`.
