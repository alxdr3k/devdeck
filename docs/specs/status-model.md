---
id: devdeck-status-model
type: spec
title: Project Status Model
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

# Status Model

## Purpose

`ProjectStatus` is the normalized repo state that all UI, attention, ranking, and handoff code consumes. It hides raw adapter details while preserving enough evidence to explain trust.

## Principles

- Every configured repo returns a status, even when the path is missing.
- Source failures are data, not process-level exceptions.
- Domain code should not depend on raw `gh`, git, markdown, or filesystem output.
- Freshness and confidence are shown to the user.
- Status is descriptive. It does not mark work complete or execute commands.

## Core Types

```ts
type ProjectId = string;

type SourceName =
  | "config"
  | "filesystem"
  | "boilerplate_docs"
  | "git"
  | "github"
  | "dev_cycle"
  | "cache";

type SourceState = "ok" | "missing" | "stale" | "error" | "unsupported" | "not_checked";

type Confidence = "high" | "medium" | "low" | "unknown";

type SourceContractId =
  | "devdeck_config"
  | "filesystem_path"
  | "boilerplate_docs"
  | "dev_cycle"
  | "git_cli"
  | "github_gh";

type ContractCompatibility =
  | "supported"
  | "compatible_legacy"
  | "partial"
  | "unsupported"
  | "unknown";

type AttentionOwner = "user" | "agent" | "github" | "none" | "unknown";

type WorkflowContract = "dev-cycle";
type IdentityProfile = "boilerplate_v1";
type GitHubAdapterKind = "gh";

type WorkStatus =
  | "ready_to_resume"
  | "waiting_for_human"
  | "operator_paused"
  | "checks_pending"
  | "checks_failing"
  | "review_feedback"
  | "ready_to_merge"
  | "blocked"
  | "stale"
  | "unknown";
```

## Project Config

```ts
interface DevDeckConfig {
  projects: ProjectConfig[];
  workflow: WorkflowConfig;
  adapters?: AdapterConfig;
}

interface WorkflowConfig {
  contract: WorkflowContract;
  identityProfile: IdentityProfile;
}

interface AdapterConfig {
  github?: GitHubAdapterKind;
}

interface ProjectConfig {
  id: ProjectId;
  path: string;
  priority: number; // 0-100, higher means more important to user policy
  todayFocus?: boolean;
  githubRepo?: string; // owner/name override when remote detection is insufficient
  locator?: "local_path"; // MVP default; future providers must map into LocatedProject
}

interface LocatedProject {
  config: ProjectConfig;
  locator: "local_path";
  absolutePath?: string;
  pathState: "exists" | "missing" | "not_directory";
  repoName?: string;
}
```

Example:

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
  identity_profile: boilerplate_v1
adapters:
  github: gh
```

## Trust Metadata

```ts
interface SourceContractProbe {
  source: SourceName;
  contractId: SourceContractId;
  detectedVersion?: string;
  supportedVersions: string[];
  compatibility: ContractCompatibility;
  capabilities: string[];
  missingRequiredCapabilities: string[];
  evidence: ContractEvidenceRef[];
  checkedAt: string; // ISO timestamp
  errorCode?: string;
  fixHint?: string;
}

interface ContractEvidenceRef {
  label: string;
  path?: string;
  anchor?: string;
  checkedAt: string;
}

interface SourceTrust {
  source: SourceName;
  state: SourceState;
  checkedAt: string; // ISO timestamp
  observedAt?: string; // source event timestamp when available
  confidence: Confidence;
  summary: string;
  contract?: SourceContractProbe;
  errorCode?: string;
  fixHint?: string;
}
```

Trust examples:

| Source | State | User meaning |
|---|---|---|
| filesystem | missing | Configured repo path does not exist. |
| github | error | `gh` failed or auth is unavailable. |
| boilerplate_docs | stale | Current-state doc is older than git/GitHub activity. |
| boilerplate_docs | unsupported | Required boilerplate capability moved or changed shape. |
| dev_cycle | missing | No `.dev-cycle` state was found. |
| dev_cycle | unsupported | `.dev-cycle` exists but latest JSONL cycle cannot be interpreted under supported contracts. |
| cache | stale | Showing last scan because live source failed. |

## Project Status

```ts
interface ProjectStatus {
  project: ProjectConfig;
  summary: string;
  workStatus: WorkStatus;
  attentionOwner: AttentionOwner;
  currentTask?: CurrentTask;
  docs: DocsStatus;
  git: GitStatus;
  github: GitHubStatus;
  devCycle: DevCycleStatus;
  validation: ValidationStatus;
  contracts: SourceContractProbe[];
  operatorPause?: OperatorPause;
  trust: SourceTrust[];
  confidence: Confidence;
  scannedAt: string;
}
```

## Source Submodels

```ts
interface CurrentTask {
  title: string;
  source: SourceName;
  anchor?: string;
  status?: string;
  nextAction?: string;
}

