---
id: devdeck-agent-conversation-source
type: spec
title: Agent Conversation Source
status: draft
created_at: 2026-04-30
updated_at: 2026-04-30
scope: specs
project_id: devdeck
provenance: user_curated_ai_assisted
sensitivity: private
retention: long_term
ai_include: true
---

# Agent Conversation Source

Status: draft problem framing for dogfood v2. This is not accepted for initial MVP implementation.

## Purpose

DevDeck's product goal is to merge multiple AI agent interactions into one priority queue. Repo, git, GitHub, and dev-cycle state are important evidence, but they do not fully capture what happened in the conversational agent sessions.

This source family covers supported ways to capture or read user-agent conversation state.

Supported OS targets for local dogfood are macOS and Linux. Candidate agent CLIs are Claude Code, Codex CLI, Gemini CLI, and opencode.

The dogfood v2 hypothesis is local-first: because DevDeck runs on the user's machine, it can discover each supported tool's local conversation-history path and read those records through a per-tool source adapter, subject to consent, stability, and privacy checks.

## Current Answer

DevDeck cannot currently track arbitrary AI agent conversations with the planned repo-state MVP source set.

MVP can only show prior user intent when DevDeck has its own captured evidence:

- a DevDeck-generated handoff prompt
- an operator note
- `.dev-cycle` or repo docs that explicitly record the task

Exact chat-history recovery requires an explicit source contract. Without that, DevDeck must omit the claim rather than infer or invent it.

Agent CLI transcript discovery is deferred to dogfood v2. That spike should verify, for each supported CLI and OS, where local transcript paths live, whether their schema is stable enough, whether records can be mapped to project/work-unit context, and whether DevDeck can read them without depending on private implementation details that break silently.

## Candidate Source Modes

| Mode | Description | Pros | Risks |
|---|---|---|---|
| DevDeck-generated handoff | DevDeck creates and stores the prompt the user pastes into an agent. | Simple, controllable, MVP-compatible. | Does not capture edits after paste or later conversation. |
| Operator note | User adds a local note to an item or work unit. | Honest and user-controlled. | Manual burden. |
| Local transcript connector | DevDeck reads supported Claude Code, Codex CLI, Gemini CLI, or opencode transcript files. | Can answer "what did I ask?" more directly. | Needs stable log paths/schema, privacy review, and per-tool adapters. Deferred to dogfood v2. |
| Session launcher/proxy | DevDeck starts or wraps agent sessions and captures prompts/responses as they happen. | Most complete future model. | Larger product surface and higher trust/safety bar. |
| Agent-written brief | Agent writes a short structured state file after work. | Avoids raw chat capture. | Requires agent compliance and may miss the actual user instruction. |

## Candidate Conversation Model

```ts
type ConversationSourceKind =
  | "devdeck_handoff"
  | "operator_note"
  | "local_transcript"
  | "session_proxy"
  | "agent_written_brief";

type ConversationClassification =
  | "work"
  | "question_only"
  | "casual"
  | "blocked_work"
  | "completed_work"
  | "unknown";

interface AgentConversationRef {
  id: string;
  sourceKind: ConversationSourceKind;
  agentKind: "claude_code" | "codex_cli" | "gemini_cli" | "opencode" | "unknown";
  projectId?: ProjectId;
  workUnitId?: string;
  confidence: "high" | "medium" | "low";
  capturedAt: string;
  lastObservedAt: string;
}

interface AgentInteractionSummary {
  conversationRef: AgentConversationRef;
  classification: ConversationClassification;
  userIntent?: string;
  agentState?: string;
  nextHumanAction?: string;
  sourceRefs: SourceRef[];
}
```

`ProjectId` and `SourceRef` are defined in `docs/specs/status-model.md` and `docs/specs/attention-item-model.md`.

## Work Classification

Conversation evidence should not automatically become an attention item. The classifier exists to keep DevDeck from turning every chat message into work.

Classification should be conservative:

- Promote only when there is a durable work unit or a concrete next human action.
- Keep explanation-only questions out of the priority feed unless they create follow-up work.
- Treat completion claims as unverified until repo/GitHub/source evidence supports them.
- Treat missing project/work anchors as low-confidence orphan state, not top-priority work.

Candidate classification:

| Conversation type | Queue behavior |
|---|---|
| Real work tied to a leaf/slice | Can produce or update a work unit and attention item. |
| Real work without branch/PR/slice | Create low-confidence orphan work until it is attached or dismissed. |
| Simple question | Keep as conversation context only, no feed item unless the answer requires follow-up. |
| Casual/noise | Ignore for ranking and do not create a work item. |
| Agent says blocked | Produce an attention item only if user action is required. |
| Agent says done | Verify through repo/GitHub evidence before marking ship-ready. |

## Classification Signals

| Signal | Effect |
|---|---|
| Project id plus workflow anchor | Strong work-unit evidence. |
| PR, branch, changed files, failing checks, or implementation request | Work evidence; may still need attachment or confirmation. |
| Agent requests credentials, product judgment, external setup, or manual review | Human-actionable blocked work. |
| Agent claims pushed, ready, tests pass, or complete | Completion evidence that needs repo/GitHub verification. |
| User asks explanation-only question | Question-only unless the answer creates durable follow-up work. |
| User sends casual/meta comment | Non-work by default. |
| No project/work anchor detected | Unknown or orphan; avoid high-priority promotion. |

## Trust And Privacy

- Raw chat logs are sensitive local user state.
- Conversation sources need explicit configuration and source labeling.
- Summaries must identify capture source and confidence.
- A future hosted service must not assume local transcript access. It needs an explicit connector, upload, or session-proxy model.
- DevDeck should store minimal summaries by default and keep raw transcripts optional.

## Open Questions

- Which target agent tools expose stable, supported transcript locations or APIs on macOS and Linux?
- For each target CLI, what exact local paths and record formats should DevDeck read in dogfood v2?
- Is dogfood v1 willing to use DevDeck-generated handoffs/operator notes as the only conversation capture?
- Does branchless orphan work need a visible inbox, or should it appear only when active feed is empty?
- How should the user dismiss a non-work conversation so it does not reappear?
- Should classification be rule-based first, model-assisted later, or always user-confirmed?
