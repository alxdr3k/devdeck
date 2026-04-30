# 06 Acceptance Tests

Acceptance criteria for DevDeck MVP. Status is `defined` until implementation exists.

## Criteria

| ID | REQ/NFR | Scenario | Verification | Status |
|---|---|---|---|---|
| AC-001 | REQ-001 | Given Node/npm project is installed, when the dev command runs, then the CLI/TUI entrypoint starts without stack traces. | TEST-001 | defined |
| AC-002 | REQ-001, REQ-016 | Given no `devdeck.yml`, when DevDeck starts, then it shows a minimal dogfood config example. | TEST-002 | defined |
| AC-003 | REQ-001, REQ-017 | Given config includes `../xeflabs/xef-scale`, when paths are resolved, then `xef-scale` is treated as existing. | TEST-002 | defined |
| AC-004 | REQ-003, NFR-004 | Given one configured repo path is missing, when scanning, then other repos still produce statuses and the missing repo gets `repo.path_missing`. | TEST-004 | defined |
| AC-005 | REQ-003 | Given a git repo, when scanned, then branch, dirty state, ahead/behind, and recent commit are normalized. | TEST-004 | defined |
| AC-006 | REQ-002, REQ-017 | Given dogfood docs with different testing doc paths, when scanning, then the known-path resolver finds the best available testing doc or records candidates checked. | TEST-006 | defined |
| AC-007 | REQ-004, REQ-018 | Given `gh` is available, when scanning a repo with PRs, then current-branch PR and open PR summaries are distinct. | TEST-007 | defined |
| AC-008 | REQ-005 | Given `.dev-cycle/dev-cycle-briefs.md`, when scanning, then latest cycle result and summary are captured. | TEST-008 | defined |
| AC-009 | REQ-006, NFR-006 | Given mixed source states, when building `ProjectStatus`, then every status includes source trust, freshness, and confidence. | TEST-009 | defined |
| AC-010 | REQ-007 | Given a `ProjectStatus`, when generating items, then each item has source refs, one next action, trust, commands, and handoff seed. | TEST-010 | defined |
| AC-011 | REQ-008, REQ-010, NFR-003 | Given fixed attention fixtures, when ranking, then hard bands rank blockers above resume/hygiene, ties are deterministic, and diagnostic explanation names the decisive factors. | TEST-011 | defined |
| AC-012 | REQ-009, REQ-013 | Given ranked feed output, when rendered, then top 1, top 5 queue, project table, error/empty states, and trust copy are visible in plain language. | TEST-012 | defined |
| AC-013 | REQ-011, REQ-012, NFR-001 | Given selected item has commands, when command/handoff actions are used, then DevDeck displays or copies text but executes no repo command. | TEST-013 | defined |
| AC-014 | REQ-014, REQ-015 | Given cache exists and live source fails, when scanning, then cache is shown as stale fallback and manual rescan can refresh it. | TEST-014 | defined |
| AC-015 | Success metric | Given real dogfood repos, when DevDeck starts, then user can identify top human-attention item within 30 seconds. | TEST-015 / manual dogfood | defined |
| AC-016 | Success metric | Given generated handoff, when pasted into a fresh Claude/Codex session, then work can resume in under 2 minutes. | TEST-015 / manual dogfood | defined |
| AC-017 | NFR-004 | Given `gh` auth fails, when scanning, then local docs/git statuses remain available and GitHub trust shows a fix hint. | TEST-007 | defined |
| AC-018 | NFR-006 | Given any top item, when detail is opened, then source freshness, confidence, missing source, and checked time are visible. | TEST-012 | defined |
| AC-019 | REQ-003, REQ-004, REQ-012, NFR-001 | Given scanner adapters run, when collecting state, then only bounded read-only `git`/`gh` commands are invoked and no generated workflow command can execute. | TEST-003, TEST-013 | defined |
| AC-020 | REQ-011, REQ-012 | Given clipboard copy is unavailable, when handoff or command copy is requested, then DevDeck falls back to showing selectable text. | TEST-013 | defined |
| AC-021 | REQ-019, NFR-004, NFR-008 | Given a repo has an unsupported or partial source contract, when scanning, then DevDeck records contract compatibility, keeps other sources usable, and generates repair guidance only when actionability is reduced. | TEST-016 | defined |
| AC-022 | REQ-020, NFR-009 | Given a high-priority item is operator-paused and a lower-priority item is active, when ranking, then the paused item is excluded from the active feed and shown in the paused queue. | TEST-017 | defined |
| AC-023 | REQ-020, NFR-009 | Given a paused item is due for review or changed since pause, when scanning, then DevDeck surfaces a pause review item or paused-queue warning without marking the original task complete. | TEST-017 | defined |

