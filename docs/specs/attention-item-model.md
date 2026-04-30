---
id: devdeck-attention-item-model
type: spec
title: Attention Item Model
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

# Attention Item Model

## Purpose

An `AttentionItem` is one concrete reason a human should look at a repo. It is not a task card, raw status flag, or notification. It packages evidence, next action, trust, and handoff context into a unit the ranking policy can compare.

## Core Type

```ts
type AttentionKind =
  | "codex_feedback"
  | "changes_requested"
  | "checks_failing"
  | "ready_to_merge"
  | "resume_active_task"
  | "docs_stale"
  | "missing_source"
  | "source_contract_drift"
  | "github_auth"
  | "pause_review"
  | "blocked"
  | "unknown_state";

type Severity = "critical" | "high" | "medium" | "low" | "info";

type Effort = "under_2_min" | "under_10_min" | "deep_work" | "unknown";

type RankingBand =
  | "urgent_human_blocker"
  | "ship_ready"
  | "resume_work"
  | "operator_review"
  | "trust_repair"
  | "hygiene"
  | "unknown";

interface AttentionItem {
  id: string;
  identity?: StableIdentity;
  sourceFingerprint?: SourceFingerprint;
  projectId: ProjectId;
  kind: AttentionKind;
  severity: Severity;
  title: string;
  summary: string;
  nextAction: string;
  owner: AttentionOwner;
  effort: Effort;
  sourceRefs: SourceRef[];
  trust: SourceTrust[];
  rankingBand: RankingBand;
  rankInputs: RankInputs;
  commands: CommandSuggestion[];
  handoff: HandoffSeed;
  operatorPause?: OperatorPause;
  createdAt: string;
  updatedAt: string;
}
```

## Supporting Types

```ts
interface SourceRef {
  source: SourceName;
  label: string;
  path?: string;
  url?: string;
  anchor?: string;
  checkedAt: string;
}

interface RankInputs {
  band: RankingBand;
  projectPriority: number;
  todayFocus: boolean;
  itemWeight: number;
  severityWeight: number;
  ageMinutes: number;
  trustPenalty: number;
  effortPenalty: number;
  stalePenalty: number;
}

interface CommandSuggestion {
  label: string;
  command: string;
  purpose: string;
  executesInMvp: false;
}

interface HandoffSeed {
  currentTask: string;
  whyNext: string;
  next: string;
  trust: string;
  readFirst: string[];
  commands: CommandSuggestion[];
}
```

`OperatorPause` is defined in `docs/specs/operator-pause-model.md`.
`StableIdentity` and `SourceFingerprint` are draft fields under Q-020 review in `docs/specs/stable-identity-fingerprint.md`. Do not make pause/cache/intent behavior depend on them until Q-020 is accepted.

## Item Kinds

| Kind | Trigger | Default severity | Owner | Next action pattern |
|---|---|---|---|---|
| `codex_feedback` | Codex review comments or non-pass reaction requiring action | high | user | Read feedback, patch, push, wait again. |
| `changes_requested` | GitHub review decision changes requested | high | user | Address review comments. |
| `checks_failing` | Required checks failing | high | user | Inspect failing check logs. |
| `ready_to_merge` | PR approved/pass reaction and checks passing | high | user | Show merge/codex-loop command for the user to run. |
| `resume_active_task` | Active slice/current task with no higher blocker | medium | user | Resume implementation from handoff. |
| `docs_stale` | Docs/current-state older than git/GitHub activity | medium | user | Refresh docs or verify stale signal. |
| `missing_source` | Configured source path/doc missing | medium | user | Fix config or create missing source. |
| `source_contract_drift` | Boilerplate, `.dev-cycle`, git, or `gh` source contract is unsupported or missing a required capability | medium | user | Update DevDeck parser support, adjust repo docs, or accept degraded local-only state. |
| `github_auth` | `gh` unavailable/auth failed | medium | user | Authenticate or continue local-only. |
| `pause_review` | Paused work is due for review, changed since pause, or is the only remaining useful queue | medium | user | Review the pause reason and either unpause, keep paused, or update the note. |
| `blocked` | Source says blocked or required state unavailable | high | user | Resolve named blocker. |
| `unknown_state` | Too little evidence for reliable status | low | user | Open repo and inspect manually. |

## Generation Rules

- Generate items from normalized `ProjectStatus`, not raw adapter output.
- Prefer one high-quality item over many overlapping items for the same root cause.
- If a higher-priority root cause explains lower-level symptoms, suppress duplicates.
- Every item must include a concrete `nextAction`.
- Every item must include at least one `SourceRef`.
- Every item must be explainable without showing raw enum values.
- Missing/stale/error states generate items only when they affect trust or actionability.
- Unsupported or partial source contracts generate `source_contract_drift` only when they reduce actionability; otherwise they remain detail trust metadata.
- Paused items are excluded from the active feed by default; generate `pause_review` only when the pause itself needs attention.
- PR-loop blockers should be generated in `urgent_human_blocker` before resume/doc hygiene items.

## Suppression Examples

| Input state | Generate | Suppress |
|---|---|---|
| PR has Codex feedback and checks failing because feedback pushed broken code | `codex_feedback` plus failing checks in detail | duplicate `checks_failing` top-level item unless checks need separate action |
| Repo path missing | `missing_source` | git/github/docs parse items |
| Boilerplate docs contract unsupported, but GitHub has a clear failing-check blocker | `checks_failing` plus contract warning in detail | duplicate top-level `source_contract_drift` unless parser drift blocks the next action |
| `gh` auth failed but local docs show active slice | `github_auth`, optionally lower-ranked `resume_active_task` | unknown state panic item |
| Ready to merge with stale docs | `ready_to_merge` | `docs_stale` unless docs are required before merge |
| Priority 100 repo is operator-paused for milestone review | paused queue entry, and `pause_review` only if due/stale | original `resume_active_task` from active feed |

## Handoff Template Contract

Each item must be able to produce:

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

## ID Format

Use deterministic, versioned IDs so repeated scans do not flicker:

```text
v1:attention_item:<project_id>:<kind>:<anchor_kind>:<anchor_value>
```

Examples:

- `v1:attention_item:actwyn:codex_feedback:github_pr:10`
- `v1:attention_item:concluv:ready_to_merge:github_pr:14`
- `v1:attention_item:xef-scale:missing_source:repo_path:configured`
- `v1:attention_item:actwyn:source_contract_drift:source_contract:boilerplate_docs`
- `v1:attention_item:actwyn:pause_review:project:actwyn`

The id identifies the conceptual item. `sourceFingerprint` detects whether the evidence changed since a pause, handoff, cache entry, or intent snapshot was created.

## MVP Lifecycle

Most MVP items are derived, not persisted. Operator pause is the first local user-state exception because dogfood has proven the need to park high-judgment work without losing it. Generic defer/pin/snooze remain future features unless dogfood shows a separate need.
