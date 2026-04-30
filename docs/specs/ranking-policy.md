---
id: devdeck-ranking-policy
type: spec
title: Ranking Policy
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

# Ranking Policy

## Principle

DevDeck does not claim there is a universal objective number one item.

The useful product claim is:

```text
right #1 = best human-attention ROI under the current user policy
```

Ranking must be deterministic, visible, and adjustable through project policy over time.

## Ranking Bands

Rank by hard band first, then score within the band. This prevents high-priority hygiene work from outranking a lower-priority PR loop blocker.

| Band | Kinds | Meaning |
|---|---|---|
| `urgent_human_blocker` | `codex_feedback`, `changes_requested`, `checks_failing`, `blocked` | Human action is blocking review, checks, or workflow progress. |
| `ship_ready` | `ready_to_merge` | Work can be shipped under current policy. |
| `resume_work` | `resume_active_task` | No higher blocker; resume implementation. |
| `trust_repair` | `github_auth`, `missing_source`, `source_contract_drift`, `unknown_state` | DevDeck cannot be trusted until the source is fixed. |
| `hygiene` | `docs_stale` | Useful cleanup but usually not the top human unblock. |

Band order:

```text
urgent_human_blocker > ship_ready > resume_work > trust_repair > hygiene > unknown
```

## Inputs

| Input | Source | Meaning |
|---|---|---|
| item kind | `AttentionItem.kind` | What kind of human action this is. |
| severity | `AttentionItem.severity` | How damaging delay is. |
| project priority | config | User-defined project importance, 0-100. |
| today focus | config | Daily boost for intentionally focused projects. |
| age | source timestamps | Older unresolved human-attention items rise gradually. |
| trust | `SourceTrust` | Low confidence lowers rank unless the item is about trust failure. |
| freshness | `SourceTrust.checkedAt` | Stale scans are less decisive. |
| effort | `AttentionItem.effort` | Quick unblock gets a small boost. |

## Default Kind Weights

| Kind | Weight |
|---|---:|
| `codex_feedback` | 100 |
| `changes_requested` | 95 |
| `checks_failing` | 90 |
| `ready_to_merge` | 88 |
| `blocked` | 80 |
| `github_auth` | 72 |
| `missing_source` | 70 |
| `source_contract_drift` | 68 |
| `resume_active_task` | 62 |
| `docs_stale` | 45 |
| `unknown_state` | 25 |

## Severity Weights

| Severity | Weight |
|---|---:|
| critical | 100 |
| high | 80 |
| medium | 50 |
| low | 20 |
| info | 5 |

## Score Formula

MVP scoring applies inside each ranking band:

```text
score =
  item_kind_weight
  + severity_weight
  + project_priority
  + today_focus_bonus
  + age_bonus
  + effort_bonus
  - trust_penalty
  - stale_penalty
```

Defaults:

| Component | Default |
|---|---:|
| today focus bonus | 25 |
| age bonus | `min(age_hours * 2, 24)` |
| effort bonus: under 2 min | 12 |
| effort bonus: under 10 min | 6 |
| effort bonus: deep work | 0 |
| trust penalty: medium | 10 |
| trust penalty: low | 25 |
| trust penalty: unknown | 35 |
| stale penalty: stale source | 15 |

Exception: trust-failure items such as `github_auth`, `missing_source`, and `source_contract_drift` should not be heavily penalized for their own missing source or unsupported contract. They exist to tell the user trust is broken.

## Tie Breakers

Use this order:

1. Higher ranking band.
2. Higher score within band.
3. Higher configured project priority.
4. `today_focus` true before false.
5. Higher severity.
6. Older `updatedAt`.
7. Lexicographic `projectId`.
8. Lexicographic `id`.

## Diagnostic Explanation Contract

Ranking must produce a compact diagnostic explanation for dogfood, tests, and debugging:

```text
Diagnostic:
Codex feedback is waiting on a priority 100 today-focus repo.
Checks were last confirmed 4m ago. Confidence: high.
```

The diagnostic explanation should include:

- item kind in plain language
- project priority/today focus when they materially changed rank
- blocking state or time sensitivity
- trust/freshness
- missing source when relevant

Default post-dogfood user UI should not make "why this is #1" primary copy. Keep the explanation available in diagnostic/detail surfaces and eval artifacts so ranking remains debuggable without making the main product feel complicated.

## Top 1 and Top 5

- Default screen emphasizes top 1.
- Top 5 is an MVP heuristic for peripheral awareness.
- The feed may contain fewer than 5 items.
- Project table is secondary and must not compete with the feed as the primary action surface.

## Defer and Override

Manual defer/pin/snooze is out of first MVP implementation. The ranking model should be designed so a future local override can add a modifier without changing item generation.

Future modifier shape:

```ts
interface RankingOverride {
  itemId: string;
  kind: "defer" | "pin" | "snooze";
  until?: string;
  reason?: string;
}
```

## Tests

Fixture tests should verify:

- top item is deterministic for identical inputs
- trust failures do not crash ranking
- missing repos still rank when actionable
- unsupported source contracts rank as trust repair only when they reduce actionability
- today focus changes rank in expected cases
- stale low-confidence items do not outrank fresh high-confidence blockers
- tie breakers prevent feed flicker
- PR-loop blockers outrank resume/doc hygiene across projects unless explicitly overridden later
