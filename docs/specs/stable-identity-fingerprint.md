---
id: devdeck-stable-identity-fingerprint
type: spec
title: Stable Identity And Source Fingerprint
status: draft
created_at: 2026-04-30
updated_at: 2026-04-30
scope: specs
project_id: devdeck
provenance: user_curated_ai_assisted
sensitivity: private
retention: long_term
ai_include: true
---

# Stable Identity And Source Fingerprint

Status: joint review draft. This document is not an accepted design yet. It captures the current candidate model so the project can review the tradeoffs before implementation depends on it.

## Purpose

DevDeck likely needs stable identities before pause, cache, suppression, handoff, and future context-recovery features can work reliably. The exact contract is still under review in Q-020.

The candidate model separates two related values:

| Value | Question it answers | Should change when |
|---|---|---|
| stable item id | Is this the same conceptual attention item across scans? | The underlying anchor changes: PR number, slice id, source purpose, or root cause. |
| source fingerprint | Did the evidence behind this item change since the last scan/pause/handoff? | Relevant normalized source facts change. Timestamps and ranking score alone do not count. |

The intended split is: stable ids prevent feed flicker; fingerprints detect stale local state. This still needs validation against dogfood examples before acceptance.

## Review Questions

- What should count as the same conceptual item when a PR is rebased, retitled, closed/reopened, or superseded?
- Which evidence changes should make pause/cache/intent state stale, and which changes should be ignored as noise?
- How should DevDeck identify work that exists only in an agent chat or operator note before there is a PR, branch, or roadmap slice?
- How should branchless orphan work get a temporary identity and later attach to a leaf/slice?
- How should non-work conversation be excluded from item identity?
- How much local path information can appear in ids without making later service migration painful?
- What should happen when a paused high-priority item and a newly urgent unpaused item share the same repo or branch?
- What migration behavior is acceptable if the identity scheme changes after dogfood usage has created local state?

## Current Discussion Notes

The current user direction is that leaf/slice is the best anchor in the dogfood boilerplate workflow, but it may be too boilerplate-specific as a generic product default. A generic identity model should not hardcode "leaf" as the universal work-unit anchor.

This suggests a two-layer model plus a workflow-specific anchor strategy:

| Layer | Question | Candidate anchor |
|---|---|---|
| Work unit | Is this the same body of work? | chosen by workflow profile: leaf/slice for dogfood, PR for PR-centric flows, local orphan id when neither exists |
| Attention item | Why should the user look now? | work unit plus item kind plus current evidence anchor |
| Source fingerprint | Did the evidence change? | normalized repo/chat/source facts |

Branchless orphan work is possible. DevDeck may need a temporary local work-unit identity for user-agent interactions that have not produced a branch, PR, roadmap update, or repo mutation yet.

Non-work conversation is also possible. A simple question or casual message should not automatically create a work unit or attention item.

PR can be a reasonable default anchor in generic workflows, but it is not guaranteed to represent one coherent work unit because users can create very large PRs. Branch can be even weaker because it can be reused, renamed, or missing. DevDeck should track anchor confidence and avoid attaching durable local state too strongly to weak anchors.

## Principles

- Do not build ids from display copy, ranking score, checked time, or mutable summaries.
- Do not put absolute local paths in stable ids.
- Use observed source anchors first: PR number, branch, active slice, doc purpose, contract id, source error code.
- Use versioned canonicalization so id/fingerprint rules can migrate.
- Hash normalized evidence for fingerprints, not raw markdown or raw `gh` output.
- Preserve source refs for debugging, but keep ids compact and privacy-aware.
- If DevDeck cannot form a stable id, mark confidence lower and include a deterministic fallback reason.

## Candidate Core Types

```ts
type IdentityVersion = "v1";
type FingerprintAlgorithm = "sha256";

type StableAnchorKind =
  | "github_pr"
  | "git_branch"
  | "roadmap_slice"
  | "orphan_conversation"
  | "doc_purpose"
  | "source_contract"
  | "repo_path"
  | "project"
  | "manual_intent"
  | "fallback";

interface StableAnchor {
  kind: StableAnchorKind;
  value: string;
  secondary?: string;
}

interface StableIdentity {
  version: IdentityVersion;
  namespace: "attention_item" | "operator_pause" | "intent_snapshot";
  projectId: ProjectId;
  itemKind?: AttentionKind;
  anchors: StableAnchor[];
  id: string;
}

interface SourceFingerprint {
  version: IdentityVersion;
  algorithm: FingerprintAlgorithm;
  identityId: string;
  normalizedParts: FingerprintPart[];
  value: string;
}

interface FingerprintPart {
  key: string;
  value: string | number | boolean | null;
}
```

`ProjectId`, `AttentionKind`, and `SourceRef` are defined in `docs/specs/status-model.md` and `docs/specs/attention-item-model.md`.

## Candidate Stable Id Format

Format:

```text
v1:<namespace>:<project_id>:<item_kind>:<anchor_kind>:<anchor_value>[:<secondary>]
```

