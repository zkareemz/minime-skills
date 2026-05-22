---
schema: planning-blueprint/v1
template_version: 1.1.0
artifact_type: planning-blueprint
title: [Plain-language title - match idea doc title]
slug: [kebab-case-slug - match idea doc slug]
date: [YYYY-MM-DD]
status: draft  # draft | review | locked
parent_idea: [path or slug of the idea-capture doc this was decomposed from]
domain: [software | physical | creative | business | hybrid]
created_by_skill: minime-decomposer
handoff_to: minime-planner
handoff_status: [drafting | ready-for-planning | blocked]
---

# Planning Blueprint: [Title]

> **Status:** [draft | review | locked]
> **Date:** [YYYY-MM-DD]
> **Parent idea doc:** [link or path]
> **Next step:** Use this as input to `minime-planner`.

This blueprint is a **planning input**. It records what was extracted, clarified, and locked during decomposition. It does not commit to components, implementation sequence, or test designs; those are for the planning agent.

---

## 0. Planning Handoff <!-- section: planning-handoff -->

| Field | Value |
| --- | --- |
| Canonical outcome | [One sentence: what success looks like] |
| Ready for planning? | [yes / yes-with-open-questions / no] |
| Biggest planning risk | [Most important unresolved planning risk, or "none"] |
| Research required before planning? | [yes / no] |
| Decisions still needed | [Count or short list] |

**Planner should preserve**

