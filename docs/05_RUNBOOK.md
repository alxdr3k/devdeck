# 05 Runbook

Operational procedures for DevDeck. This is a local developer tool; no deployment path exists yet.

## How To Run Locally

No runnable app exists yet.

After `CORE-1A.1`, expected flow:

```bash
npm install
npm run dev
```

Before `CORE-1A.1`, use docs only.

## How To Configure Dogfood Repos

Planned `devdeck.yml`:

```yaml
projects:
  - id: actwyn
    path: ../actwyn
    priority: 100
    today_focus: true
  - id: concluv
    path: ../concluv
    priority: 90
  - id: xef-scale
    path: ../xeflabs/xef-scale
    priority: 70
workflow:
  contract: dev-cycle
  identity_profile: boilerplate_v1
adapters:
  github: gh
```

## GitHub State Unavailable

- Detection: item trust says GitHub unavailable, `github.auth_failed`, `github.gh_missing`, or timeout.
- Triage:
  - Check whether `gh` is installed.
  - Run `gh auth status` manually.
  - Confirm the repo remote points at GitHub.
- Expected DevDeck behavior: local docs/git/dev-cycle status remains visible.
- Related: AC-007, AC-017.

## Repo Path Missing

- Detection: project status has `repo.path_missing`.
- Triage:
  - Check `devdeck.yml`.
  - For `xef-scale`, correct path is `../xeflabs/xef-scale`.
- Expected DevDeck behavior: missing project appears as a trust/action item; other projects still scan.
- Related: AC-003, AC-004.

## Source Format Changed

- Detection: item trust says source format changed, `contract.unsupported_version`, or `contract.required_capability_missing`.
- Triage:
  - Inspect source contract probe evidence for the affected repo.
  - Compare the repo files against current `../boilerplate` and existing parser fixtures.
  - Add a minimized drift fixture before changing parser behavior.
- Expected DevDeck behavior: other sources still scan, the affected source is low-confidence/unsupported, and repair guidance appears only when actionability is reduced.
- Related: AC-021, TEST-016, DEC-014.

## Ranking Looks Wrong

- Detection: top item contradicts manual repo review.
- Triage:
  - Open item detail and inspect source trust.
  - Check whether the expected item is operator-paused.
  - Check whether the item is in the expected ranking band.
  - Compare nearby items in top 5.
  - Record a dogfood eval failure.
- Expected fix order:
  1. Fix missing source/parser coverage.
  2. Fix attention item generation.
  3. Fix ranking band.
  4. Tune weights last.
- Related: AC-011, AC-015.

## Important Work Is Not In The Active Feed

- Detection: a repo should matter but does not appear in the active top item/top 5.
- Triage:
  - Open the paused queue.
  - Check pause reason, source fingerprint, review trigger, and age.
  - If the pause is no longer valid, unpause it.
- Expected DevDeck behavior: paused work is not mixed into the active feed, but paused count and paused queue make it visible.
- Related: AC-022, AC-023, DEC-015.

## Command Safety Incident

- Symptom: DevDeck executes a repo command.
- Severity: critical.
- Expected behavior: impossible in MVP; commands are display/copy only.
- Mitigation: stop using the build, add/repair TEST-013, inspect UI action handlers.
- Related: NFR-001, AC-013.

## Deployment And Rollback

No deployment pipeline currently defined.

Rollback procedure not currently defined. DevDeck is local-only until packaging/release work is planned.

## Change Log

| Date | Change | By |
|---|---|---|
| 2026-04-30 | Initial local-tool runbook backfilled. | Codex |
