---
id: devdeck-display-copy-contract
type: spec
title: Display Copy Contract
status: active
created_at: 2026-04-30
updated_at: 2026-04-30
scope: specs
project_id: devdeck
provenance: user_curated_ai_assisted
sensitivity: private
retention: long_term
ai_include: true
---

# Display Copy Contract

## Purpose

DevDeck display copy turns raw repo state into action language. The user should not need to decode enums, git plumbing, or GitHub API fields to know what to do next.

## Voice

- Direct and concrete.
- Action-first.
- Evidence-backed.
- No hype.
- No generic project-management language.
- No raw enum values in primary UI.

## Primary Feed Structure

Each item shows:

```text
<repo>  <plain title>
Next: <one action>
Trust: <confidence> · <freshness> · <important missing source if any>
```

Example:

```text
actwyn  Codex feedback needs your response
Next: open the review comments, patch, push, then wait for Codex again.
Trust: High · checked 4m ago · GitHub and git agree
```

During dogfood, a diagnostic/detail view may show why an item was ranked first. After dogfood, the default feed should stay action-first and avoid "why this is #1" as primary user-facing copy.

## Project Table Columns

Use plain-language columns:

| Column | Meaning |
|---|---|
| Repo | Project id. |
| Focus | Priority and today-focus marker. |
| Needs you | Human-facing work status. |
| Current task | Active slice, PR, or inferred task. |
| Branch / PR | Branch and PR number or none. |
| Checks | Passing, pending, failing, missing, unknown. |
| Trust | High, medium, low, unknown. |
| Updated | Last checked or source age. |

Avoid raw UI strings like:

- `dirty=false`
- `gate not_run`
- `active slice found`
- `reviewDecision=CHANGES_REQUESTED`
- `mergeStateStatus=UNKNOWN`

## Keyboard Flow

MVP keyboard actions:

| Key | Action | Executes repo command? |
|---|---|---|
| `r` | Rescan sources. | no |
| `j` / down | Move selection down the feed. | no |
| `k` / up | Move selection up the feed. | no |
| `enter` | Open detail pane for selected item. | no |
| `h` | Show/copy handoff text. | no |
| `c` | Show/copy recommended command. | no |
| `o` | Show open target or PR URL command. | no |
| `q` | Quit. | no |

Every key that exposes a command must preserve the MVP safety boundary: DevDeck displays or copies commands, but does not execute them.

If clipboard integration is unavailable, the UI should show selectable text and say it was not copied. Clipboard failure must not block handoff or command display.

## Raw-to-Copy Mapping

| Raw state | Primary copy | Detail copy |
|---|---|---|
| `codex_feedback` | Codex feedback needs your response | Codex left actionable feedback on this PR. |
| `changes_requested` | Review changes requested | GitHub review is blocking merge. |
| `checks_failing` | Checks are failing | Required checks failed; inspect the named checks. |
| `ready_to_merge` | Ready to merge | Review and checks are passing under the current policy. |
| `resume_active_task` | Ready to resume active work | The repo has an active task and no higher-priority blocker. |
| `docs_stale` | Project docs look stale | Docs are older than repo activity and may mislead handoff. |
| `missing_source` | Configured repo is missing | The configured path does not exist on disk. |
| `github_auth` | GitHub state unavailable | `gh` could not read PR/check/review state. |
| `blocked` | Blocker needs a decision | The workflow reports a blocker that needs human action. |
| `unknown_state` | State is unclear | DevDeck does not have enough evidence to rank this confidently. |

## Trust Copy

Trust line format:

```text
Trust: <High|Medium|Low|Unknown> · checked <relative time> · <source note>
```

Source note examples:

- `GitHub and git agree`
- `local-only, GitHub auth failed`
- `using stale cache from 21m ago`
- `repo path missing`
- `.dev-cycle state not found`

## Command Display

Commands are copyable text. They are not executed in MVP.

```text
Command:
gh pr view 10 --web

DevDeck does not run this command in MVP.
```

Do not use button labels that imply execution, such as `Run`, `Merge`, or `Fix`.

Preferred labels:

- `Show command`
- `Copy command`
- `Copy handoff`
- `Open target`

Fallback label when clipboard is unavailable:

- `Show text`

## Handoff Copy

Handoff must be self-contained and short enough to paste into a Claude/Codex session:

```text
Resume <repo_id> at <path>.

Current task:
<current slice / PR / branch / active goal>

Why this is next:
<plain-language reason this item is ranked #1>

Next:
<one concrete next action>

Trust:
<sources checked, freshness, confidence, missing source if any>

Read first:
1. docs/context/current-state.md
2. docs/04_IMPLEMENTATION_PLAN.md around the active slice
3. docs/current/TESTING.md
4. relevant PR/review/check link if present

Commands:
<copyable commands, not automatically executed in MVP>
```

Handoff may keep "why this is next" because it is context for another coding session, not default feed chrome.

## Error and Empty States

| Situation | Copy |
|---|---|
| No configured projects | No projects configured. Add `devdeck.yml` with explicit repo paths. |
| All repos clear | No human-attention items found. Review the project table or rescan. |
| One repo missing | `<repo>` path is missing. Check `devdeck.yml` path. |
| GitHub unavailable | GitHub state unavailable. Local docs and git were still scanned. |
| Parser failed | DevDeck could not read the expected section. The raw file is still linked. |
| Scan in progress | Scanning configured repos. |
| Cache shown | Showing cached state because live scan failed. |

## First-run Copy

When `devdeck.yml` is missing, show a minimal config:

```yaml
projects:
  - id: actwyn
    path: ../actwyn
    priority: 100
    today_focus: true
  - id: concluv
    path: ../concluv
    priority: 90
  - id: xef-scale
    path: ../xeflabs/xef-scale
    priority: 70
workflow:
  contract: dev-cycle
adapters:
  github: gh
```

## Copy Tests

Display tests should assert:

- no raw enum strings appear in primary feed
- every item has a next action
- trust line includes confidence and freshness
- command display never says it executed
- missing source copy includes the path/config fix
