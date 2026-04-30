# Testing

Status: no implementation commands currently defined.

Do not invent commands before package scripts exist. The planned command shape below becomes authoritative only after `CORE-1A.1` lands.

## Testing policy

- Behavior changes need verification evidence.
- Prefer test-first for bug fixes and clear behavior changes when a concise
  failing test can express the target behavior.
- Otherwise add or update tests in the same slice as the implementation.
- Bug fixes should leave regression coverage unless impractical.
- If automated coverage is not practical, record the manual check, eval, or
  reason.

## Install

No command currently defined.

Planned after `CORE-1A.1`: `npm install`.

## Typecheck

No command currently defined.

Planned after `CORE-1A.1`: `npm run typecheck`.

## Lint

No command currently defined.

No lint command is required for the first scaffold unless lint tooling is explicitly added.

## Unit Tests

No command currently defined.

Planned after `CORE-1A.1`: `npm test`.

## Build

No command currently defined.

Planned after `CORE-1A.1`: `npm run build`.

## Integration Tests

No command currently defined.

Planned after source adapters exist: fixture-driven tests under `tests/contracts/`, `tests/adapters/`, `tests/state/`, and `tests/domain/identity`.

## Evals

No command currently defined.

Planned after `EVAL-1A.1`: dogfood top-item quality eval using `docs/evals/dogfood-top-item-quality.md`.

## CI / Required Checks

| Check | Local command | CI workflow / job | Required? | Notes |
|---|---|---|---|---|
| install | No command currently defined. | none | no | Becomes required after scaffold. |
| typecheck | No command currently defined. | none | no | Planned. |
| unit tests | No command currently defined. | none | no | Planned. |
| integration fixtures | No command currently defined. | none | no | Planned; use boilerplate docs/ops layout as fixture baseline. Local Codex history is private reference material only for v1; redact any token/secret from minimized notes. |
| dogfood eval | No command currently defined. | none | no | Manual/product gate first. |

## Before Opening A PR

Until code exists:

- update docs when product/spec/plan changes
- run `git diff --check`

After scaffold:

- run install/typecheck/tests from this file
- update current docs if behavior, data model, runtime, operations, or test commands change
