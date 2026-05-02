---
id: devdeck-discovery-0002-control-surface-design-tension
type: discovery
title: Projection Layer vs Future Control Surface
status: active
created_at: 2026-05-02
updated_at: 2026-05-02
scope: discovery
project_id: devdeck
provenance: user_confirmed
sensitivity: private
retention: long_term
ai_include: true
---

# Projection Layer vs Future Control Surface

## Context

DevDeck MVP is intentionally read-mostly. It reads boilerplate docs, local git, GitHub, `.dev-cycle`, and `codex-loop` state, then projects that evidence into a ranked attention feed, handoff prompt, and display-only command suggestions.

The user expects a future pressure: once DevDeck reliably identifies the next action, it will be tempting to execute that action directly from DevDeck.

## Current Position

Keep MVP as a projection layer:

```text
read evidence -> rank attention -> generate handoff/commands
```

Do not cross into control-surface behavior during dogfood MVP:

```text
read evidence -> choose action -> execute/mutate -> observe result -> recover/fail/rollback
```

The second form changes DevDeck's responsibility. It requires approval handling, audit/replay logs, recovery semantics, command safety, interruption behavior, and clearer ownership of side effects.

## Candidate Future Boundary

If execution is added later, DevDeck should not directly own shell mutation semantics. Prefer:

```text
DevDeck UI/control request
  -> my-skill foreground workflow runner
  -> structured event/result JSONL
  -> DevDeck projection refresh
```

This keeps DevDeck as the cockpit while letting `my-skill` or a successor workflow substrate own the execution contract.

## Why This Matters

- DevDeck already has source trust, ranking, handoff, pause, and source contract concerns to validate.
- Command execution expands the risk model from display correctness to mutation safety.
- A future control surface needs structured action/result artifacts, not ad hoc command buttons.
- The same structured artifacts can improve DevDeck's projection quality even before execution is exposed in the UI.

## Open Questions

- What trust level must an `AttentionItem` reach before DevDeck may offer execution?
- Which actions are safe enough to execute first, if any? Candidate lower-risk actions are local rescan, open target, and copy handoff. Higher-risk actions include tests, branch changes, push, merge, and `codex-loop`.
- Does every executable action require a my-skill workflow event contract first?
- How should DevDeck show pending/running/completed/failed action state without becoming a second workflow runner?
- What approval and interrupt model is needed before any side-effecting command ships?

## Links

- Q-023 in `docs/07_QUESTIONS_REGISTER.md`
- PRD command safety boundary: `docs/product/PRD.md`
- Workflow contract ADR: `docs/decisions/ADR-0001-workflow-contract.md`
- Source contract versioning: `docs/specs/source-contract-versioning.md`
- Related second-brain ideation: `/Users/yngn/ws/second-brain-idea-agent-json/Ideation/ai-agent-json-workflow-orchestration.md`
