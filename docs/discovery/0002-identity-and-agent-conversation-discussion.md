---
id: devdeck-discovery-0002-identity-agent-conversation
type: discovery
title: Identity And Agent Conversation Discussion
status: open
created_at: 2026-04-30
updated_at: 2026-04-30
scope: discovery
project_id: devdeck
provenance: user_curated_ai_assisted
sensitivity: private
retention: long_term
ai_include: true
---

# Identity And Agent Conversation Discussion

Status: discussion record. This file captures user direction and open questions. It is not an accepted design.

## Product Frame

DevDeck is a focus and context-switching reducer for one developer working across multiple AI conversational coding agents.

The core job is to merge interactions across active Claude Code/Codex style sessions into one attention queue so the user can spend energy on the single next priority item instead of scanning many split tabs, repos, branches, PRs, and chat histories.

This means DevDeck is not only a repo-state reader. Repo state is necessary evidence, but the product problem includes user-agent conversation state:

- What did the user ask?
- What did the agent answer?
- Is this conversation still work, blocked work, completed work, or just a question/noise?
- Which project and leaf/slice, if any, does it belong to?
- Does the user need to act now?

## Recorded User Direction

- The `!` terminal tab behavior was an example from the user's current Codex CLI workflow, not the desired product UX.
- DevDeck should have its own UX for focus control, pause, review, and attention routing.
- For real work, the most natural identity anchor is the project leaf/slice, not branch or PR.
- Concern: leaf/slice is highly effective in the user's boilerplate workflow, but it is not a universal product anchor. DevDeck should avoid hardcoding boilerplate-specific identity semantics into the generic product model.
- In a generic PR-centric workflow, PR may often be the visible anchor, but large PRs can be too broad to represent a coherent work unit.
- Work can exist before a branch exists.
- Some conversations are not work at all. The user may ask a simple question, make a casual comment, or send a message that should not become a work item.
- The system should reduce context switching across multiple AI agents by merging their interaction state into one queue.
- Official local dogfood OS targets are macOS and Linux.
- Target agent CLIs for future conversation source work are Claude Code, Codex CLI, Gemini CLI, and opencode.
- Since dogfood runs locally, the candidate approach is to discover where each supported tool stores conversation history on disk and read those local records as explicit conversation sources.
- AI agent transcript integration should move later, closer to dogfood v2, rather than block the repo-state MVP.

## Current Capability Assessment

Current MVP sources do not fully solve AI conversation tracking.

Existing planned sources:

- boilerplate docs
- local git
- GitHub PR/check/review state
- `.dev-cycle` and `codex-loop` state
- DevDeck-generated handoff text
- local operator notes

These sources can infer some work state after it reaches repo docs, git, GitHub, or DevDeck handoff flow. They cannot reliably reconstruct arbitrary prior chat messages from Claude Code/Codex sessions unless DevDeck has an explicit conversation source.

Therefore, exact answers to "what did I ask the agent?" require one of:

- DevDeck-mediated prompt creation, where DevDeck stores the handoff or instruction it generated.
- A local operator note attached by the user.
- An explicit future connector that can read supported Claude Code, Codex CLI, Gemini CLI, and opencode conversation logs with user consent.
- A future mode where agent sessions are launched or proxied through DevDeck so prompts and responses are captured at creation time.

Until such a connector exists, DevDeck must not pretend it read chat history.

The proposed sequencing is: do not make transcript connectors part of the initial repo-state MVP. Add a dogfood v2 spike to verify where each target CLI leaves local transcript/session files on macOS and Linux, what schema they use, whether DevDeck can map those records back to a project/work unit, and whether those paths are supported enough to depend on.

## Identity Discussion

The emerging candidate model distinguishes work units from attention items, but the anchor strategy should be workflow/provider-specific rather than hardcoded:

| Layer | Question | Candidate anchor |
|---|---|---|
| Work unit | Is this the same body of work? | anchor chosen by workflow profile: leaf/slice for dogfood boilerplate, PR for PR-centric workflows, local orphan id when neither exists |
| Attention item | Why should the user look now? | work unit plus item kind plus current evidence anchor |
| Source fingerprint | Did the evidence change? | normalized repo/chat/source facts |

For the dogfood boilerplate workflow, leaf/slice currently appears to be the best work-unit anchor. For a generic workflow, PR may be the best available anchor, but only if the PR scope is coherent enough. DevDeck cannot assume a PR is always the right work unit because users can create very large PRs.

PR numbers and branches are often evidence links for a work unit. They may become primary anchors only under a workflow profile that declares them as such or when stronger work-unit anchors are unavailable.

Open case: branchless orphan work. A user-agent exchange may describe a real work unit before any branch, PR, or repo mutation exists. That work needs a temporary local identity and a later merge path into a leaf/slice.

Open case: non-work conversation. Some messages should be archived as context or ignored, not promoted into the queue.

Open case: anchor confidence. DevDeck may need to show whether a work unit is anchored by a strong workflow id, a PR, a branch, or a local orphan id so the user can understand why local state may be fragile.

## Conversation Classification Discussion

The classification problem exists because a conversational agent stream mixes different kinds of interaction in one medium:

- durable work that should become part of the queue
- quick questions that should not create work
- casual or exploratory messages that should be ignored for ranking
- blocked work where the user is the next actor
- completed claims that require repo/GitHub verification before DevDeck should trust them

The practical rule should be conservative: DevDeck should only create an attention item when the conversation implies a concrete next human action or a durable work unit. Otherwise it should keep, summarize, or ignore the conversation according to source settings without feeding it as priority work.

Candidate signals:

| Signal | Classification pressure |
|---|---|
| Mentions a project plus accepted workflow anchor | Stronger work-unit evidence. |
| Mentions a PR, branch, file change, failing check, or implementation request | Work evidence, but may still need attachment or confirmation. |
| Agent asks for credentials, product decision, external setup, or manual review | Human-actionable blocked work. |
| Agent says complete, ready, pushed, or tests pass | Completion evidence requiring repo/GitHub verification. |
| User asks an explanation-only question | Question-only unless the answer creates a follow-up. |
| User sends a casual comment or meta-chat | Non-work/noise by default. |
| No project/work anchor can be found | Unknown or orphan; do not promote aggressively. |

## Open Questions

- What is the minimum conversation connector needed for dogfood v2?
- Can Claude Code, Codex CLI, Gemini CLI, and opencode expose local conversation logs in a stable, supported way on macOS and Linux?
- Should DevDeck launch/proxy future agent sessions, or only read externally produced logs?
- How should DevDeck classify messages as work, non-work, question-only, blocked work, or completed work?
- How should a branchless orphan conversation later attach to a leaf/slice?
- How much raw chat text should DevDeck store locally, given privacy and future service migration concerns?
- What should the UI show when conversation tracking is unavailable?
