---
schema: implementation-plan/v1
template_version: 1.1.0
artifact_type: implementation-plan
title: [Plain-language title - match blueprint title]
slug: [kebab-case-slug - match blueprint slug]
date: [YYYY-MM-DD]
status: draft  # draft | review | locked
parent_blueprint: [path or slug of the Planning Blueprint]
parent_idea: [path or slug of the idea-capture doc]
domain: [software | physical | creative | business | hybrid]
created_by_skill: minime-planner
handoff_to: implementation
handoff_status: [drafting | ready-for-implementation | blocked]
---

# Implementation Plan: [Title]

> **Status:** [draft | review | locked]
> **Date:** [YYYY-MM-DD]
> **Parent Planning Blueprint:** [link or path]
> **Parent idea doc:** [link or path]
> **Next step:** Use this as input to an implementation agent or human implementer.

This plan is **implementation-ready**. It carries every decision and constraint forward from the Planning Blueprint, fills in deferred decisions with researched options, and lays out a phased path with phase-level acceptance gates. Action points are at headline + brief granularity; implementation fills in step-level detail.

---

## 0. Execution Handoff <!-- section: execution-handoff -->

| Field | Value |
| --- | --- |
| Implementation readiness | [ready / ready-with-open-questions / blocked] |
| Recommended first phase | [Phase name] |
| Highest-risk dependency | [Dependency or "none"] |
| Highest-risk decision | [Decision or "none"] |
| Primary validation signal | [Most important observable success signal] |

**Implementer must preserve**

