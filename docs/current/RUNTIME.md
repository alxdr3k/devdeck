# Runtime Flow

Status: planned. No runtime implementation exists yet.

## Planned Flow

```text
start DevDeck
  -> load config or show first-run config example
  -> resolve project paths
  -> scan sources with bounded adapter calls
  -> build ProjectStatus per configured repo
  -> generate AttentionItems
  -> rank by band and score
  -> render Ink feed/detail
  -> on user action, display/copy handoff or command text only
```

## Source Scan Flow

```text
LocatedProject
  -> filesystem state
  -> docs known-path resolver
  -> git read-only state
  -> gh GitHub state if available
  -> .dev-cycle latest brief if present
  -> SourceTrust[]
```

## Failure Modes

| Failure | Expected handling |
|---|---|
| Missing config | Show minimal `devdeck.yml` example; exit cleanly or wait for rescan. |
| Missing repo path | Produce `repo.path_missing` status for that project; scan others. |
| Path exists but is not git | Produce low-confidence local status; scan docs if useful. |
| Missing docs path | Record candidates checked in source trust; lower confidence. |
| `gh` missing/auth failure | Keep local docs/git status; show GitHub trust error and fix hint. |
| `gh` timeout | Use cache if present; mark GitHub stale/error. |
| `.dev-cycle` missing | Lower confidence only where workflow expects it. |
| Cache stale | Show stale cache as fallback, never as fresh source. |
| Command action selected | Show/copy command text; do not execute. |
| Clipboard unavailable | Show selectable text and report that copy was unavailable. |

## Command Boundary

Adapter scanner may run bounded read-only commands:

- `git` reads such as status, branch, rev-parse, log
- `gh` reads such as PR/check/review JSON queries

Generated item commands are never executed by DevDeck in MVP.

## Debug Path

Planned debug steps:

1. Inspect `devdeck.yml`.
2. Run config loader tests.
3. Inspect source trust for the affected project.
4. Check adapter fixture for the failing source.
5. Verify ranking fixture if top item feels wrong.
