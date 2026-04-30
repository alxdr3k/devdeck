# 07 Questions Register

## Questions

### Q-001: What is the correct `xef-scale` dogfood path?

- Opened: 2026-04-30
- Owner: user
- Status: resolved
- Proposed Answer: Use `../xeflabs/xef-scale`.
- Blocks: REQ-001 / `CORE-1A.2` / `EVAL-1A.1`
- Resolution: DEC-001

**Context**

The handoff path was corrected after inspecting the local workspace.

---

### Q-002: Should GitHub use `gh` shell-out or a GitHub API client first?

- Opened: 2026-04-30
- Owner: project
- Status: resolved
- Proposed Answer: Use `gh` shell-out first, with an adapter boundary and JSON fixtures.
- Blocks: REQ-004 / `GH-1A.1` / `GH-1A.2`
- Resolution: DEC-003

---

### Q-003: Where should scan cache live?

- Opened: 2026-04-30
- Owner: project
- Status: resolved
- Proposed Answer: Use user-local JSON cache with `DEVDECK_CACHE_PATH` override.
- Blocks: REQ-014 / `CORE-1A.3`
- Resolution: DEC-004

---

### Q-004: Are ranking weights editable in MVP?

- Opened: 2026-04-30
- Owner: project
- Status: resolved
- Proposed Answer: No UI editing in MVP. Project priority and `today_focus` are config inputs; internal weights are dogfood defaults.
- Blocks: REQ-008 / `RANK-1A.1`
- Resolution: DEC-005

---

### Q-005: How deep should markdown parsing go?

- Opened: 2026-04-30
- Owner: project
- Status: open
- Proposed Answer: Known paths and headings first; expand only from fixture failures.
- Blocks: REQ-002 / `SRC-1A.5` / `SRC-1A.6` / `SRC-1A.7` / `SRC-1A.8`
- Resolution: —

---

### Q-006: Should priority be editable in the TUI?

- Opened: 2026-04-30
- Owner: project
- Status: resolved
- Proposed Answer: Config-only in MVP.
- Blocks: REQ-001
- Resolution: DEC-008

---

### Q-007: How should `gh` auth failure behave?

- Opened: 2026-04-30
- Owner: project
- Status: resolved
- Proposed Answer: Emit source-level error and keep local docs/git statuses usable.
- Blocks: REQ-013 / NFR-004 / `GH-1A.2`
- Resolution: DEC-003

---

### Q-008: What does `open` do in MVP?

- Opened: 2026-04-30
- Owner: project
- Status: resolved
- Proposed Answer: Show or copy `cd <path>`, PR URL, or `gh pr view --web` command. Do not change parent shell cwd.
- Blocks: REQ-012 / `UI-1A.2`
- Resolution: DEC-006

---

### Q-009: Should DevDeck write back to docs or `.dev-cycle`?

- Opened: 2026-04-30
- Owner: project
- Status: resolved
- Proposed Answer: No write-back in MVP.
- Blocks: NFR-001
- Resolution: DEC-006

---

### Q-010: Should `defer`, `snooze`, or `pin` ship in MVP?

- Opened: 2026-04-30
- Owner: project
- Status: resolved
- Proposed Answer: Generic defer/snooze/pin stay out of the first implementation. Implement the narrower dogfood-proven operator pause instead.
- Blocks: post-MVP generic overrides
- Resolution: DEC-015 for operator pause; generic overrides remain future

---

### Q-011: How should differing boilerplate doc paths be resolved?

- Opened: 2026-04-30
- Owner: project
- Status: resolved
- Proposed Answer: Known-path resolver with fallbacks.
- Blocks: REQ-017 / `SRC-1A.4`
- Resolution: DEC-007

---

### Q-012: What is the final product/repo name?

- Opened: 2026-04-30
- Owner: user
- Status: open
- Proposed Answer: DevDeck is working name.
- Blocks: release packaging only
- Resolution: —

---

