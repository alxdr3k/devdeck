---
id: devdeck-discovery-0001
type: discovery
title: Initial Questions
status: active
created_at: 2026-04-30
updated_at: 2026-04-30
scope: discovery
project_id: devdeck
provenance: user_curated_ai_assisted
sensitivity: private
retention: long_term
ai_include: true
---

# 0001 Initial Questions

These questions are implementation inputs, not reasons to keep ideating in second-brain. Answer or close them in this repo.

| ID | Question | Current answer / recommendation | Status | Owner |
|---|---|---|---|---|
| Q-001 | Is `xef-scale` the correct dogfood repo path? | Resolved: actual path is `../xeflabs/xef-scale`. Missing paths are still modeled as source errors, but this repo is not missing. | resolved | user |
| Q-002 | Should GitHub start as `gh` shell-out or API client? | Start with `gh` for MVP. Keep an adapter boundary so API client can replace it later. | recommended | project |
| Q-003 | Where should local cache live? | Use user-local JSON cache by default, with `DEVDECK_CACHE_PATH` override. Do not write cache into dogfood repos. | accepted | project |
| Q-004 | Are ranking weights user-editable in MVP? | Keep defaults in code/config comments first. Project priority and `today_focus` are config inputs. | recommended | project |
| Q-005 | Should priority be editable in the TUI? | Config-only in MVP. TUI edit adds write-back and validation complexity. | recommended | project |
| Q-006 | What exact source files define boilerplate state? | Start with `docs/context/current-state.md`, `docs/04_IMPLEMENTATION_PLAN.md`, `docs/current/TESTING.md`, and current docs. Expand from fixtures. | recommended | project |
| Q-007 | How deep should markdown parsing go? | Known headings and tables first. Use parser utilities and fixtures, not brittle global regex chains. | recommended | project |
| Q-008 | How should DevDeck handle `gh` auth failure? | Emit source-level error with fix command suggestion, keep local git/doc status usable. | recommended | project |
| Q-009 | What does `open` do in MVP? | Display or copy `cd <path>`, PR URL, or `gh pr view --web` command. Do not change parent shell cwd. | recommended | project |
| Q-010 | Should `done`, `defer`, `snooze`, or `pin` ship in MVP? | Generic defer/pin/snooze remain future. Dogfood has proven a narrower operator pause need, tracked as Q-018 / DEC-015. | resolved | project |
| Q-011 | Should DevDeck write back to docs or `.dev-cycle`? | No write-back in MVP. Handoff/cache only. | accepted | project |
| Q-012 | What is the final product/repo name? | DevDeck is accepted as working name. Final name can change later. | open | user |
| Q-013 | How should differing boilerplate doc paths be resolved? | Use a known-path resolver: prefer `docs/current/*`, fall back to legacy top-level docs such as `docs/TESTING.md`. | accepted | project |
| Q-014 | Should ranking be pure score or banded? | Use hard bands first, then score within a band. PR-loop blockers outrank resume/doc hygiene. | accepted | project |
| Q-016 | How should DevDeck handle boilerplate/project repo schema or workflow drift? | Treat repo shapes as versioned source contracts. Probe required capabilities before parsing, add fixtures for drift, and degrade to trust-repair items instead of crashing or silently trusting broken parse output. | accepted | project |
| Q-018 | How should DevDeck model the user's red-light pause workflow? | Add local operator pause state. Paused work leaves the active feed, remains visible in a paused queue, and priority does not override pause except through explicit pause-review triggers. | accepted | project |
| Q-019 | How should DevDeck help recover "what did I ask the agent to do?" | Attach optional user intent snapshots to stable item identities. MVP captures DevDeck handoffs/operator notes; future chat connectors may capture exact prompts. | open | project |
| Q-020 | How should stable item ids and source fingerprints work? | Use versioned stable identities for conceptual items and separate source fingerprints for evidence changes. Local state attaches to both. | accepted | project |

## Immediate Decisions

- Keep TypeScript/Node + Ink.
- Use Node 22 and npm.
- Use `gh` shell-out first.
- Do not execute commands from DevDeck in MVP.
- Treat missing sources as first-class trust states.
- Use `../xeflabs/xef-scale` as the dogfood path for `xef-scale`.
- Use ranking bands before numeric weights.
- Use source contract probes and fixtures to manage boilerplate/project drift.
- Use operator pause to model dogfood focus control without relying on terminal tab state.
- Use stable identities and source fingerprints before pause/cache/intent state.
