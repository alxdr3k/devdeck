# Runtime Flow

Status: planned. No runtime implementation exists yet.

## Planned Flow

```text
start DevDeck
  -> load config or show first-run config example
  -> resolve project paths
  -> probe source contracts and capabilities
  -> scan sources with bounded adapter calls
  -> load local operator pause state
  -> build ProjectStatus per configured repo
  -> generate AttentionItems
  -> attach stable ids and source fingerprints
  -> split active feed and paused queue
  -> rank by band and score
  -> render Ink feed/paused/detail
  -> on user action, display/copy handoff or command text only
```

## Source Scan Flow

```text
LocatedProject
  -> filesystem state
  -> source contract probes
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
| Source contract unsupported | Mark source unsupported, keep other sources, and generate repair item only when actionability is reduced. |
| `gh` missing/auth failure | Keep local docs/git status; show GitHub trust error and fix hint. |
| `gh` timeout | Use cache if present; mark GitHub stale/error. |
| `.dev-cycle` missing | Lower confidence only where workflow expects it. |
| Cache stale | Show stale cache as fallback, never as fresh source. |
| Operator-paused item | Keep it out of the active feed; show it in paused queue with reason and review trigger. |
| Paused item changed | Generate a pause review item or paused-queue warning. |
| Local state fingerprint mismatch | Keep the local state but mark it stale/needs review. |
| User intent snapshot unavailable | Omit the "You asked" block; do not invent prior chat context. |
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
4. Inspect source contract probe compatibility and missing capabilities.
5. Check adapter fixture for the failing source.
6. Verify ranking fixture if top item feels wrong.
