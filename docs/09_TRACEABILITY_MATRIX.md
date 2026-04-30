# 09 Traceability Matrix

Question / Decision / Requirement / Gate / Slice links for DevDeck MVP.

## Matrix

| TRACE-ID | Question | Decision / ADR | Requirement | Gate / Test | Milestone | Track | Phase | Slice | Notes |
|---|---|---|---|---|---|---|---|---|---|
| TRACE-001 | Q-001 | DEC-001 | REQ-001, REQ-016 | AC-003 / TEST-002 | P0-M2 | CORE | CORE-1A | CORE-1A.3, CORE-1A.4 | `xef-scale` path is `../xeflabs/xef-scale`. |
| TRACE-002 | Q-002, Q-007 | DEC-003 | REQ-004, REQ-013, REQ-018 | AC-007, AC-017 / TEST-007 | P0-M3 | GH | GH-1A | GH-1A.2..GH-1A.5 | `gh` adapter and auth degradation. |
| TRACE-003 | Q-003 | DEC-004 | REQ-014, REQ-015 | AC-014 / TEST-014 | P0-M2 | CORE | CORE-1A | CORE-1A.6 | User-local JSON cache. |
| TRACE-004 | Q-004 | DEC-005 | REQ-008, REQ-010 | AC-011 / TEST-011 | P0-M4 | RANK | RANK-1A | RANK-1A.1 | Ranking bands before score. |
| TRACE-005 | Q-005, Q-011 | DEC-007 | REQ-002, REQ-017 | AC-006 / TEST-006 | P0-M2 | SRC | SRC-1A | SRC-1A.4..SRC-1A.7 | Known-path resolver and docs parsing. |
| TRACE-006 | Q-008, Q-009, Q-014 | DEC-006, DEC-011 | REQ-011, REQ-012, NFR-001 | AC-013, AC-019 / TEST-003, TEST-013 | P0-M5 | MODEL/UI | MODEL-1B/UI-1A | MODEL-1B.4, UI-1A.6 | Display-only command safety. |
| TRACE-007 | none | ADR-0001 | REQ-006, REQ-007, NFR-006 | AC-009, AC-010 / TEST-009, TEST-010 | P0-M4 | MODEL | MODEL-1A | MODEL-1A.1, MODEL-1A.2 | Workflow contract to status/items. |
| TRACE-008 | none | DEC-002 | NFR-007 | AC-001 / TEST-001 | P0-M2 | CORE | CORE-1A | CORE-1A.1 | TypeScript/Node/Ink scaffold. |
| TRACE-009 | none | DEC-005 | Success metric | AC-015, AC-016 / TEST-015 | P0-M5 | EVAL | EVAL-1A | EVAL-1A.1 | Dogfood top item quality. |
| TRACE-010 | none | ADR-0001 | REQ-003, REQ-005 | AC-005, AC-008 / TEST-004, TEST-008 | P0-M2/P0-M3 | SRC | SRC-1A | SRC-1A.3, SRC-1A.8 | Git and dev-cycle source ingestion. |
| TRACE-011 | none | DEC-006, DEC-012 | REQ-009, REQ-011, REQ-012 | AC-012, AC-013, AC-020 / TEST-012, TEST-013 | P0-M5 | UI | UI-1A | UI-1A.2..UI-1A.7 | Feed, handoff, command display, copy fallback. |
| TRACE-012 | none | DEC-009 | REQ-001, REQ-017 | AC-002, AC-003 / TEST-002 | P0-M2 | CORE | CORE-1A | CORE-1A.2, CORE-1A.4 | Local paths behind `ProjectLocator`. |
| TRACE-013 | Q-013 | DEC-010 | NFR-007 | AC-001 / TEST-001 | P0-M2 | CORE | CORE-1A | CORE-1A.1, CORE-1A.2 | Initial npm/TypeScript/Vitest/Ink scaffold. |
| TRACE-014 | none | DEC-013 | REQ-010 | AC-011 / TEST-011 | P0-M4/P0-M5 | RANK/UI | RANK-1A/UI-1A | RANK-1A.3, UI-1A.4 | Ranking explanation is diagnostic after dogfood. |
| TRACE-015 | Q-016 | DEC-014 | REQ-019, NFR-004, NFR-008 | AC-021 / TEST-016 | P0-M2 | SRC | SRC-1A | SRC-1A.0, SRC-1A.1 | Source contract probes manage boilerplate/project drift. |

## Gaps

- Q-005 parser depth remains open until dogfood fixtures prove enough coverage.
- Q-016 is accepted, but concrete supported contract versions are verified through fixtures during `SRC-1A.0`.
- Q-010 defer/pin/snooze is intentionally post-MVP.
- Q-012 final name remains open and does not block implementation.