### Q-013: What initial dependency set should implementation use?

- Opened: 2026-04-30
- Owner: project
- Status: resolved
- Proposed Answer: Minimal Node 22/npm stack with Ink/React, TypeScript/TSX/Vitest, YAML, and Zod.
- Blocks: `CORE-1A.1`
- Resolution: DEC-010

---

### Q-014: Does read-only scanning violate "do not execute commands"?

- Opened: 2026-04-30
- Owner: project
- Status: resolved
- Proposed Answer: No. Bounded read-only `git`/`gh` scanner commands are allowed; generated workflow/mutation commands are not.
- Blocks: REQ-003, REQ-004, REQ-012
- Resolution: DEC-011

---

### Q-015: What happens if clipboard copy is unavailable?

- Opened: 2026-04-30
- Owner: project
- Status: resolved
- Proposed Answer: Show selectable text and report that copy was unavailable.
- Blocks: REQ-011, REQ-012
- Resolution: DEC-012

---

### Q-016: How should DevDeck handle source contract drift?

- Opened: 2026-04-30
- Owner: project
- Status: resolved
- Proposed Answer: Treat boilerplate docs, `.dev-cycle`, git CLI, and `gh` output as versioned source contracts. Probe required capabilities before parsing, capture drift fixtures, and degrade to source trust plus repair guidance instead of crashing or silently trusting broken parse output.
- Blocks: REQ-019, NFR-008, `SRC-1A.0`
- Resolution: DEC-014

---

### Q-017: How should a hosted DevDeck service operate source contract drift?

- Opened: 2026-04-30
- Owner: project
- Status: future
- Proposed Answer: Defer until service design. Likely direction is a server-side contract registry, connector probe health, raw snapshots, parser-versioned normalized outputs, background reparse, and shadow rollout for major parser changes.
- Blocks: future hosted service / multi-user connector backend
- Resolution: —

**Context**

Dogfood can record drift in docs and fixtures because the tool runs locally for one user. Production should not rely on project docs as the operational repair surface. See `docs/specs/source-contract-versioning.md`.

---

### Q-018: How should DevDeck model the user's red-light pause workflow?

- Opened: 2026-04-30
- Owner: project
- Status: resolved
- Proposed Answer: Add explicit local operator pause state. Paused work leaves the active feed by default, remains in a paused queue with reason/review trigger, and project priority ranks paused work only inside that queue.
- Blocks: REQ-020, NFR-009, `MODEL-1C`, `RANK-1B`, `UI-1B`
- Resolution: DEC-015

**Context**

The user currently types `!` in high-judgment repo chat tabs to create a red visual marker and then focuses only on unmarked tabs. DevDeck should not depend on terminal tab state, but it should model the same focus-control behavior.

---

### Q-019: How should DevDeck help recover "what did I ask the agent to do?"

- Opened: 2026-04-30
- Owner: project
- Status: open
- Proposed Answer: Add an optional user intent snapshot attached to a stable item identity. MVP can capture DevDeck-generated handoff text and operator notes; future chat connectors may capture exact sent prompts if explicitly supported. Detail/handoff views should show "You asked" or "Operator intent" when known.
- Blocks: REQ-022, future context recovery UI
- Resolution: —

**Context**

During context switching, the user often sees an agent response and needs to recover the original instruction. Searching prior chat manually is expensive. DevDeck should make the initiating instruction visible when it can do so honestly, while distinguishing captured notes from observed repo state.

---

### Q-020: How should stable item ids and source fingerprints work?

- Opened: 2026-04-30
- Owner: project
- Status: open
- Proposed Answer: Candidate direction is to separate conceptual item identity from source evidence fingerprints, but this is not accepted yet. Review must validate anchors, staleness rules, local-path privacy, pre-PR/chat-only work, and migration behavior.
- Blocks: REQ-021, NFR-010, `MODEL-1A.0`, `MODEL-1B.3`, `MODEL-1C.1`
- Resolution: —
