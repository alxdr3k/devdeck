# Testing

Status: no implementation commands currently defined.

Do not invent commands before package scripts exist. The planned command shape below becomes authoritative only after `CORE-1A.1` lands.

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
| integration fixtures | No command currently defined. | none | no | Planned. |
| dogfood eval | No command currently defined. | none | no | Manual/product gate first. |

## Before Opening A PR

Until code exists:

- update docs when product/spec/plan changes
- run `git diff --check`

After scaffold:

- run install/typecheck/tests from this file
- update current docs if behavior, data model, runtime, operations, or test commands change
