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
- Work can exist before a branch exists.
- Some conversations are not work at all. The user may ask a simple question, make a casual comment, or send a message that should not become a work item.
- The system should reduce context switching across multiple AI agents by merging their interaction state into one queue.

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
- An explicit future connector that can read supported Claude Code/Codex conversation logs with user consent.
- A future mode where agent sessions are launched or proxied through DevDeck so prompts and responses are captured at creation time.

Until such a connector exists, DevDeck must not pretend it read chat history.

## Identity Discussion

The emerging candidate model distinguishes work units from attention items:

| Layer | Question | Candidate anchor |
|---|---|---|
| Work unit | Is this the same body of work? | project id plus leaf/slice id when available |
| Attention item | Why should the user look now? | work unit plus item kind plus current evidence anchor |
| Source fingerprint | Did the evidence change? | normalized repo/chat/source facts |

PR numbers and branches are evidence links for a work unit. They should not be the default center of identity when a leaf/slice exists.

Open case: branchless orphan work. A user-agent exchange may describe a real work unit before any branch, PR, or repo mutation exists. That work needs a temporary local identity and a later merge path into a leaf/slice.

Open case: non-work conversation. Some messages should be archived as context or ignored, not promoted into the queue.

## Open Questions

- What is the minimum conversation connector needed for dogfood?
- Can Codex CLI and Claude Code expose local conversation logs in a stable, supported way?
- Should DevDeck launch/proxy future agent sessions, or only read externally produced logs?
- How should DevDeck classify messages as work, non-work, question-only, blocked work, or completed work?
- How should a branchless orphan conversation later attach to a leaf/slice?
- How much raw chat text should DevDeck store locally, given privacy and future service migration concerns?
- What should the UI show when conversation tracking is unavailable?
