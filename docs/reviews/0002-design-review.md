---
id: devdeck-review-0002-design
type: review
title: Design Review
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

# Design Review

## Verdict

Pass after backfill: first-run TUI hierarchy and keyboard flow are now reflected in the display contract and acceptance tests.

The copy contract is directionally right. It prioritizes action language and trust instead of raw state. The remaining risk is not visual polish; it is that the TUI could become a dense dashboard instead of a single-focus action surface.

## Primary IA

The default screen should read in this order:

1. Top item.
2. Why this is top.
3. Next action and safe command/handoff affordances.
4. Top 5 queue.
5. Project table map.

The project table must never visually outrank the top item.

## MVP Keyboard Flow

Required before TUI implementation and now backfilled into `docs/specs/display-copy-contract.md`:

| Key | Action | Executes repo command? |
|---|---|---|
| `r` | Rescan sources. | no |
| `j` / down | Move selection down feed. | no |
| `k` / up | Move selection up feed. | no |
| `enter` | Open detail pane for selected item. | no |
| `h` | Show/copy handoff text. | no |
| `c` | Show/copy recommended command. | no |
| `o` | Show open target or PR URL command. | no |
| `q` | Quit. | no |

Buttons/labels must avoid implying command execution. Use `Show command`, `Copy command`, `Copy handoff`, and `Open target`.

## Required States

- No config.
- Config exists but one repo path is missing.
- `gh` unavailable or unauthenticated.
- GitHub slow/error but local docs/git are available.
- No human-attention items.
- Stale cache shown.
- Parser failed for one source.
- Top item selected, detail pane open.

## Copy Issues to Watch

- Avoid "needs you" if owner is `github` or `agent`; use "waiting on checks" or "agent running".
- Do not show score as primary copy. Score is diagnostic, not user value.
- Show freshness with relative time, but detail should preserve exact checked timestamp.

## Recommendation

Proceed to implementation, keeping hierarchy and command-safety copy exact.
