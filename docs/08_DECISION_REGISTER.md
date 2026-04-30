# 08 Decision Register

Small and medium project decisions. Major architecture decisions live in `docs/decisions/`.

## Decisions

### DEC-001: Use `../xeflabs/xef-scale` for the xef-scale dogfood repo

- Date: 2026-04-30
- Status: accepted
- Deciders: user, Codex
- Resolves: Q-001
- Impacts: REQ-001, REQ-016, dogfood eval

**Decision**

The configured dogfood path for `xef-scale` is `../xeflabs/xef-scale`.

**Consequences**

- Positive: dogfood eval measures real product behavior, not a mistaken missing-path state.
- Follow-ups: update config examples and eval fixtures.

---

### DEC-002: Use TypeScript/Node 22, npm, Ink, and Vitest for MVP

- Date: 2026-04-30
- Status: accepted
- Resolves: stack evaluation
- Impacts: HLD, REQ-001, NFR-007

**Decision**

Build the MVP as a TypeScript/Node 22 app with npm, Ink TUI, and Vitest.

**Rationale**

This fits fast CLI/TUI iteration, typed domain models, shell-out adapters, markdown/YAML parsing, and possible future web model sharing.

---

### DEC-003: Use `gh` shell-out for GitHub MVP

- Date: 2026-04-30
- Status: accepted
- Resolves: Q-002, Q-007
- Impacts: REQ-004, REQ-013, REQ-018

**Decision**

Use `gh` JSON output behind an adapter boundary. On auth/API failure, keep local status and surface GitHub trust errors.

---

### DEC-004: Use user-local JSON scan cache

- Date: 2026-04-30
- Status: accepted
- Resolves: Q-003
- Impacts: REQ-014, REQ-015

**Decision**

Use a user-local JSON cache with freshness metadata and `DEVDECK_CACHE_PATH` override. Do not write cache into dogfood repos.

---

### DEC-005: Rank by hard bands before numeric score

- Date: 2026-04-30
- Status: accepted
- Resolves: Q-004
- Impacts: REQ-008, REQ-010, NFR-003

**Decision**

Apply ranking bands first: urgent human blocker, ship ready, resume work, trust repair, hygiene, unknown. Score only within a band.

**Rationale**

This prevents high-priority doc hygiene from outranking lower-priority PR-loop blockers.

---

### DEC-006: MVP commands are display-only

- Date: 2026-04-30
- Status: accepted
- Resolves: Q-008, Q-009
- Impacts: REQ-011, REQ-012, NFR-001

**Decision**

DevDeck may show or copy commands and handoff prompts, but it must not execute project commands in MVP.

---

### DEC-007: Use known-path resolver for boilerplate docs

- Date: 2026-04-30
- Status: accepted
- Resolves: Q-011
- Impacts: REQ-002, REQ-017

**Decision**

Resolve docs by purpose with preferred path candidates. Example: testing uses `docs/current/TESTING.md`, then `docs/TESTING.md`, then `docs/testing.md`.

---

### DEC-008: Repo priority is config-only in MVP

- Date: 2026-04-30
- Status: accepted
- Resolves: Q-006
- Impacts: REQ-001, REQ-008

**Decision**

Do not edit priority in the TUI for MVP. Config is the source of truth.

---

### DEC-009: Isolate local repo paths behind a project locator boundary

- Date: 2026-04-30
- Status: accepted
- Resolves: service-readiness concern
- Impacts: HLD, status model, future service architecture

**Decision**

Local repo paths are the only MVP provider, but source adapters should consume a `LocatedProject` abstraction rather than hard-coding local path assumptions through the domain.

**Rationale**

Dogfood needs local paths now. A future hosted service may need repo snapshots, GitHub App connectors, or agent bridges. The stable contract should be `ProjectStatus` and `AttentionItem`, not local filesystem layout.

**Consequences**

- Positive: MVP stays simple while preserving a migration path.
- Trade-off: one small abstraction exists before multiple providers.
- Follow-ups: `CORE-1A.2` should introduce `ProjectLocator` rather than passing raw paths everywhere.
