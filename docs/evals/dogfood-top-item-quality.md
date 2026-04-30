---
id: devdeck-eval-dogfood-top-item-quality
type: eval
title: Dogfood Top Item Quality
status: active
created_at: 2026-04-30
updated_at: 2026-04-30
scope: evals
project_id: devdeck
provenance: user_curated_ai_assisted
sensitivity: private
retention: long_term
ai_include: true
---

# Dogfood Top Item Quality Eval

## Goal

Evaluate whether DevDeck's top ranked item is useful enough to replace the user's manual repo sweep.

The eval does not ask whether the ranking is universally correct. It asks whether the top item is the best human-attention ROI under the configured dogfood policy.

## Repos

Initial dogfood config:

| Repo | Path | Priority | Notes |
|---|---|---:|---|
| actwyn | `../actwyn` | 100 | Existing in current workspace. |
| concluv | `../concluv` | 90 | Existing in current workspace. |
| xef-scale | `../xeflabs/xef-scale` | 70 | Existing in current workspace. |

## Eval Inputs

Each eval run captures:

- `devdeck.yml`
- source scan JSON for each repo
- source contract probe JSON for each repo
- derived `ProjectStatus[]`
- generated `AttentionItem[]`
- ranked feed
- top item explanation
- generated handoff prompt
- evaluator notes

Do not require live GitHub in deterministic CI fixtures. Keep live dogfood runs separate from fixture tests.

## Procedure

1. Run a scan across the dogfood repos.
2. Save raw adapter summaries and normalized statuses as a fixture.
3. Generate attention items and ranked feed.
4. Compare top item against manual human review of docs, git, GitHub, `.dev-cycle`, and source contract probes.
5. Paste the generated handoff into a fresh Claude/Codex session and measure whether it is enough to resume.
6. Record false positives, false negatives, stale-source surprises, and copy issues.

## Rubric

Score each category 0-3.

| Category | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Correctness | Top item is wrong or misleading. | Plausible but misses a higher blocker. | Good top item with minor caveat. | Clearly best next human action. |
| Actionability | No concrete next action. | Action is vague. | Action is concrete but missing context. | Action is exact and immediately usable. |
| Trust | Sources hidden or misleading. | Some source info but missing freshness. | Sources and freshness shown. | Trust explains confidence and missing sources clearly. |
| Ranking explanation | No why. | Explains only score/enum. | Explains main factors. | Explains why this beats nearby alternatives. |
| Handoff quality | Cannot resume. | Resume requires manual repo sweep. | Resume works with one extra lookup. | Resume works within 2 minutes. |
| Safety | Suggests executing risky commands. | Command boundary unclear. | Commands are display-only. | Display-only boundary is explicit and helpful. |

## Passing Bar

MVP dogfood pass:

- Total score at least 14 of 18.
- No category below 2.
- No command execution ambiguity.
- No silent source failure.

## Failure Triage

| Failure | Likely fix |
|---|---|
| Wrong top item | Adjust item generation before weight tuning. |
| Correct item but bad explanation | Fix display copy contract. |
| Missing blocker | Add source adapter/parser coverage. |
| Source format changed | Add or update contract probe/parser fixture before changing ranking. |
| Stale source trusted too much | Increase stale/trust penalty and copy freshness. |
| Handoff too long | Tighten handoff template. |
| Handoff missing context | Add read-first anchors or current-task extraction. |

## Eval Artifacts

Future fixture location:

```text
tests/fixtures/dogfood/
  actwyn/
  concluv/
  xef-scale/
  ranked-feed.expected.json
  handoff.expected.txt
```

Until implementation exists, this file is the eval contract.