- [Locked choice, user term, constraint, or boundary #1]
- [Locked choice, user term, constraint, or boundary #2]

**Planner should investigate**

- [Research question or uncertainty #1]
- [Research question or uncertainty #2]

**Planner should bring options on**

- [Deferred decision #1]
- [Deferred decision #2]

## 1. Problem <!-- section: problem -->

Preserve the user's own phrasing wherever possible.

> [User's own phrasing of the problem, preserved verbatim from idea doc §3.2 or refined during decomposition. 1-3 sentences.]

## 2. Outcome & Acceptance Criteria <!-- section: outcome-acceptance -->

**Outcome:** [One sentence on what success looks like to an outside observer.]

**Acceptance signals**

| Signal | Observable evidence | Source | Confidence |
| --- | --- | --- | --- |
| [Signal #1] | [How the planner / implementer can verify it] | [Idea doc / decomposition] | [High / medium / low] |
| [Signal #2] | [...] | [...] | [...] |

## 3. Users & Actors <!-- section: users-actors -->

| Role | Who (user's term) | Job / intent | How they are affected | Confidence |
| --- | --- | --- | --- | --- |
| Primary | [Who the idea is for] | [What they need to do or get] | [Direct effect] | [Confirmed / open] |
| Secondary | [Who else is impacted] | [Their relation to the work] | [Indirect effect] | [Confirmed / open] |
| Decider | [Whose approval is needed] | [Decision authority] | [Approval / veto / budget] | [Confirmed / open] |
| Operator / maintainer | [If applicable] | [Ongoing responsibility] | [Operational effect] | [Confirmed / open] |

## 4. Scope <!-- section: scope -->

| Boundary | Item | Reason | Source |
| --- | --- | --- | --- |
| In scope | [Item] | [Why included] | [Idea doc / decomposition] |
| Out of scope | [Item] | [Why excluded] | [Idea doc / decomposition] |
| Deferred | [Parked, not killed] | [When to revisit] | [Idea doc / decomposition] |

## 5. Existing Context & Integrations <!-- section: existing-context -->

| Category | Details | Planning implication | Source |
| --- | --- | --- | --- |
| Replaces / supersedes | [Prior systems, processes, assets, prior work] | [What must migrate, preserve, or avoid] | [Source] |
| Connects to / depends on | [External systems, services, libraries, materials, audiences, channels] | [Integration or coordination impact] | [Source] |
| Setting | [Where and when this lives operationally] | [Context the plan must respect] | [Source] |
| Prior attempts / ruled-out approaches | [What was tried; what was rejected and why] | [What not to repeat] | [Source] |

## 6. Constraints & Non-Functionals <!-- section: constraints-non-functionals -->

Only constraints that are load-bearing for planning. Skip rows that do not apply.

| Type | Constraint | Hard / soft | Planning implication | Source |
| --- | --- | --- | --- | --- |
| Time | [Deadline, duration, pacing] | [Hard / soft / open] | [How this shapes the plan] | [User-stated] |
| Resources | [Budget, people, materials available] | [Hard / soft / open] | [...] | [User-stated] |
| Technical / Material | [Required stack, hardware, materials, IP, format] | [Hard / soft / open] | [...] | [User-stated] |
| Organizational | [Approvals, dependencies, political limits] | [Hard / soft / open] | [...] | [User-stated] |
| Legal / Ethical / Safety | [Compliance, safety, public exposure] | [Hard / soft / open] | [...] | [User-stated] |
| Quality / Non-functional | [Performance, durability, accessibility, audience experience, scale] | [Hard / soft / open] | [...] | [User-stated] |
| Other | [Anything else load-bearing] | [Hard / soft / open] | [...] | [User-stated] |

## 7. Key Workflows & Scenarios <!-- section: workflows-scenarios -->

The 2-5 paths that must work for this to count as successful. Each should be concrete enough for the planner to plan against.

### Workflow A - [Short name]

| Step | Actor | Action | Expected result | Notes |
| --- | --- | --- | --- | --- |
| 1 | [Actor] | [Step] | [Result] | [...] |
| 2 | [Actor] | [Step] | [Result] | [...] |

### Workflow B - [Short name]

| Step | Actor | Action | Expected result | Notes |
| --- | --- | --- | --- | --- |
| 1 | [Actor] | [Step] | [Result] | [...] |
| 2 | [Actor] | [Step] | [Result] | [...] |

## 8. Risks, Edge Cases & Failure Modes <!-- section: risks-edge-cases -->

| Concern | Type | Likelihood | Impact | Mitigation noted by user | Planner action |
| --- | --- | --- | --- | --- | --- |
| [Description] | [Risk / edge case / failure mode] | [L/M/H] | [L/M/H] | [Mitigation or "open"] | [Research / decide / account for in phase] |

## 9. Dependencies & Ordering Constraints <!-- section: dependencies-ordering -->

The decomposer records the constraint; the planner picks the sequence.

| Item | Type | Status | Blocks / gates | Must happen before | Notes |
| --- | --- | --- | --- | --- | --- |
| [Name] | [Person / system / asset / decision / event] | [Have / need / pending / unknown] | [What it gates] | [Dependency or "unknown"] | [Free-form] |

## 10. Research Questions for Planning <!-- section: research-questions -->

Questions the planner must investigate before committing to a plan. Phrase each as a question.

| ID | Question | Why it matters | What an answer unlocks | Suggested source | Priority |
| --- | --- | --- | --- | --- | --- |
| R1 | [Question] | [Planning impact] | [Decision / phase / risk it informs] | [Web / docs / codebase / user] | [High / medium / low] |

## 11. Decisions Locked <!-- section: decisions-locked -->

Choices the planner must not relitigate unless the user explicitly reopens them.

| ID | Decision | Source | Why locked | Implication for planning |
| --- | --- | --- | --- | --- |
| L1 | [Decision] | [Idea doc §X / decomposition] | [Reason] | [What this constrains] |

## 12. Decisions Deferred <!-- section: decisions-deferred -->

Choices the planner should bring options on, not pick unilaterally.

| ID | Choice point | Why deferred | Options requested / shape | Research needed | Priority |
| --- | --- | --- | --- | --- | --- |
| D1 | [Choice point] | [Reason] | [What the user wants to compare] | [Yes / no - what] | [High / medium / low] |

## 13. Carried-forward Open Questions <!-- section: carried-forward-open-questions -->

Items surfaced during decomposition but explicitly deferred. These are not blockers unless marked as such.

| ID | Question / unresolved item | Source | Blocks planning? | Suggested owner | Notes |
| --- | --- | --- | --- | --- | --- |
| O1 | [Question or unresolved item] | [Idea doc / conversation] | [Yes / no] | [planner / user / implementation] | [...] |

## 14. Glossary <!-- section: glossary -->

The user's specific vocabulary, preserved as they used it. Pass through from idea doc §11 plus any new terms introduced during decomposition.

| Term | Meaning in this idea | Must preserve? | Source |
| --- | --- | --- | --- |
| [User's term] | [Meaning in this specific context, not general] | [Yes / no] | [Idea doc / decomposition] |

## 15. Completeness Check <!-- section: completeness-check -->

| Dimension | Status | Notes |
| --- | --- | --- |
| Problem | [Covered / open / waived] | [...] |
| Outcome & acceptance | [Covered / open / waived] | [...] |
| Users & actors | [Covered / open / waived] | [...] |
| Scope boundaries | [Covered / open / waived] | [...] |
| Existing context | [Covered / open / waived] | [...] |
| Constraints & non-functionals | [Covered / open / waived] | [...] |
| Workflows & scenarios | [Covered / open / waived] | [...] |
| Risks & failure modes | [Covered / open / waived] | [...] |
| Dependencies | [Covered / open / waived] | [...] |
| Research questions | [Covered / open / waived] | [...] |
| Locked / deferred decisions | [Covered / open / waived] | [...] |

---

## Appendix A - Notes & Verbatim Quotes <!-- section: appendix-quotes -->

Anything that surfaced during decomposition but did not fit elsewhere. Verbatim quotes preserve nuance the structured fields strip away.

- > "[User quote]"
- [Note]

## Appendix B - Source Map <!-- section: appendix-source-map -->

Use this to trace important planning inputs back to where they came from.

| Artifact item | Source | Confidence | Notes |
| --- | --- | --- | --- |
| [Decision / constraint / workflow / risk] | [Idea doc section / user answer / inference confirmed by user] | [High / medium / low] | [...] |
