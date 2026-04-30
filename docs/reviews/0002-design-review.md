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

Pass after design-loop backfill: default UI stays action-first, ranking explanation is diagnostic/detail copy, and pause/identity/dev-cycle decisions are aligned with the current specs.

The copy contract is directionally right. It prioritizes action language and trust instead of raw state. The remaining risk is not visual polish; it is that the TUI could become a dense dashboard instead of a single-focus action surface.

## Primary IA

The default screen should read in this order:

1. Top item.
2. Next action and trust.
3. Safe open target, command, handoff, and pause affordances.
4. Top 5 queue.
5. Compact paused count, with paused queue on demand.
6. Project table map.

The project table must never visually outrank the top item.
The default feed should not make "why this is #1" primary copy after dogfood. Keep ranking explanation in detail/diagnostic surfaces.

## MVP Keyboard Flow

Required before TUI implementation and now backfilled into `docs/specs/display-copy-contract.md`:

| Key | Action | Executes repo command? |
|---|---|---|
| `r` | Rescan sources. | no |
| `j` / down | Move selection down feed. | no |
| `k` / up | Move selection up feed. | no |
| `enter` | Open detail pane for selected item. | no |
| `p` | Pause selected item/project with a reason. | no repo command |
| `u` | Unpause selected paused item/project. | no repo command |
| `P` | Toggle paused queue. | no |
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
- Paused count visible and paused queue toggled.
- Paused item changed since pause.

## Copy Issues to Watch

- Avoid "needs you" if owner is `github`; use "waiting on checks" or other source-specific copy.
- Do not show score as primary copy. Score is diagnostic, not user value.
- Show freshness with relative time, but detail should preserve exact checked timestamp.

## Recommendation

Proceed to implementation, keeping hierarchy and command-safety copy exact.
