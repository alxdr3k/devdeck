# 03 Risk Spikes

Technical assumptions that need a short experiment before they become implementation commitments.

## Spikes

### SPIKE-001: GitHub `gh` JSON Shape And Timeout Behavior

- Hypothesis: `gh` can provide current branch PR, open PR summaries, checks, reviews, and Codex activity with stable enough JSON for MVP.
- Owner: project
- Time-box: 0.5 day
- Start / End: not started
- Status: open
- Blocks: `GH-1A.1`, `GH-1A.2`, `GH-1A.3`, `GH-1A.4`, `GH-1A.5`

**Experiment**

Run read-only `gh pr view`, `gh pr list`, `gh pr checks`, and selected `gh api` calls against `actwyn`, `concluv`, and `../xeflabs/xef-scale`. Capture JSON fixtures and common failure output.

**Result**

Not run yet.

**Decision / Next Step**

- Follow-up: `GH-1A.1`.
- If `gh` cannot detect enough Codex review state, keep `gh` for PR/check state and scope Codex-specific signals down for MVP.

---

### SPIKE-002: Boilerplate Known-path Resolver Coverage

- Hypothesis: A small known-path resolver can handle current dogfood docs without a broad markdown discovery engine.
- Owner: project
- Time-box: 0.5 day
- Start / End: not started
- Status: open
- Blocks: `SRC-1A.4`, `SRC-1A.5`, `SRC-1A.6`, `SRC-1A.7`

**Experiment**

Check current-state, implementation plan, testing, runtime, data model, operations, and code map path candidates across `actwyn`, `concluv`, and `../xeflabs/xef-scale`.

**Result**

Initial audit confirms path differences: `actwyn` has top-level `docs/TESTING.md`; `concluv` and `xef-scale` have `docs/current/TESTING.md`.

**Decision / Next Step**

- Decision recorded as DEC-007: use known-path resolver with fallbacks.
- Follow-up: `SRC-1A.4`.

---

### SPIKE-003: Dogfood Ranking Calibration

- Hypothesis: hard ranking bands plus simple score inside band produce a better top item than a flat score.
- Owner: project
- Time-box: 1 day after source adapters exist
- Start / End: not started
- Status: open
- Blocks: `RANK-1A.2`, `EVAL-1A.1`

**Experiment**

Run live dogfood scan, manually inspect the three repos, compare flat score vs banded ranking, and record false positives/false negatives.

**Result**

Not run yet.

**Decision / Next Step**

- Current decision: DEC-005 uses hard bands first.
- Follow-up: adjust weights only after `docs/evals/dogfood-top-item-quality.md` produces evidence.

---

### SPIKE-004: Source Contract Drift Coverage

- Hypothesis: A capability-based source contract probe can detect boilerplate/docs and `.dev-cycle` drift without becoming a broad markdown crawler.
- Owner: project
- Time-box: 0.5 day before parser implementation
- Start / End: not started
- Status: open
- Blocks: `SRC-1A.0`, `SRC-1A.4`, `SRC-1A.8`

**Experiment**

Compare current `../boilerplate`, `actwyn`, `concluv`, and `../xeflabs/xef-scale` docs/workflow artifacts, including `.dev-cycle` JSONL and workflow support files that define parser behavior. Capture minimized fixtures for supported, missing capability, partial, and unsupported shapes.

**Result**

Not run yet.

**Decision / Next Step**

- Current decision: DEC-014 uses source contract probes and capability checks.
- Follow-up: implement `SRC-1A.0` before parser slices and keep drift fixtures in `tests/contracts/`.
