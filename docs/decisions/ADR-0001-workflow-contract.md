---
id: adr-0001-workflow-contract
type: adr
title: DevDeck MVP Workflow Contract
status: accepted
created_at: 2026-04-30
updated_at: 2026-04-30
deciders: [user, codex]
supersedes: []
superseded_by: []
provenance: user_confirmed
sensitivity: private
retention: long_term
ai_include: true
---

# ADR-0001: DevDeck MVP Workflow Contract

## Status

accepted - 2026-04-30

## Context

DevDeck needs to turn several AI coding repos into one priority feed. The product will fail if it becomes a generic board or if it guesses state without evidence. The user's projects are started from `../boilerplate` and use local git, GitHub PR/check/review state, and `dev-cycle` / `codex-loop` workflow artifacts.

## Decision

The developer MVP workflow contract is:

```text
boilerplate + git + GitHub + dev-cycle/codex-loop
```

DevDeck will read these sources into typed project status, derive human-actionable attention items, rank them under a visible policy, and display safe next actions. The MVP is read-mostly. It may show commands, handoff text, repo paths, and PR targets, but it must not execute project commands.

## Contract Layers

| Layer | Contract |
|---|---|
| Source contract | repo path, boilerplate docs, git, GitHub PR/check/review, `.dev-cycle` state |
| Status contract | source state becomes a `ProjectStatus` with freshness, confidence, and missing-source metadata |
| Attention contract | `ProjectStatus` becomes human-actionable `AttentionItem`s |
| Ranking contract | items rank by severity, project priority, today focus, age, trust, freshness, and effort |
| Display contract | raw technical state becomes user-action language |
| Trust contract | every item shows source, freshness, confidence, and last checked |
| Contract evolution | source contracts are probed for version/capability support before parsing |
| Handoff contract | generated Claude/Codex resume prompt includes task, why next, next action, checks, read order, and commands |

## Data Flow

```text
devdeck.yml
    |
    v
configured projects
    |
    v
+----------------+   +----------+   +------------+   +--------------+
| boilerplate    |   | git      |   | gh/GitHub  |   | .dev-cycle   |
| docs adapter   |   | adapter  |   | adapter    |   | adapter      |
+----------------+   +----------+   +------------+   +--------------+
          \              |              |                 /
           \             |              |                /
            v            v              v               v
                    ProjectStatus + source contract probes + source trust
                              |
                              v
                       AttentionItems
                              |
                              v
                    deterministic ranking
                              |
                              v
              Ink feed + detail + handoff + command display
```

## Alternatives Considered

- **A: Workflow-specific developer cockpit** (chosen)
  - pros: fits dogfood workflow, preserves sharp MVP wedge, makes source trust explicit
  - cons: less useful to users without boilerplate/GitHub/dev-cycle
- **B: Generic Kanban/task board**
  - pros: familiar, broad category, easier to explain
  - cons: misses actual repo evidence and reintroduces manual tracking
- **C: Web dashboard first**
  - pros: richer visual layout and future shareability
  - cons: more surface area before validating state model; less aligned with terminal workflow
- **D: Command execution control plane first**
  - pros: could close loops faster
  - cons: higher failure cost, unsafe permissions, larger UX and trust burden

## Consequences

- Positive: MVP can be validated quickly against real repos and real workflow state.
- Positive: ranking and handoff quality are testable from fixtures.
- Trade-off: product is intentionally narrow until the developer workflow works.
- Trade-off: missing GitHub auth or missing repo paths must be modeled visibly.
- Trade-off: source contract probing adds a small adapter layer, but prevents silent parser drift as boilerplate and project repos evolve.
- Follow-up: source models, attention items, ranking policy, display copy, dogfood evals, acceptance tests, and implementation ledger are now backfilled.
- Follow-up: source contract versioning and drift handling are specified in `docs/specs/source-contract-versioning.md`.

## References

- Handoff: `/Users/yngn/ws/second-brain/Ideation/ai-coding-project-cockpit-handoff.md`
- PRD: `docs/product/PRD.md`
- Status model: `docs/specs/status-model.md`
- Attention item model: `docs/specs/attention-item-model.md`
- Ranking policy: `docs/specs/ranking-policy.md`
- Source contract versioning: `docs/specs/source-contract-versioning.md`
- Decision register: `docs/08_DECISION_REGISTER.md`
