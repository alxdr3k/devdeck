---
id: devdeck-review-0003-devex
type: review
title: DevEx Review
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

# DevEx Review

## Verdict

Pass after backfill: first-run config, missing repo, and `gh` failure behavior are now represented in PRD, acceptance tests, runbook, and current operations docs.

DevDeck is a developer tool for a developer who already lives in terminal, git, and `gh`. The current stack and command-display boundary fit that. The biggest abandonment risk is a first run that fails without telling the user exactly what to fix.

## First Five Minutes

The first usable path should be:

```text
npm install
npm run dev
DevDeck opens
No config? show sample devdeck.yml
Config present? scan repos
GitHub auth missing? keep local results and show gh auth fix
Top item appears or clear empty state appears
```

## Required First-run Behaviors

- Missing `devdeck.yml` prints a minimal config example with the three dogfood repos.
- Missing repo path reports the exact configured path and keeps scanning other repos.
- Missing `gh` reports that GitHub state is unavailable and local docs/git were still scanned.
- `gh` auth failure suggests `gh auth status` and `gh auth login`, but does not run them.
- No known test commands should be invented. Use docs/current/TESTING only after commands exist.
- Handoff and command output must be copyable from the terminal without formatting damage.

## DX Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Too much config before value | User drops before seeing the feed | Provide a minimal dogfood config example. |
| GitHub auth blocks all value | User returns to manual repo sweep | Degrade to local docs/git and mark trust lower. |
| TUI hides raw evidence | User does not trust ranking | Detail pane links sources and freshness. |
| Commands look executable | User fears accidental merge/test/push | Display-only labels and `executesInMvp: false`. |
| Parser errors feel mysterious | User edits docs blindly | Name the file/heading that failed. |

## Recommendation

Implement a tiny CLI bootstrap path before TUI polish so no-config, missing repo, and `gh` failure states are testable without perfect GitHub state.
