---
id: devdeck-source-contract-versioning
type: spec
title: Source Contract Versioning
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

# Source Contract Versioning

## Purpose

DevDeck reads living repos. The boilerplate repo, dogfood repos, GitHub CLI output, and `.dev-cycle` files will keep changing. DevDeck must treat those shapes as versioned source contracts, not as permanent filesystem facts.

The goal is resilience:

- detect source-contract drift before brittle parsing
- keep useful sources available when one contract changes
- surface repair guidance instead of crashing or silently trusting stale data
- make parser upgrades fixture-driven

## Contract Layers

| Contract | Owner | Examples | MVP handling |
|---|---|---|---|
| `devdeck_config` | DevDeck | `devdeck.yml` fields and workflow settings | Strict Zod validation with clear first-run errors. |
| `boilerplate_docs` | boilerplate/projects | current state, implementation plan, testing/runtime docs | Probe capabilities, then parse known versions/path variants. |
| `dev_cycle` | dev-cycle/codex-loop workflow | `.dev-cycle/dev-cycle-run-id`, briefs | Probe presence and expected brief shape. Missing is tolerated unless workflow requires it. |
| `git_cli` | local Git | branch/status/log output | Bounded read-only commands with parser fixtures. |
| `github_gh` | GitHub CLI/GitHub API | `gh --json` fields and error output | Versionless fixture contract plus adapter error mapping. |

## Core Type

```ts
type SourceContractId =
  | "devdeck_config"
  | "boilerplate_docs"
  | "dev_cycle"
  | "git_cli"
  | "github_gh";

type ContractCompatibility =
  | "supported"
  | "compatible_legacy"
  | "partial"
  | "unsupported"
  | "unknown";

interface SourceContractProbe {
  source: SourceName;
  contractId: SourceContractId;
  detectedVersion?: string;
  supportedVersions: string[];
  compatibility: ContractCompatibility;
  capabilities: string[];
  missingRequiredCapabilities: string[];
  evidence: ContractEvidenceRef[];
  checkedAt: string;
  errorCode?: string;
  fixHint?: string;
}

interface ContractEvidenceRef {
  label: string;
  path?: string;
  anchor?: string;
  checkedAt: string;
}
```

`detectedVersion` is optional because current boilerplate projects do not expose a formal schema marker. When no marker exists, the probe infers a `legacy` contract from capabilities and records that evidence.

`SourceName` is the source enum from `docs/specs/status-model.md`.

## MVP Required Capabilities

| Source | Required capability | Degrade behavior if missing |
|---|---|---|
| config | project id, path, priority | first-run/config error; no scan for invalid project row |
| filesystem | repo path exists or missing state is known | project-level blocked status |
| boilerplate docs | current-state source or explicit missing marker | lower docs trust; generate repair item if no task can be inferred |
| boilerplate docs | implementation-plan active slice or roadmap table | current task becomes unknown; handoff uses fallback read order |
| boilerplate docs | testing/validation command source or explicit unknown | commands are omitted rather than invented |
| git | branch, dirty state, recent commit | local git trust error; docs/GitHub can still scan |
| dev-cycle | latest brief shape when workflow expects `dev-cycle` | dev-cycle trust error; other sources remain usable |
| GitHub | PR/check/review fields when `gh` is available | GitHub trust error; local scan remains usable |

Capabilities are more important than filenames. The known-path resolver finds likely files; the probe decides whether the needed capability is actually present.

## Probe And Parse Order

1. Resolve the project through `ProjectLocator`.
2. Run source probes with tight timeouts and no mutation.
3. Pick the parser for the detected contract/version/capability set.
4. Parse into source-specific adapter output.
5. Attach `SourceContractProbe` and `SourceTrust`.
6. Build `ProjectStatus` only from normalized outputs.

An unsupported source contract must not throw through scan orchestration. It becomes source trust data with an error code and, when actionability is reduced, a `source_contract_drift` attention item.

## Compatibility Rules

| Change | Expected DevDeck response |
|---|---|
| Add a new optional doc section | Keep current parser working; ignore unknown section until needed. |
| Move a known doc to a fallback path | Known-path resolver handles it and records selected candidate. |
| Rename/remove a required heading/table | Mark source `unsupported` or `partial`; preserve raw file anchor and lower confidence. |
| Add a formal contract version marker | Prefer version marker over inference; keep legacy inference for older repos. |
| New major contract with incompatible shape | Add a versioned parser and fixtures before treating it as supported. |
| `gh` JSON field changes | Capture fixture, map adapter error, and keep local state visible. |

## Error Codes

| Code | Trigger | User-facing behavior |
|---|---|---|
| `contract.unsupported_version` | Detected explicit contract version is outside supported range. | Show local project with source-contract repair guidance. |
| `contract.required_capability_missing` | Required capability cannot be found in available files/output. | Lower confidence and show which source needs update or parser support. |
| `contract.probe_failed` | Probe could not inspect the source safely. | Keep other sources and cache fallback if available. |
| `contract.ambiguous` | Multiple candidates conflict for the same capability. | Use safest candidate, lower confidence, link evidence. |

## Fixture Policy

Every parser contract change needs fixture coverage:

- current dogfood fixture
- missing/partial capability fixture
- unsupported version fixture when a formal version exists
- cache fallback fixture when live source cannot be trusted

When `../boilerplate` or a dogfood repo changes its docs/workflow shape, capture the changed files as minimized fixtures before changing ranking or UI behavior.

## Upgrade Workflow

1. Detect drift during scan, dogfood eval, or repo update review.
2. Add or update a minimized source fixture.
3. Decide whether the change is an additive capability, fallback-path update, or new contract version.
4. Update the probe/parser support matrix.
5. Verify source trust, attention item generation, and handoff behavior.
6. Update docs/current references if code-level generated docs exist.

This keeps DevDeck aligned with evolving repos without turning the MVP into a broad markdown crawler.

## Future Production Discussion

Dogfood can manage drift through repo docs, fixtures, and manual parser updates. A hosted/live service needs an operational layer instead of relying on project docs as the repair surface.

Future production design should revisit:

- server-side source contract registry with supported versions, required capabilities, optional capabilities, deprecation status, and parser versions
- connector probe results stored per workspace/repo as integration health data
- raw source snapshots separated from normalized `ProjectStatus` so parser upgrades can reprocess historical scans
- background reparse jobs when a parser or contract support matrix changes
- dual-read or shadow-parse rollout for new major parser versions before promotion
- user-facing drift copy moved mostly to integration health/data quality surfaces, with feed items only when actionability is reduced
- workspace-level capability mapping for custom repo layouts, without turning DevDeck into an unrestricted markdown crawler

This is not an MVP requirement. Reopen Q-017 before designing a hosted service, multi-user deployment, or persistent connector backend.
