# Operations

Status: planned. DevDeck has no deployment pipeline or production service.

## Local Run

No runnable app exists yet.

Planned local flow:

```text
npm install
npm run dev
```

Do not treat these as real commands until `CORE-1A.1` lands and `docs/current/TESTING.md` is updated.

## Environment Variables

| Variable | Purpose | Required? |
|---|---|---|
| `DEVDECK_CONFIG` | Optional path to config file. | no |
| `DEVDECK_CACHE_PATH` | Optional path to user-local JSON scan cache. | no |
| `DEVDECK_STATE_PATH` | Optional path to user-local operator pause state. | no |
| `NO_COLOR` | Standard terminal color opt-out. | no |

## External Tools

| Tool | Purpose | Required? | Failure behavior |
|---|---|---|---|
| Node 22+ | Runtime. | yes | App cannot run. |
| npm | Package scripts. | yes | App cannot install/run. |
| git | Local repo state. | yes for useful scan | Per-project git source error. |
| gh | GitHub PR/check/review state. | no for local-only scan | GitHub trust error with fix hint. |

## Data / Cache

- Config: `devdeck.yml` in the DevDeck working directory, or `DEVDECK_CONFIG`.
- Cache: user-local JSON cache by default, or `DEVDECK_CACHE_PATH`.
- Operator pause: user-local JSON state by default, or `DEVDECK_STATE_PATH`.
- DevDeck must not write cache into dogfood repos.
- DevDeck must not write operator pause state into dogfood repos.

## Deployment

No deployment pipeline currently defined.

| Environment | Purpose | Trigger | Owner | Gate | Rollback / recovery |
|---|---|---|---|---|---|
| local | Dogfood CLI/TUI | manual | user | tests/eval once implemented | fix forward |

## Troubleshooting

| Symptom | First check |
|---|---|
| No projects shown | Check `devdeck.yml` path and YAML shape. |
| `xef-scale` missing | Confirm path is `../xeflabs/xef-scale`. |
| GitHub unavailable | Run `gh auth status`; DevDeck should still show local status. |
| Source format changed | Inspect source contract probe evidence and add/update drift fixture before changing parser behavior. |
| Important repo disappeared from active feed | Check paused queue and operator pause reason/review trigger. |
| Pause or intent note attached to wrong item | Check Q-020 status and accepted identity/fingerprint fixtures before changing ranking. |
| User asks "what did I ask the agent?" | Check whether an intent snapshot exists; otherwise DevDeck should omit that block. |
| Top item feels wrong | Inspect ranking explanation and source trust; compare dogfood eval notes. |
| Command ran unexpectedly | Critical bug; MVP must only display/copy commands. |
