---
id: devdeck-operator-pause-model
type: spec
title: Operator Pause Model
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

# Operator Pause Model

## Purpose

Operator pause models the user's current split-tab workflow: a repo can reach a point that is important but cognitively expensive, decision-heavy, waiting on external setup, or ready for human promotion/review. The user marks that tab with `!` in the chat UI today, which makes the tab visually red and lets the user focus only on unmarked tabs.

DevDeck should preserve that behavior in product terms:

- active feed = work the user is willing to focus now
- paused queue = important work intentionally parked because it requires higher judgment, setup, or a later review window

This is not generic task completion, and it is not the same as `defer`, `snooze`, or `pin`.

## Principles

- Pause is explicit operator state. DevDeck should not infer cognitive load from code shape alone.
- Pause does not mean done, blocked by DevDeck, or low priority.
- Project priority remains strategic importance; pause controls active-feed eligibility.
- Paused work must remain visible in a separate queue with reason, age, and review trigger.
- Paused state is local user state for dogfood. Do not write it into dogfood repos.
- A pause should survive rescans but become stale when the underlying source item changes.

## Core Type

```ts
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
  reason: PauseReason;
  note?: string;
  resumeTriggers: PauseResumeTrigger[];
  reviewAfter?: string; // ISO timestamp
  sourceFingerprint?: string; // SourceFingerprint.value from the paused item
  createdAt: string;
  updatedAt: string;
}
```

Stable id and fingerprint semantics are draft review material in `docs/specs/stable-identity-fingerprint.md` and are tracked by Q-020. The pause model should not depend on final identity/fingerprint behavior until Q-020 is accepted.

## Pause Reasons

| Reason | Meaning | Examples |
|---|---|---|
| `milestone_review` | The repo reached a planned milestone and needs human review. | MVP slice done; check product direction before next slice. |
| `decision_required` | Progress needs a judgment call. | Architecture trade-off, scope cut, unclear acceptance. |
| `external_dependency` | Work waits on setup outside the repo. | S3 bucket, OAuth app, billing, deploy secret, DNS. |
| `leaf_promotion` | A broad roadmap item needs to be decomposed into implementable leaves. | Promote review finding into slices. |
| `energy_heavy` | Work is valid but currently too cognitively expensive. | Requires deep reading or cross-repo reasoning. |
| `waiting_for_user_window` | User chose to handle it in a later work window. | Review after lunch or tomorrow. |
| `other` | Escape hatch; should include a note. | Anything not covered above. |

## Feed Semantics

DevDeck produces two queues:

```text
ProjectStatus + AttentionItem + OperatorPause
  -> active attention feed
  -> paused queue
```

Default behavior:

1. If an item or project is paused, it is excluded from the active feed.
2. Paused items appear in the paused queue with reason, age, source freshness, and review trigger.
3. Project priority ranks items inside each queue, but priority does not automatically pull paused work back into the active feed.
4. If the active feed is empty, DevDeck should promote the paused queue as the next review surface instead of claiming everything is clear.

## Priority Conflict Policy

Pause and priority answer different questions:

| Signal | Question it answers |
|---|---|
| `priority` | How important is this repo to the user's strategy? |
| `today_focus` | Is this repo intentionally boosted today? |
| `operator_pause` | Is the user willing to spend judgment/energy on this right now? |

When they conflict, `operator_pause` wins for active-feed eligibility. A priority 100 paused repo should not occupy the top active item unless the pause is stale or explicitly reviewed. The same repo should still rank high inside the paused queue.

## Breakthrough Rules

Do not let pause become a silent black hole.

An active-feed item may be generated for paused work only when the item is about the pause itself, not the original task:

- pause review is due
- source changed since the pause fingerprint, after Q-020 defines accepted fingerprint semantics
- external dependency may now be ready
- active feed is empty and paused work is the next best review surface

Default dogfood behavior should avoid breaking through just because a paused repo is high priority. Empty active feed is the exception: DevDeck should show the highest-ranked paused item as a pause review candidate, while preserving the original task's paused state until the user unpauses it. If future live signals need urgent interruption, add an explicit `breakthrough` policy rather than relying on priority.

## Storage

Dogfood storage is user-local JSON, separate from scan cache if practical:

```text
DEVDECK_STATE_PATH
  or default user-local app state path
```

The state should include pause records and, after Q-020 is accepted, enough item/source fingerprint data to detect when a pause may be stale. DevDeck must not write pause state into the dogfood repos in MVP.

## UI Contract

MVP dogfood UI should support:

- pause selected item/project
- choose a small reason set
- unpause
- show paused count in the default view
- show paused queue on demand
- warn when a paused item changed since it was paused

The UI should avoid making pause feel like completion. Use copy such as:

```text
Paused for decision
Paused: external setup needed
Review paused item
```

Avoid:

```text
Done
Ignored
Closed
```

## Open Risks

| Risk | Mitigation |
|---|---|
| Important high-priority work disappears. | Always show paused count and stale/review triggers. |
| Pause becomes a vague dumping ground. | Require a reason; require note for `other`. |
| Repo-level pause hides an unrelated urgent PR/check event. | Track accepted fingerprint/source-change evidence and show "paused repo changed" review item. |
| Item IDs change and pause attaches to the wrong work. | Close Q-020 with reviewed identity/fingerprint fixtures before item-scoped pause implementation. |
| User confuses pause with external waiting or done. | Copy and queue naming must say paused/review, not complete. |
| Future hosted service has multiple users. | Treat pause as user-specific state, not project truth. |

## Relationship To Defer/Pin/Snooze

Operator pause is the dogfood version worth implementing first because it maps to an observed workflow. Generic defer, snooze, and pin remain future local-state features unless dogfood shows a separate need.
