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
- Blocks: REQ-004 / `SRC-1A.3`
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
- Blocks: REQ-002 / `SRC-1A.2`
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
- Blocks: REQ-013 / NFR-004 / `SRC-1A.3`
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
- Status: open
- Proposed Answer: No for first implementation. Revisit only if dogfood ranking is noisy.
- Blocks: post-MVP
- Resolution: —

---

### Q-011: How should differing boilerplate doc paths be resolved?

- Opened: 2026-04-30
- Owner: project
- Status: resolved
- Proposed Answer: Known-path resolver with fallbacks.
- Blocks: REQ-017 / `SRC-1A.2`
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
