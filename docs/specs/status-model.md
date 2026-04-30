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

type SourceState = "ok" | "missing" | "stale" | "error" | "not_checked";

type Confidence = "high" | "medium" | "low" | "unknown";

type AttentionOwner = "user" | "agent" | "github" | "none" | "unknown";

type WorkStatus =
  | "ready_to_resume"
  | "waiting_for_human"
  | "agent_running"
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
adapters:
  github: gh
```

## Trust Metadata

```ts
interface SourceTrust {
  source: SourceName;
  state: SourceState;
  checkedAt: string; // ISO timestamp
  observedAt?: string; // source event timestamp when available
  confidence: Confidence;
  summary: string;
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
| dev_cycle | missing | No `.dev-cycle` state was found. |
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

interface CodexReviewStatus {
  state: "waiting" | "feedback" | "pass" | "timeout" | "api_error" | "unknown";
  lastActor?: string;
  lastCheckedAt?: string;
}

interface DevCycleStatus {
  present: boolean;
  runId?: string;
  lastBrief?: string;
  lastResult?: "NEXT TASK" | "DOC FIX" | "ALL CLEAR" | "shipped" | "blocked" | "unknown";
  lastCycle?: number;
  lastUpdatedAt?: string;
}

interface ValidationStatus {
  commandsKnown: boolean;
  lastResult?: "passing" | "failing" | "not_run" | "unknown";
  commands?: string[];
}
```

## Derived Work Status Rules

Evaluate in this order:

1. Missing repo path -> `blocked`, owner `user`, confidence `high`.
2. GitHub auth/API error with local state available -> status from local sources, confidence lowered.
3. Codex review feedback or changes requested -> `review_feedback`, owner `user`.
4. Failing required checks -> `checks_failing`, owner `user` unless clearly external.
5. Pending checks/review -> `checks_pending`, owner `github`.
6. Mergeable PR with passing checks and approval/pass reaction -> `ready_to_merge`, owner `user`.
7. Active slice or current task with no PR blocker -> `ready_to_resume`, owner `user`.
8. Docs older than git/GitHub activity -> `stale`, owner `user`.
9. No useful evidence -> `unknown`, owner `unknown`.

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

## MVP Error Codes

| Code | Trigger | User-facing behavior |
|---|---|---|
| `repo.path_missing` | Configured path does not exist. | Show blocked project and fix hint. |
| `repo.not_git` | Path exists but is not a git repo. | Show low-confidence local status. |
| `github.gh_missing` | `gh` binary unavailable. | Show local-only status and install/auth hint. |
| `github.auth_failed` | `gh` cannot access repo. | Show auth fix hint. |
| `github.rate_limited` | GitHub API rate limit or secondary limit. | Use cache if present and mark stale. |
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
- expected `ProjectStatus`
- expected trust metadata
