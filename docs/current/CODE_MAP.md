# Code Map

Status: planned. No implementation files exist yet.

## Entry Points

| Path | Purpose |
|---|---|
| `src/cli.ts` | Planned CLI entrypoint. |
| `src/ui/App.tsx` | Planned Ink root component. |
| `devdeck.yml` | Planned local config file for dogfood repos. |

## Runtime / App

| Path | Purpose |
|---|---|
| `src/config/` | Planned config loader, schema validation, defaults. |
| `src/locator/` | Planned `ProjectLocator` and `LocatedProject` providers. |
| `src/contracts/` | Planned source contract probe registry, capability detection, and support matrix. |
| `src/scan/` | Planned scan orchestration and source timeouts. |
| `src/shell/` | Planned bounded read-only command wrapper for scanner adapters. |
| `src/cache/` | Planned user-local JSON cache. |
| `src/state/` | Planned user-local operator pause state. |
| `src/ui/` | Planned Ink feed, detail, handoff, command display. |

## Domain / Services

| Path | Purpose |
|---|---|
| `src/domain/status.ts` | Planned `ProjectStatus`, source trust, status builder types. |
| `src/domain/attention.ts` | Planned `AttentionItem` and suppression logic. |
| `src/domain/identity.ts` | Planned stable identity and source fingerprint helpers. |
| `src/domain/ranking.ts` | Planned ranking bands, scoring, tie-breakers, explanations. |
| `src/domain/handoff.ts` | Planned handoff prompt generation. |
| `src/domain/operator-pause.ts` | Planned pause overlay and paused queue rules. |

## Adapters

| Path | Purpose |
|---|---|
| `src/adapters/filesystem.ts` | Planned path existence and metadata adapter. |
| `src/adapters/git.ts` | Planned read-only git adapter. |
| `src/adapters/github-gh.ts` | Planned `gh` JSON adapter. |
| `src/adapters/docs.ts` | Planned boilerplate docs known-path resolver and parser. |
| `src/adapters/dev-cycle.ts` | Planned `.dev-cycle` JSONL latest-cycle parser with Markdown fallback/display evidence. |

## Tests

| Path | Purpose |
|---|---|
| `tests/config/` | Planned config and first-run behavior tests. |
| `tests/shell/` | Planned read-only command boundary tests. |
| `tests/scan/` | Planned scan orchestration and resilience tests. |
| `tests/adapters/` | Planned filesystem/git/docs/github/dev-cycle fixtures. |
| `tests/contracts/` | Planned source contract probe and drift fixtures. |
| `tests/state/` | Planned operator pause persistence fixtures. |
| `tests/domain/` | Planned status, attention, ranking, handoff tests. |
| `tests/ui/` | Planned display-copy and Ink smoke tests. |
| `tests/evals/` | Planned dogfood top-item quality eval fixtures. |

## Deferred Dogfood V2

| Path | Purpose |
|---|---|
| `src/adapters/agent-conversation.ts` | Future explicit conversation source adapter after Q-021. Do not scaffold for v1 unless the scope is reopened. |
| `src/domain/intent.ts` | Future user intent snapshot model after Q-019/Q-021. Do not scaffold for v1 unless the scope is reopened. |

## Needs Audit

| Path | Reason |
|---|---|
| `src/adapters/github-gh.ts` | Exact `gh` JSON shape must be captured in SPIKE-001. |
| `src/adapters/docs.ts` | Parser depth remains open in Q-005. |
| `src/contracts/` | Contract probe scope must stay capability-based and not become a broad markdown crawler. |