interface DocsStatus {
  currentState: DocRefState;
  implementationPlan: DocRefState;
  testing: DocRefState;
  testingCandidates: string[];
  activeSlice?: string;
  staleAgainstGit?: boolean;
}

interface DocRefState {
  path: string;
  exists: boolean;
  updatedAt?: string;
  headingFound?: boolean;
  summary?: string;
}

interface GitStatus {
  isRepo: boolean;
  branch?: string;
  defaultBranch?: string;
  reviewBase?: string;
  dirty?: boolean;
  changedFiles?: string[];
  ahead?: number;
  behind?: number;
  recentCommit?: {
    sha: string;
    subject: string;
    authoredAt: string;
  };
}

interface GitHubStatus {
  available: boolean;
  repo?: string;
  currentBranchPr?: PullRequestStatus;
  openPullRequests?: PullRequestStatus[];
  checks?: ChecksStatus;
  reviews?: ReviewStatus;
  codexReview?: CodexReviewStatus;
}

interface PullRequestStatus {
  number: number;
  url: string;
  title: string;
  state: "open" | "closed" | "merged" | "draft" | "unknown";
  headRefName?: string;
  baseRefName?: string;
  mergeable?: "mergeable" | "blocked" | "unknown";
}

interface ChecksStatus {
  state: "passing" | "pending" | "failing" | "missing" | "unknown";
  failingChecks?: string[];
  pendingChecks?: string[];
}

interface ReviewStatus {
  decision: "approved" | "changes_requested" | "review_required" | "none" | "unknown";
  actionableCount?: number;
}

type CodexReviewSignalKind =
  | "pass_reaction"
  | "issue_comment"
  | "review_submission"
  | "inline_review_comment"
  | "eyes_ack"
  | "none";

interface CodexReviewBaseline {
  source: "push_event" | "pr_timeline" | "commit_date" | "unknown";
  at?: string;
  sourceRef?: string;
}

interface CodexReviewSignal {
  kind: CodexReviewSignalKind;
  actor?: string;
  occurredAt?: string;
  url?: string;
  afterBaseline?: boolean;
  summary?: string;
}

interface CodexReviewStatus {
  state: "waiting" | "feedback" | "pass" | "timeout" | "api_error" | "unknown";
  baseline?: CodexReviewBaseline;
  latestSignal?: CodexReviewSignal;
  passActor?: string;
  feedbackCount?: number;
  feedbackSignals?: CodexReviewSignal[];
  acknowledged?: boolean;
  lastActor?: string;
  lastCheckedAt?: string;
}

type DevCycleResult =
  | "shipped"
  | "blocked"
  | "all_clear"
  | "doc_fix_needed"
  | "legacy_next_task"
  | "legacy_doc_fix_needed"
  | "legacy_all_clear"
  | "unknown";

interface DevCycleStatus {
  present: boolean;
  runId?: string;
  canonicalJsonlPath?: string;
  markdownLogPath?: string;
  lastBrief?: string;
  lastResult?: DevCycleResult;
  lastCycle?: number;
  lastSummary?: string;
  lastActions?: string[];
  lastVerification?: string[];
  lastReviewShip?: string[];
  lastRisks?: string[];
  lastUpdatedAt?: string;
}

interface ValidationStatus {
  commandsKnown: boolean;
  lastResult?: "passing" | "failing" | "not_run" | "unknown";
  commands?: string[];
}

type PauseScope = "project" | "attention_item";