## Tests

| ID | Name | Planned location | Covers |
|---|---|---|---|
| TEST-001 | Scaffold smoke | `tests/cli/startup.test.ts` | AC-001 |
| TEST-002 | Config loader and first-run output | `tests/config/config-loader.test.ts` | AC-002, AC-003 |
| TEST-003 | Shell command boundary | `tests/shell/read-only-command-boundary.test.ts` | AC-019 |
| TEST-004 | Filesystem and git adapter fixtures | `tests/adapters/git-adapter.test.ts` | AC-004, AC-005 |
| TEST-005 | Scan orchestration resilience | `tests/scan/scan-orchestrator.test.ts` | AC-004, AC-014 |
| TEST-006 | Known-path docs resolver | `tests/adapters/docs-resolver.test.ts` | AC-006 |
| TEST-007 | GitHub adapter fixtures | `tests/adapters/github-adapter.test.ts` | AC-007, AC-017 |
| TEST-008 | Dev-cycle brief parser | `tests/adapters/dev-cycle-adapter.test.ts` | AC-008 |
| TEST-009 | ProjectStatus builder | `tests/domain/project-status.test.ts` | AC-009 |
| TEST-010 | Attention item generator | `tests/domain/attention-items.test.ts` | AC-010 |
| TEST-011 | Ranking policy | `tests/domain/ranking.test.ts` | AC-011 |
| TEST-012 | Display copy and Ink render smoke | `tests/ui/display-copy.test.ts` | AC-012, AC-018 |
| TEST-013 | Command safety and copy fallback | `tests/domain/command-suggestions.test.ts` | AC-013, AC-019, AC-020 |
| TEST-014 | Scan cache | `tests/cache/scan-cache.test.ts` | AC-014 |
| TEST-015 | Dogfood top item quality eval | `tests/evals/dogfood-top-item-quality.test.ts` or manual eval packet | AC-015, AC-016 |
| TEST-016 | Source contract probe and drift fixtures | `tests/contracts/source-contracts.test.ts` | AC-021 |
| TEST-017 | Operator pause state and ranking fixtures | `tests/state/operator-pause.test.ts`, `tests/domain/operator-pause.test.ts` | AC-022, AC-023 |

## CI/CD Gates

| Gate | Environment | Verified by | Required? | Notes |
|---|---|---|---|---|
| PR validation | local/CI once configured | TEST-001..TEST-014, TEST-016, TEST-017 | yes after scaffold | No CI workflow is active yet. |
| MVP dogfood | local realistic environment | TEST-015 + manual dogfood rubric | yes for MVP | Uses real `actwyn`, `concluv`, `../xeflabs/xef-scale`. |
| Command-safety review | local/CI | TEST-003 + TEST-013 + code review | yes | Scanner may run read-only `git`/`gh`; workflow commands must not execute. |

## Definition of Done

- All must REQs have defined AC rows.
- Before MVP acceptance, all must AC rows are passing or explicitly waived.
- Dogfood top-item eval passes the rubric in `docs/evals/dogfood-top-item-quality.md`.
- `docs/current/TESTING.md` lists real commands once they exist.
- Traceability matrix links requirements, decisions, gates, and slices.