Examples:

| Item | Stable id |
|---|---|
| Codex feedback on PR 10 | `v1:attention_item:actwyn:codex_feedback:github_pr:10` |
| Ready-to-merge PR 14 | `v1:attention_item:concluv:ready_to_merge:github_pr:14` |
| Resume active slice `CORE-1A.1` | `v1:attention_item:devdeck:resume_active_task:roadmap_slice:CORE-1A.1` |
| Branchless orphan conversation | `v1:attention_item:devdeck:resume_active_task:orphan_conversation:<local_id>` |
| Missing configured path | `v1:attention_item:xef-scale:missing_source:repo_path:configured` |
| Source contract drift | `v1:attention_item:actwyn:source_contract_drift:source_contract:boilerplate_docs` |
| Project-level pause review | `v1:attention_item:actwyn:pause_review:project:actwyn` |

If an anchor value can contain unsafe characters, normalize to lowercase where appropriate, trim whitespace, replace path separators with `~`, and hash only the sensitive portion. Keep the original evidence in `SourceRef`, not the id.

## Candidate Anchor Priority

Choose the highest-quality anchor available:

1. Workflow-declared work-unit anchor, such as leaf/slice in the dogfood boilerplate profile.
2. GitHub PR number for PR-centric items when no stronger work-unit anchor is known.
3. Source contract id for contract drift.
4. Source purpose plus error code for missing docs/config/source issues.
5. Branch name only when no PR or slice anchor exists.
6. Temporary local conversation id for branchless orphan work, with low confidence until attached.
7. Project id for project-level pause/review items.
8. Fallback hash of normalized root-cause fields, with low confidence.

Do not use commit SHA as the primary stable id anchor for human-attention items. Commit SHA belongs in the fingerprint because it changes as work progresses.

## Candidate Fingerprint Inputs

Fingerprint inputs are normalized key/value pairs sorted by key before hashing.

| Item kind | Include in fingerprint | Exclude from fingerprint |
|---|---|---|
| `codex_feedback` | PR number, head SHA, review decision, actionable comment ids/count, check state | checked time, ranking score |
| `checks_failing` | PR number or branch, head SHA, failing check names/conclusions | raw log text |
| `ready_to_merge` | PR number, head SHA, review decision, required check state, mergeable state | display title |
| `resume_active_task` | active slice id, current-state anchor, branch, dirty flag, relevant doc mtime bucket | scan timestamp |
| `missing_source` | source name, missing purpose/error code, path state | absolute path unless hashed |
| `source_contract_drift` | contract id, detected version, missing capabilities | full raw file |
| `pause_review` | pause id, paused identity id, paused source fingerprint, review trigger | pause display copy |

Fingerprint changes should mean "recheck the local state attached to this item." For example, an operator pause should become stale when the item fingerprint changes even if the stable item id remains the same.

## Candidate Local State Attachment

Candidate rule: local user state attaches to stable ids plus source fingerprints:

```ts
interface LocalStateAttachment {
  identityId: string;
  sourceFingerprint: string;
  stateKind: "operator_pause" | "intent_snapshot" | "cache_reference";
  createdAt: string;
  updatedAt: string;
}
```

Rules:

- If `identityId` is missing, do not persist pause or intent state for that item.
- If `identityId` matches but fingerprint differs, keep the local state but mark it stale/needs review.
- If neither id nor fingerprint matches, treat the local state as orphaned and show it only in diagnostics.

## Candidate User Intent Snapshot

The context-switching problem "what did I ask the agent to do?" may be solved by attaching an optional intent snapshot to a stable identity:

```ts
interface UserIntentSnapshot {
  id: string;
  identityId: string;
  sourceFingerprint: string;
  instruction: string;
  expectedOutcome?: string;
  capturedFrom: "devdeck_handoff" | "operator_note" | "dev_cycle" | "future_chat_connector";
  capturedAt: string;
}
```

MVP can capture this only when DevDeck creates a handoff or when the user adds an operator note. Future chat connectors may capture the exact sent prompt from Claude Code/Codex logs if available. Until then, DevDeck must label the snapshot source clearly and avoid pretending it read private chat history it cannot access.

## Candidate Collision And Migration Policy

- `id` collisions across different root causes are bugs and need fixture coverage.
- If canonicalization changes, introduce a new identity version and migrate local state opportunistically.
- Old local state should never crash scan; mark it orphaned and show a repair/debug hint.
- Tests must cover stable id unchanged while fingerprint changes.

## Candidate Fixtures

| Fixture | Expected result |
|---|---|
| Same PR, new checked time | Same id, same fingerprint. |
| Same PR, new head SHA | Same id, changed fingerprint. |
| Same active slice, doc timestamp bucket changed | Same id, changed fingerprint. |
| Same display title with different PR number | Different id. |
| Paused item source changed | Same pause attachment, stale pause review. |
| Missing path with different absolute checkout root | Same id or hashed-sensitive component only. |
| Intent snapshot attached to item whose fingerprint changed | Intent remains visible but marked stale. |
