---
schema: planning-blueprint/v1
title: [Plain-language title — match idea doc title]
slug: [kebab-case-slug — match idea doc slug]
date: [YYYY-MM-DD]
status: draft  # draft | review | locked
parent_idea: [path or slug of the idea-capture doc this was decomposed from]
domain: [software | physical | creative | business | hybrid]
---

# Planning Blueprint: [Title]

> **Status:** [draft | review | locked]
> **Date:** [YYYY-MM-DD]
> **Parent idea doc:** [link or path]

This blueprint is a **planning input**. It records what was extracted, clarified, and locked during decomposition. It does not commit to components, implementation sequence, or test designs — those are for the planning agent.

---

## 1. Problem <!-- verbatim where possible -->

> [User's own phrasing of the problem, preserved verbatim from idea doc §3.2 or refined during decomposition. 1-3 sentences.]

## 2. Outcome & Acceptance Criteria

**Outcome:** [One sentence on what success looks like to an outside observer.]

**Acceptance signals** (verbatim where stated by user):

- [Signal #1 — observable, measurable where possible]
- [Signal #2]
- [...]

## 3. Users & Actors

| Role      | Who (user's term)          | How they are affected   |
| --------- | -------------------------- | ----------------------- |
| Primary   | [Who the idea is for]      | [Direct effect]         |
| Secondary | [Who else is impacted]     | [Indirect effect]       |
| Decider   | [Whose approval is needed] | [Decision authority]    |

## 4. Scope

**In scope**

- [Item — what falls inside the boundary]
- [...]

**Out of scope**

- [Item — explicitly excluded]
- [...]

**Deferred** (parked, not killed — surfaced again only on user request)

- [Item — why parked]
- [...]

## 5. Existing Context & Integrations

- **Replaces / supersedes:** [Prior systems, processes, assets, prior work]
- **Connects to / depends on:** [External systems, services, libraries, materials, audiences, channels — domain-agnostic]
- **Setting:** [Where and when this lives operationally — verbatim where possible]
- **Prior attempts & ruled-out approaches:** [What was tried; what was rejected and why]

## 6. Constraints & Non-Functionals

Only constraints that are **load-bearing** for planning. Skip rows that do not apply to this idea's domain.

| Type                       | Constraint                                                                                       | Source        |
| -------------------------- | ------------------------------------------------------------------------------------------------ | ------------- |
| Time                       | [Deadline, duration, pacing]                                                                     | [User-stated] |
| Resources                  | [Budget, people, materials available]                                                            | [User-stated] |
| Technical / Material       | [Required stack, hardware, materials, IP, format]                                                | [User-stated] |
| Organizational             | [Approvals, dependencies, political limits]                                                      | [User-stated] |
| Legal / Ethical / Safety   | [Compliance, safety, public exposure]                                                            | [User-stated] |
| Quality / Non-functional   | [Performance, durability, accessibility, audience experience, scale — only if load-bearing]      | [User-stated] |
| Other                      | [Anything else load-bearing]                                                                     | [User-stated] |

## 7. Key Workflows & Scenarios

The 2-5 paths that must work for this to count as successful. Each as a numbered sequence the planning agent can plan against.

### Workflow A — [Short name]

1. [Step]
2. [Step]
3. [...]

### Workflow B — [Short name]

1. [Step]
2. [...]

## 8. Risks, Edge Cases & Failure Modes

| Concern                  | Likelihood | Impact | Mitigation noted by user (or "open") |
| ------------------------ | ---------- | ------ | ------------------------------------ |
| [Description]            | [L/M/H]    | [L/M/H]| [Mitigation or "open"]               |

## 9. Dependencies & Ordering Constraints

Things that must be in place, or must happen before other things, for the planning agent to sequence work correctly. **The decomposer records the constraint; the planning agent picks the sequence.**

| Item     | Type                              | Status              | Blocks (what it gates) | Notes       |
| -------- | --------------------------------- | ------------------- | ---------------------- | ----------- |
| [Name]   | [Person / system / asset / decision / event] | [Have / need / pending] | [What it gates]    | [Free-form] |

## 10. Research Questions for Planning

Questions the planning agent must investigate before committing to a plan. Each phrased as a **question**, not a statement.

- **[Question]** — what an answer would unblock.
- [...]

## 11. Decisions Locked

Choices the planning agent **must not relitigate**. Includes both decisions carried forward from the idea doc and new decisions reached during decomposition.

- [Decision] — _source:_ [idea doc §X | decomposition Phase 2 | decomposition Phase 3]
- [...]

## 12. Decisions Deferred

Choices the planning agent should **bring options on**, not pick unilaterally.

- [Choice point] — _why deferred:_ [reason]. _Shape of options requested:_ [what the user wants to see]
- [...]

## 13. Carried-forward Open Questions

Items surfaced during decomposition but explicitly deferred — not blockers for planning, but must not be lost.

- [Question or unresolved item] (_source:_ [conversation cluster N | idea doc §Y])
- [...]

## 14. Glossary <!-- verbatim -->

The user's specific vocabulary, preserved as they used it. Pass through from idea doc §11 plus any new terms introduced during decomposition.

| Term          | Meaning in this idea                                  |
| ------------- | ----------------------------------------------------- |
| [User's term] | [What it means in this specific context, not general] |
| [...]         | [...]                                                 |

---

## Appendix — Notes & Verbatim Quotes

Anything that surfaced during decomposition but did not fit elsewhere. Verbatim quotes preserve nuance the structured fields strip away.

- > "[User quote]"
- [Note]
- [...]
