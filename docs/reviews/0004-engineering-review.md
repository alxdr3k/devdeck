---
id: devdeck-review-0004-engineering
type: review
title: Engineering Review
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

# Engineering Review

## Verdict

Pass after backfill, with implementation concerns carried into `docs/04_IMPLEMENTATION_PLAN.md`, `docs/06_ACCEPTANCE_TESTS.md`, and `docs/current/*`.

The main engineering risk is silent trust drift: DevDeck could present a confident top item while one source is stale, missing, or partially parsed. The current specs name that risk and make trust metadata part of the domain model.

## Data Flow

```text
config
  -> project list
  -> source adapters
  -> ProjectStatus[]
  -> AttentionItem[]
  -> ranked feed
  -> TUI/detail/handoff
```

Each arrow needs fixture coverage before relying on live dogfood scans.

## Required Boundaries

- `src/adapters/*` owns filesystem/git/gh/markdown details.
- `src/domain/*` owns `ProjectStatus`, `AttentionItem`, ranking, trust, and handoff.
- `src/ui/*` owns Ink rendering and keyboard events.
- `src/cache/*` owns scan cache read/write and stale markers.
- UI must not call `gh`, git, or filesystem scanners directly.

## Failure Modes to Test

| Failure | Expected behavior |
|---|---|
| repo path missing | ProjectStatus with `repo.path_missing`; scan continues. |
| path exists but is not git | Low-confidence status; scan continues. |
| `gh` missing | Local docs/git status available; GitHub trust error. |
| `gh` auth fails | Same as above, with auth fix hint. |
| GitHub returns partial/check pending data | No crash; confidence reflects missing fields. |
| markdown heading missing | Parser error source trust; raw file anchor preserved. |
| `.dev-cycle` missing | Lower confidence where workflow expects it. |
| cache older than live source | Prefer live source; stale cache only as fallback. |
| top item tie | Deterministic tie breaker prevents flicker. |

## Implementation Order

1. TypeScript project scaffold with Vitest and strict TS.
2. Config loader and validation.
3. Domain types and fixture builders.
4. Filesystem/git/doc adapters.
5. `gh` adapter with timeout and JSON field tests.
6. ProjectStatus builder and trust model.
7. Attention item generator.
8. Ranking policy and explanation generator.
9. Handoff generator.
10. Ink feed/detail UI.

## Specific Concerns

- Do not start with SQLite. JSON cache is enough and easier to inspect.
- Do not parse `gh` human output. Use `--json` and `--jq` where possible.
- Add timeouts around shell-outs so a slow `gh` call does not freeze the TUI.
- Keep ranking pure and side-effect free.
- Use fixtures from real dogfood repos, but redact or minimize private content in committed fixtures if needed.
- Avoid parsing every boilerplate doc up front. Start with files named in the handoff prompt and expand when evals fail.

## Recommendation

Proceed, but make model and ranking tests the first meaningful green checks. Ink should come after the domain can rank a fixture feed without UI.