- [Locked decision, user term, constraint, or boundary #1]
- [Locked decision, user term, constraint, or boundary #2]

**Implementer should not start until**

- [Prerequisite #1, or "none"]
- [Prerequisite #2]

**Known open questions that can be handled during implementation**

- [Open question #1]
- [Open question #2]

## 1. Overview <!-- section: overview -->

[3-5 sentences orienting the reader. What this plans, what has been resolved since the blueprint, what research informed it, and how the phases are organized for this domain.]

## 2. Decisions Resolved <!-- section: decisions-resolved -->

Decisions that were deferred in the blueprint and have now been settled.

| ID | Decision | Chosen option | Why | Trade-off accepted | Full record |
| --- | --- | --- | --- | --- | --- |
| D1 | [Decision name] | [Option name] | [Reasoning rooted in research + blueprint constraints] | [What is given up] | [Appendix A.1] |

## 3. Research Findings <!-- section: research-findings -->

Findings that informed the decisions above and the phasing below.

| ID | Question answered | TL;DR | Enables / blocks | Confidence | Full notes |
| --- | --- | --- | --- | --- | --- |
| R1 | [Blueprint research question] | [One-sentence answer] | [Decision or phase affected] | [High / medium / low] | [Appendix B.1] |

## 4. Risks & Mitigations <!-- section: risks-mitigations -->

Carried forward from blueprint §8, plus any new risks surfaced by research or decision-making.

| Risk | Likelihood | Impact | Mitigation in this plan | Residual risk | Source |
| --- | --- | --- | --- | --- | --- |
| [Risk description] | [L/M/H] | [L/M/H] | [Where this plan addresses it, or "accepted"] | [What remains] | [Blueprint / research / decision] |

## 5. Phases <!-- section: phases -->

Domain-driven phases. Each carries a goal, action points, and an acceptance gate that must hold before the next phase begins.

### Phase 1 - [Phase name] <!-- section: phase-1 -->

**Goal:** [One sentence on what this phase exists to achieve.]

**Actions:**

- **[Action title]** — [2-3 sentences. What gets built/done, why, and any non-obvious context. Reference relevant blueprint workflows, constraints, or decisions where helpful.]
- **[Action title]** — [...]

**Dependencies entering this phase:** [Prerequisites or "none"]

**Acceptance gate:** [One observable, specific signal that this phase is done. Reference blueprint acceptance signals where possible.]

### Phase 2 - [Phase name] <!-- section: phase-2 -->

**Goal:** [...]

**Actions:**

- **[Action title]** — [...]
- **[Action title]** — [...]

**Dependencies entering this phase:** [...]

**Acceptance gate:** [...]

### Phase 3 - [Phase name] <!-- section: phase-3 -->

**Goal:** [...]

**Actions:**

- **[Action title]** — [...]
- **[Action title]** — [...]

**Dependencies entering this phase:** [...]

**Acceptance gate:** [...]

*(Repeat per phase. Typical count: 3-5 phases.)*

## 6. Action Inventory <!-- section: action-inventory -->

Every action point across all phases, in a single sortable list. Implementation agents and humans use this as the working backlog.

| ID | Action title | Phase | Type | Depends on | Supports acceptance signal | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1.1 | [Action title] | 1 | [Build / research / decision / integration / validation / docs] | [-] | [Signal / gate] | [Optional context] |
| 1.2 | [...] | 1 | [...] | [1.1] | [...] | [...] |
| 2.1 | [...] | 2 | [...] | [1.2, 1.3] | [...] | [...] |

## 7. Dependencies & Sequencing <!-- section: dependencies-sequencing -->

Cross-phase dependencies and external blockers, refined from blueprint §9 with any new dependencies discovered during planning.

| Item | Type | Status | Blocks | Needed by | Owner / resolver | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| [Name] | [Person / system / asset / decision / event] | [Have / need / pending / unknown] | [Actions or phases] | [Date / phase / before action] | [User / implementer / third party] | [Free-form] |

## 8. Validation Strategy <!-- section: validation-strategy -->

How implementation should prove the plan worked. Keep validation at phase and system boundaries, not at microscopic step level.

| Validation target | Method | Expected evidence | Related phase / gate |
| --- | --- | --- | --- |
| [Outcome or capability] | [Manual check / automated test / review / demo / measurement] | [What proves it] | [Phase / acceptance gate] |

## 9. Carried-forward Open Questions <!-- section: carried-forward-open-questions -->

Questions surfaced during planning but explicitly deferred to implementation. These are not blockers for starting unless marked as such.

| ID | Question or unresolved item | When to resolve | Owner | Blocks start? | Notes |
| --- | --- | --- | --- | --- | --- |
| O1 | [Question or unresolved item] | [Before phase / during phase / after launch] | [Implementer / user / third party] | [Yes / no] | [...] |

## 10. Glossary <!-- section: glossary -->

Pass-through from blueprint §14, plus any new terms introduced during planning.

| Term | Meaning in this plan | Must preserve? | Source |
| --- | --- | --- | --- |
| [User's term] | [Meaning in this specific context, not general] | [Yes / no] | [Blueprint / planning] |

## 11. Implementation Notes <!-- section: implementation-notes -->

Non-obvious context for the implementer.

**Recommended approach**

- [Guidance that helps implementation without over-specifying step-level detail]

**Avoid**

- [Known trap, rejected direction, or approach that conflicts with locked decisions]

**Escalate to the user if**

- [Condition where implementation should stop and ask]

---

## Appendix A - Decision Records <!-- section: appendix-decision-records -->

Full pros/cons + reasoning for every decision resolved in §2.

### A.1 [Decision name]

**Source:** [Blueprint §12 / new from research]

**Options considered:**

| Option | Pros | Cons | Best for |
| --- | --- | --- | --- |
| [A] | [Specific] | [Specific] | [Situation A] |
| [B] | [Specific] | [Specific] | [Situation B] |
| [C] | [Specific] | [Specific] | [Situation C] |

**Recommendation given to user:** [Option X], because [reasoning citing findings + blueprint constraints].

**Trade-off:** [What is given up by choosing this option]

**User decision:** [Accepted / overridden - and why]

## Appendix B - Research Notes <!-- section: appendix-research-notes -->

Full research records for every finding in §3.

### B.1 [Research question]

**What I checked:**

- [Source 1 - query, URL, docs page, file path, or command]
- [Source 2 - ...]

**Findings:**

- [Finding 1 - _source:_ ...]
- [Finding 2 - _source:_ ...]

**What this enables / blocks:** [...]

**Confidence:** [High / medium / low] - [why]

## Appendix C - Source Map <!-- section: appendix-source-map -->

Trace plan content back to blueprint, research, or user decisions.

| Plan item | Source | Confidence | Notes |
| --- | --- | --- | --- |
| [Action / decision / risk / dependency] | [Blueprint section / research record / user confirmation] | [High / medium / low] | [...] |

## Appendix D - Verbatim Quotes <!-- section: appendix-quotes -->

User language preserved as said. Pass through from blueprint appendix plus new quotes from planning.

- > "[Quote]"
- [...]
