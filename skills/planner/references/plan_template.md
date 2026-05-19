---
schema: implementation-plan/v1
title: [Plain-language title — match blueprint title]
slug: [kebab-case-slug — match blueprint slug]
date: [YYYY-MM-DD]
status: draft  # draft | review | locked
parent_blueprint: [path or slug of the Planning Blueprint]
parent_idea: [path or slug of the idea-capture doc]
domain: [software | physical | creative | business | hybrid]
---

# Implementation Plan: [Title]

> **Status:** [draft | review | locked]
> **Date:** [YYYY-MM-DD]
> **Parent Planning Blueprint:** [link or path]
> **Parent idea doc:** [link or path]

This plan is **implementation-ready**. It carries every decision and constraint forward from the Planning Blueprint, fills in deferred decisions with researched options, and lays out a phased path with per-phase acceptance gates. Action points are at headline + brief granularity — the implementation agent or human implementer fills in step-level detail.

---

## 1. Overview

[3-5 sentences orienting the reader. What this plans, what's been resolved since the blueprint, what kind of research informed it, and how the phases are organized for this domain.]

## 2. Decisions Resolved

Decisions that were deferred in the blueprint and have now been settled — in the order they came up during planning.

> ### Decision: [Name]
>
> **Source:** Blueprint §12 (Decisions Deferred) | new from research
>
> **Chosen:** [Option name]
>
> **Why:** [Plain-language reasoning rooted in research findings + blueprint constraints]
>
> **Trade-off accepted:** [What's given up by choosing this option]
>
> **Full record:** Appendix A — Decision Records, §A.[n]

*(Repeat per decision.)*

## 3. Research Findings

Findings that informed the decisions above and the phasing below.

> ### Finding: [Topic — answers Blueprint research question §10.X]
>
> **TL;DR:** [One sentence]
>
> **What this enables / blocks:** [Which decisions or phases this affected]
>
> **Confidence:** High | Medium | Low
>
> **Full notes:** Appendix B — Research Notes, §B.[n]

*(Repeat per finding.)*

## 4. Risks & Mitigations

Carried forward from blueprint §8, plus any new risks surfaced by research or decision-making.

| Risk                  | Likelihood | Impact  | Mitigation in this plan                                    | Source                |
| --------------------- | ---------- | ------- | ---------------------------------------------------------- | --------------------- |
| [Risk description]    | [L/M/H]    | [L/M/H] | [Where in the plan this risk is addressed, or "accepted"]  | [Blueprint / new]     |

## 5. Phases

Domain-driven phases. Each carries a goal, action points, and an acceptance gate that must hold before the next phase begins.

### Phase 1 — [Phase name]

**Goal:** [One sentence on what this phase exists to achieve.]

**Action points:**

- **[Action title]** — [2-3 sentences. What gets built/done, why, and any non-obvious context. Reference relevant blueprint workflows or constraints where helpful.]
- **[Action title]** — [...]
- [...]

**Acceptance gate:** [One observable, specific signal that this phase is done. Reference blueprint §2 success criteria where possible.]

### Phase 2 — [Phase name]

**Goal:** [...]

**Action points:**

- **[Action title]** — [...]
- [...]

**Acceptance gate:** [...]

*(Repeat per phase. Typical count: 3-5 phases.)*

## 6. Action Inventory

Every action point across all phases, in a single sortable list. Implementation agents/humans use this as the working backlog.

| ID    | Action title          | Phase | Depends on   | Notes              |
| ----- | --------------------- | ----- | ------------ | ------------------ |
| 1.1   | [Action title]        | 1     | —            | [Optional context] |
| 1.2   | [...]                 | 1     | 1.1          | [...]              |
| 2.1   | [...]                 | 2     | 1.2, 1.3     | [...]              |
| ...   | ...                   | ...   | ...          | ...                |

## 7. Dependencies & Sequencing

Cross-phase dependencies and external blockers — refined from blueprint §9 with any new dependencies discovered during planning.

| Item     | Type                                          | Status              | Blocks                  | Notes       |
| -------- | --------------------------------------------- | ------------------- | ----------------------- | ----------- |
| [Name]   | [Person / system / asset / decision / event]  | [Have/need/pending] | [Actions or phases]     | [Free-form] |

## 8. Carried-forward Open Questions

Questions surfaced during planning but explicitly deferred to implementation — not blockers for starting, but the implementation agent should be aware.

- [Question or unresolved item] (_source:_ [planning Phase N | blueprint §13])
- [...]

## 9. Glossary <!-- verbatim -->

Pass-through from blueprint §14, plus any new terms introduced during planning.

| Term          | Meaning in this idea                                  |
| ------------- | ----------------------------------------------------- |
| [User's term] | [What it means in this specific context, not general] |
| [...]         | [...]                                                 |

---

## Appendix A — Decision Records

Full pros/cons + reasoning for every decision resolved in §2.

### A.1 [Decision name]

**Source:** Blueprint §12 | new from research

**Options considered:**

| Option | Pros        | Cons        | Best for         |
| ------ | ----------- | ----------- | ---------------- |
| [A]    | [Specific]  | [Specific]  | [Situation A]    |
| [B]    | [Specific]  | [Specific]  | [Situation B]    |
| [C]    | [Specific]  | [Specific]  | [Situation C]    |

**Recommendation given to user:** [Option X], because [reasoning citing findings + blueprint constraints].

**Trade-off:** [What we give up by choosing this option]

**User decision:** [Accepted | Overridden — and why]

*(Repeat per decision.)*

## Appendix B — Research Notes

Full research records for every finding in §3.

### B.1 [Research question]

**What I checked:**

- [Source 1 — query, URL, or file path]
- [Source 2 — ...]

**Findings:**

- [Finding 1 — _source:_ ...]
- [Finding 2 — _source:_ ...]

**What this enables / blocks:** [...]

**Confidence:** High | Medium | Low — [why]

*(Repeat per question.)*

## Appendix C — Verbatim Quotes

User language preserved as said. Pass-through from blueprint appendix + new quotes from planning conversation.

- > "[Quote]"
- [...]
