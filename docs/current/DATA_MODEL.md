# Data Model

Status: planned. Code, tests, and generated references become authoritative after implementation exists.

## Current Entities

| Entity | Purpose | Source |
|---|---|---|
| `ProjectConfig` | User policy for a configured repo: id, path, priority, today focus, optional GitHub repo override. | `docs/specs/status-model.md` |
| `LocatedProject` | Config plus locator, resolved path state, and repo metadata. | `docs/specs/status-model.md` |
| `SourceContractProbe` | Per-source contract id, detected version, compatibility, capabilities, and missing required capabilities. | `docs/specs/status-model.md` / `docs/specs/source-contract-versioning.md` |
| `SourceTrust` | Per-source state, checked time, confidence, summary, and fix hint. | `docs/specs/status-model.md` |
| `ProjectStatus` | Normalized repo status consumed by attention/ranking/UI. | `docs/specs/status-model.md` |
| `AttentionItem` | Human-actionable item with source refs, next action, ranking band, commands, handoff seed. | `docs/specs/attention-item-model.md` |
| `RankingResult` | Ordered feed item plus band/score/explanation. | `docs/specs/ranking-policy.md` |
| `CommandSuggestion` | Copyable command text with `executesInMvp: false`. | `docs/specs/attention-item-model.md` |
| `ScanCache` | Last scan data and freshness metadata. | DEC-004 |
| `ReadOnlyCommand` | Allowed scanner shell-out descriptor. | DEC-011 |

## Storage

| Store | Purpose | Source |
|---|---|---|
| `devdeck.yml` | Project config. | PRD / HLD |
| user-local JSON cache | Last scan fallback and freshness metadata. | DEC-004 |
| dogfood repos | Read-only source state. | ADR-0001 |

## Lifecycle States

| Entity | States | Notes |
|---|---|---|
| `SourceTrust.state` | `ok`, `missing`, `stale`, `error`, `unsupported`, `not_checked` | Source failures are data. |
| `SourceContractProbe.compatibility` | `supported`, `compatible_legacy`, `partial`, `unsupported`, `unknown` | Contract drift is detected before parsing. |
| `ProjectStatus.workStatus` | `ready_to_resume`, `waiting_for_human`, `agent_running`, `checks_pending`, `checks_failing`, `review_feedback`, `ready_to_merge`, `blocked`, `stale`, `unknown` | Derived in status builder. |
| `AttentionItem.rankingBand` | `urgent_human_blocker`, `ship_ready`, `resume_work`, `trust_repair`, `hygiene`, `unknown` | Bands sort before score. |
| `PullRequestStatus.state` | `open`, `closed`, `merged`, `draft`, `unknown` | Current branch PR is distinct from open PR summaries. |
| `ReadOnlyCommand.kind` | `git_read`, `gh_read` | Workflow/mutation commands are not represented. |

## Needs Audit

- Exact `ScanCache` JSON shape after first implementation.
- Whether `CodexReviewStatus` needs a richer activity model after SPIKE-001.