type PauseReason =
  | "milestone_review"
  | "decision_required"
  | "external_dependency"
  | "leaf_promotion"
  | "energy_heavy"
  | "waiting_for_user_window"
  | "other";

type PauseResumeTrigger =
  | "manual"
  | "source_changed"
  | "review_after"
  | "external_ready";

interface OperatorPause {
  id: string;
  scope: PauseScope;
  projectId: ProjectId;
  itemId?: string;
  identityId?: string; // required when scope === "attention_item"
  reason: PauseReason;
  note?: string;
  resumeTriggers: PauseResumeTrigger[];
  reviewAfter?: string;
  sourceFingerprint?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Derived Work Status Rules

Evaluate in this order:

1. Missing repo path -> `blocked`, owner `user`, confidence `high`.
2. Operator pause applies and no pause review/breakthrough item is due -> `operator_paused`, owner `user`, confidence unchanged.
3. GitHub auth/API error with local state available -> status from local sources, confidence lowered.
4. Codex review feedback or changes requested -> `review_feedback`, owner `user`.
5. Failing required checks -> `checks_failing`, owner `user` unless clearly external.
6. Pending checks/review -> `checks_pending`, owner `github`.
7. Mergeable PR with passing checks and approval/pass reaction -> `ready_to_merge`, owner `user`.
8. Active slice or current task with no PR blocker -> `ready_to_resume`, owner `user`.
9. Required source contract unsupported and actionability reduced -> `blocked`, owner `user`, confidence lowered.
10. Docs older than git/GitHub activity -> `stale`, owner `user`.
11. No useful evidence -> `unknown`, owner `unknown`.

`waiting_for_human` is a normalized intermediate state for docs or dev-cycle evidence that says work needs a human decision/setup but does not map to a specific PR/check/review blocker. The attention generator normally turns it into a `blocked` item with a concrete next action. DevDeck v1 does not emit an `agent_running` status because arbitrary agent-session state is not an accepted MVP source.

## Operator Pause Boundary

Operator pause is local user state applied after source scanning and before active-feed ranking. It is not source truth from a repo, and it must not be written into dogfood repos.

| Field | Meaning |
|---|---|
| `operatorPause` | Project-level pause if the whole repo is intentionally parked. |
| `AttentionItem.operatorPause` | Item-level pause if only one generated item is parked. |
| `sourceFingerprint` | Stable summary of the item/source state when paused, used to detect stale pauses. |

For `attention_item` scope, `identityId` and `sourceFingerprint` are required. `itemId` is allowed as a display/debug reference, but it must not be the durable attachment key.

Detailed semantics live in `docs/specs/operator-pause-model.md`.
Dogfood v1 stable id and source fingerprint rules live in `docs/specs/stable-identity-fingerprint.md`. Generic non-boilerplate identity rules remain deferred.

## Known Path Resolver

Dogfood repos share boilerplate conventions but are not byte-identical. Resolve docs by purpose, not one hard-coded path:

| Purpose | Preferred paths |
|---|---|
| current state | `docs/context/current-state.md` |
| implementation plan | `docs/04_IMPLEMENTATION_PLAN.md` |
| testing | `docs/current/TESTING.md`, then `docs/TESTING.md`, then `docs/testing.md` |
| code map | `docs/current/CODE_MAP.md`, then `docs/CODE_MAP.md`, then `docs/code-map.md` |
| runtime | `docs/current/RUNTIME.md`, then `docs/RUNTIME.md`, then `docs/runtime.md` |
| data model | `docs/current/DATA_MODEL.md`, then `docs/DATA_MODEL.md`, then `docs/data-model.md` |
| operations | `docs/current/OPERATIONS.md`, then `docs/OPERATIONS.md`, then `docs/operations.md` |

The resolver records all candidates it checked in source trust when a file is missing.

Fixture capture may also include boilerplate `docs/ops/**`, `ops/**`, `.claude/commands/**`, and `.agents/scripts/**` files as minimized test evidence. These paths are fixture/support inputs, not broad live-parser roots unless a specific capability is declared.

## Source Contract Probe

Before parsing a source, DevDeck probes the source contract and required capabilities. This is the guardrail for evolving boilerplate and project repos.

| Source | Contract id | Required MVP capabilities |
|---|---|---|
| config | `devdeck_config` | project id, path, priority, workflow contract, identity profile, adapter settings |
| filesystem | `filesystem_path` | configured path existence, directory state, readable metadata |
| boilerplate docs | `boilerplate_docs` | current-state evidence, implementation-plan position, testing/validation command source or explicit unknown; ops/support fixture shape for contract tests |
| dev-cycle | `dev_cycle` | latest run id and canonical JSONL latest cycle when workflow expects dev-cycle; Markdown brief log only as legacy/display fallback |
| git | `git_cli` | branch, dirty state, recent commit |
| GitHub | `github_gh` | PR, check, review fields and best-effort Codex pass/feedback signals when `gh` is available |

Probe results are cached with scan output. Unsupported or partial contracts lower source confidence and can generate `source_contract_drift` attention items. They do not throw through scan orchestration.

Detailed compatibility rules live in `docs/specs/source-contract-versioning.md`.

## Project Locator Boundary

MVP uses local filesystem paths because DevDeck runs locally for dogfood. Source adapters should depend on a `LocatedProject` abstraction, not `ProjectConfig.path` directly. This keeps later service-oriented providers possible:

| Provider | Status | Notes |
|---|---|---|
| `local_path` | MVP | Reads repos on the user's machine. |
| `remote_snapshot` | future | Could scan uploaded or synced repo snapshots. |
| `hosted_connector` | future | Could scan through a service-side GitHub/App connector. |
| `agent_bridge` | future | Could ask a local or remote agent process for repo state. |

Future providers must still produce the same `ProjectStatus` and `SourceTrust` contracts.

## Adapter Boundary

Adapters return source-specific results plus `SourceTrust`. The domain model builder is the only layer that combines sources. TUI components should not call `gh`, git, or markdown parsing directly.

## GitHub Adapter Scope

MVP must at least support:

- current branch PR, when one exists
- all open PRs for the repo as lower-detail context
- required check state for the current branch PR
- review decision and actionable comments for the current branch PR
- Codex pass/feedback state when detectable from GitHub activity

If current branch PR detection fails, the adapter should still return open PR summaries and a trust warning instead of collapsing GitHub state to `unknown`.

Codex signal mapping follows the existing boilerplate `wait-codex-review.sh` behavior for dogfood fixtures: establish a baseline from push event, PR timeline, or commit date; treat configured pass reactions from the expected actor as pass; treat issue comments, review submissions, and inline review comments after the baseline as feedback; preserve acknowledgement-only signals such as eyes reactions without marking work passed. Weak or ambiguous signals lower GitHub source confidence instead of inventing review state.

## MVP Error Codes

| Code | Trigger | User-facing behavior |
|---|---|---|
| `repo.path_missing` | Configured path does not exist. | Show blocked project and fix hint. |
| `repo.not_git` | Path exists but is not a git repo. | Show low-confidence local status. |
| `github.gh_missing` | `gh` binary unavailable. | Show local-only status and install/auth hint. |
| `github.auth_failed` | `gh` cannot access repo. | Show auth fix hint. |
| `github.rate_limited` | GitHub API rate limit or secondary limit. | Use cache if present and mark stale. |
| `contract.unsupported_version` | Source declares an unsupported contract version. | Mark source unsupported and show parser/workflow update hint. |
| `contract.required_capability_missing` | Probe cannot find a required capability. | Lower confidence and show missing capability evidence. |
| `contract.probe_failed` | Source could not be safely probed. | Keep other source statuses and stale cache fallback if available. |
| `contract.ambiguous` | Multiple candidates conflict for the same capability. | Use safest candidate, lower confidence, link evidence. |
| `docs.missing_current_state` | Boilerplate current state missing. | Lower confidence and suggest read order fallback. |
| `docs.parse_failed` | Expected heading/table cannot be parsed. | Preserve raw anchor and lower confidence. |
| `dev_cycle.missing` | `.dev-cycle` state absent. | Lower confidence only if workflow expects it. |

## Test Fixtures

Each fixture should include:

- config input
- filesystem/doc sample
- git sample result
- `gh` JSON sample or error
- `.dev-cycle` sample or missing marker
- source contract probe sample
- expected `ProjectStatus`
- expected trust metadata
