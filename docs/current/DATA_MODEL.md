# Data Model

Status: planned. Code, tests, and generated references become authoritative after implementation exists.

## Current Entities

| Entity | Purpose | Source |
|---|---|---|
| `ProjectConfig` | User policy for a configured repo: id, path, priority, today focus, optional GitHub repo override. | `docs/specs/status-model.md` |
| `LocatedProject` | Config plus locator, resolved path state, and repo metadata. | `docs/specs/status-model.md` |
| `SourceContractProbe` | Per-source contract id, detected version, compatibility, capabilities, and missing required capabilities. | `docs/specs/status-model.md` / `docs/specs/source-contract-versioning.md` |
| `SourceTrust` | Per-source state, checked time, confidence, summary, and fix hint. | `docs/specs/status-model.md` |
| `OperatorPause` | Local user pause overlay for intentionally parked project/item work. | `docs/specs/operator-pause-model.md` |
| `StableIdentity` | Draft versioned identity for conceptual attention items and local state attachments. | `docs/specs/stable-identity-fingerprint.md` / Q-020 |
| `SourceFingerprint` | Draft versioned hash of normalized evidence used to detect stale local state. | `docs/specs/stable-identity-fingerprint.md` / Q-020 |
| `UserIntentSnapshot` | Optional local/user-declared instruction context attached to an identity after Q-020 is accepted. | `docs/specs/stable-identity-fingerprint.md` / Q-019 / Q-020 |
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
| user-local JSON state | Operator pause overlays now; source fingerprints and optional intent snapshots after Q-020 review. | DEC-015 / DEC-016 proposed |
| dogfood repos | Read-only source state. | ADR-0001 |

## Observed Vs Local State

| Term | Meaning | Examples |
|---|---|---|
| observed source state | Facts DevDeck reads from repo files, git, GitHub, or `.dev-cycle`. | PR checks failing, active slice, branch dirty. |
| local user state | DevDeck product state stored for this user outside dogfood repos. | operator pause, intent snapshot, local cache metadata. |
| user-declared state | Local user state that DevDeck did not independently verify. | "waiting on S3 setup", "review this after lunch", operator note. |

User-declared state can guide ranking and display, but it must be labeled as user/operator context and must not be presented as observed repo truth.

## Lifecycle States

| Entity | States | Notes |
|---|---|---|
| `SourceTrust.state` | `ok`, `missing`, `stale`, `error`, `unsupported`, `not_checked` | Source failures are data. |
| `SourceContractProbe.compatibility` | `supported`, `compatible_legacy`, `partial`, `unsupported`, `unknown` | Contract drift is detected before parsing. |
| `ProjectStatus.workStatus` | `ready_to_resume`, `waiting_for_human`, `operator_paused`, `agent_running`, `checks_pending`, `checks_failing`, `review_feedback`, `ready_to_merge`, `blocked`, `stale`, `unknown` | Derived in status builder. |
| `AttentionItem.rankingBand` | `urgent_human_blocker`, `ship_ready`, `resume_work`, `operator_review`, `trust_repair`, `hygiene`, `unknown` | Bands sort before score. |
| `OperatorPause.reason` | `milestone_review`, `decision_required`, `external_dependency`, `leaf_promotion`, `energy_heavy`, `waiting_for_user_window`, `other` | Pause gates active-feed eligibility. |
| `PullRequestStatus.state` | `open`, `closed`, `merged`, `draft`, `unknown` | Current branch PR is distinct from open PR summaries. |
| `ReadOnlyCommand.kind` | `git_read`, `gh_read` | Workflow/mutation commands are not represented. |

## Needs Audit

- Exact `ScanCache` JSON shape after first implementation.
- Whether `CodexReviewStatus` needs a richer activity model after SPIKE-001.
