---
schema: idea-capture/v1
template_version: 1.1.0
artifact_type: idea-capture
title: [Plain-language title of the idea]
slug: [kebab-case-slug]
date: [YYYY-MM-DD]
status: captured
domain: [software | physical | creative | business | hybrid]
created_by_skill: minime-idea
handoff_to: minime-decomposer
handoff_status: ready-for-decomposition
---

# [Title]

## 0. Handoff Summary <!-- section: handoff-summary -->

This document is the canonical idea capture. It should be used as the input to `minime-decomposer`.

| Field | Value |
| --- | --- |
| Canonical idea | [One-sentence refined idea] |
| Primary domain | [software / physical / creative / business / hybrid] |
| Current status | captured |
| Next skill | minime-decomposer |
| Ready for next step? | [yes / yes-with-open-questions / no] |
| Biggest open issue | [Most important unresolved point, or "none"] |

**Do not relitigate unless the user explicitly asks**

- [Confirmed choice or boundary #1]
- [Confirmed choice or boundary #2]

**Most important things for the decomposer to clarify**

- [Question or gap #1]
- [Question or gap #2]

## 1. Raw Idea <!-- section: raw-idea -->

The idea in the user's own words, captured at the start of the conversation.

> [User's exact phrasing, 1-3 sentences]

## 2. Refined Idea <!-- section: refined-idea -->

The articulation accepted by the user at the close of refinement. This is the canonical version of the idea.

[Refined idea, 2-5 sentences in plain language]

### Delta from Raw to Refined

[One short paragraph describing what shifted between the raw and refined versions, and why.]

## 3. Articulation <!-- section: articulation -->

### 3.1 Goal <!-- section: goal -->

[One sentence stating what this idea aims to achieve.]

### 3.2 Motivation <!-- section: motivation -->

[Why this matters now: the trigger, unmet need, or problem being solved. Preserve the user's stated reason verbatim where possible.]

### 3.3 Scope <!-- section: scope -->

| Boundary | Item | Source / confidence |
| --- | --- | --- |
| In scope | [What falls inside the idea's boundary] | [User-stated / inferred-confirmed] |
| Out of scope | [What explicitly does not fall inside] | [User-stated / inferred-confirmed] |
| Deferred | [Parked, not killed] | [User-stated / inferred-confirmed] |

### 3.4 Success Criteria <!-- section: success-criteria -->

Concrete, observable signals that the idea has succeeded.

| Signal | How it would be observed | Source |
| --- | --- | --- |
| [Signal #1] | [Observable evidence] | [User-stated / inferred-confirmed] |
| [Signal #2] | [Observable evidence] | [User-stated / inferred-confirmed] |

## 4. Context <!-- section: context -->

### 4.1 Stakeholders & Audience <!-- section: stakeholders -->

| Role | Who | How they are affected | Confidence |
| --- | --- | --- | --- |
| Primary | [Who the idea is for] | [Direct effect] | [Confirmed / open] |
| Secondary | [Who else is impacted] | [Indirect effect] | [Confirmed / open] |
| Decider | [Whose approval is needed] | [Decision authority] | [Confirmed / open] |

### 4.2 Setting <!-- section: setting -->

Where and when the idea applies: the operational context, environment, or situation.

[Plain-language description]

### 4.3 Prior Attempts & Standing Assumptions <!-- section: prior-attempts -->

| Type | Item | Reason / notes | Source |
| --- | --- | --- | --- |
| Tried | [What has been attempted previously] | [Outcome] | [User-stated] |
| Ruled out | [What has been considered and rejected] | [Reason] | [User-stated] |
| Assumed | [What the user is taking as given] | [Why it matters] | [User-stated / inferred-confirmed] |

## 5. Constraints <!-- section: constraints -->

Only include constraints that affect the shape of the idea or the next decomposition step.

| Type | Constraint | Hard / soft | Source | Notes |
| --- | --- | --- | --- | --- |
| Time | [Deadline, duration, pacing] | [Hard / soft / open] | [User-stated] | [...] |
| Resources | [Budget, people, materials available] | [Hard / soft / open] | [User-stated] | [...] |
| Technical | [Required stack, platform, hardware, IP] | [Hard / soft / open] | [User-stated] | [...] |
| Organizational | [Approvals, dependencies, political limits] | [Hard / soft / open] | [User-stated] | [...] |
| Legal / Ethical | [Compliance, safety, public exposure] | [Hard / soft / open] | [User-stated] | [...] |
| Other | [Anything else load-bearing] | [Hard / soft / open] | [User-stated] | [...] |

## 6. Domain Signals <!-- section: domain-signals -->

Fill the primary domain section first. Leave non-applicable sections as `> [open question] — not applicable or not discussed` rather than inventing content.

### 6.1 Software / Technical <!-- section: signals-software -->

- **Integrates with / depends on:** [Systems, services, libraries]
- **Replaces:** [What this supersedes]
- **Data & state:** [What data is created, owned, transformed]
- **Performance, security, privacy, scale:** [Non-functional requirements]
- **Failure modes & recovery:** [What can break, how it heals]
- **Build vs. buy:** [Which parts are bespoke vs. off-the-shelf]
- **Interfaces / API surface:** [How other systems or users interact with it]

### 6.2 Physical <!-- section: signals-physical -->

- **Materials & fabrication method:** [...]
- **Tools & skill required:** [...]
- **Spatial / environmental constraints:** [Where it lives, wear, weather]
- **Cost ceiling & build time:** [...]
- **Safety considerations:** [...]
- **Reversibility:** [What happens if the first build is wrong]
- **Maintenance & lifespan:** [...]

### 6.3 Creative <!-- section: signals-creative -->

- **Audience & intended encounter:** [Who experiences it, in what setting]
- **Medium, format, length:** [...]
- **References, influences, antecedents:** [...]
- **Traps to avoid:** [Cliches, prior failures, unwanted comparisons]
- **Emotional / aesthetic intent:** [What it should feel like]
- **Definition of done:** [What completion looks like]

### 6.4 Business / Strategic <!-- section: signals-business -->

- **Customer / stakeholder:** [Who pays or benefits]
- **Market / context:** [Where it competes or sits]
- **Hypotheses being tested:** [What this validates or invalidates]
- **Budget, team, time:** [Resource envelope]
- **Validation signals:** [Evidence that would prove the idea works]
- **Kill signals:** [Evidence that would prove the idea should stop]

## 7. Analysis <!-- section: analysis -->

### 7.1 Hidden Assumptions <!-- section: assumptions -->

Things the idea quietly relies on. Each should be checkable.

| Assumption | Why it matters | Checkable by | Status |
| --- | --- | --- | --- |
| [Assumption #1] | [Planning impact] | [How to verify] | [Confirmed / open] |

### 7.2 Ambiguities & Internal Tensions <!-- section: tensions -->

| Tension | Why it matters | Current handling |
| --- | --- | --- |
| [Tension #1] | [Impact if unresolved] | [Resolved / deferred / open] |

### 7.3 Missing Dimensions <!-- section: missing-dimensions -->

Aspects surfaced as relevant but not resolved.

| Missing dimension | Why it matters | Suggested owner |
| --- | --- | --- |
| [Missing dimension #1] | [What it affects] | [decomposer / planner / user] |

### 7.4 Dependencies <!-- section: dependencies -->

External things this idea relies on.

| Dependency | Type | Status | Blocks | Notes |
| --- | --- | --- | --- | --- |
| [Name] | [Person / system / asset / event] | [Have / need / pending / unknown] | [What it gates] | [Free-form] |

### 7.5 Risks <!-- section: risks -->

| Risk | Likelihood | Impact | Mitigation noted by user | Owner of next clarification |
| --- | --- | --- | --- | --- |
| [Risk description] | [L/M/H] | [L/M/H] | [If any] | [decomposer / planner / user] |

## 8. Alternative Directions Considered <!-- section: alternatives -->

Every direction surfaced during analysis is preserved, including rejected and parked directions.

| Direction | Shape | Trade-offs | Status | Reasoning |
| --- | --- | --- | --- | --- |
| A - [Short name] | [One-sentence description] | [Pros / cons] | [Chosen / rejected / parked] | [User's reason where possible] |
| B - [Short name] | [...] | [...] | [...] | [...] |
| C - [Short name] | [...] | [...] | [...] | [...] |

## 9. Chosen Direction <!-- section: chosen-direction -->

The direction the user accepted.

| Field | Value |
| --- | --- |
| Selected | [Direction X - name] |
| Why this one | [Plain-language reason the user gave] |
| What this commits to | [Concrete implications that become load-bearing] |
| What remains flexible | [Choices not yet locked] |

## 10. Deliverables & Expected Artifacts <!-- section: deliverables -->

The concrete outputs that, when produced, would mean this idea has been realized.

| Artifact | Purpose | Done signal |
| --- | --- | --- |
| [Artifact #1] | [Why it exists] | [How to know it is complete] |
| [Artifact #2] | [...] | [...] |

## 11. Glossary <!-- section: glossary -->

The user's specific vocabulary, preserved as they used it.

| Term | Meaning in this idea | Source quote / note |
| --- | --- | --- |
| [User's term] | [Meaning in this specific context, not general] | [Optional quote] |

## 12. Open Questions <!-- section: open-questions -->

Items surfaced but not confirmed. These should be carried into decomposition.

| Question | Source section | Why it matters | Blocks next skill? | Suggested owner |
| --- | --- | --- | --- | --- |
| [What is missing?] | [Section name] | [Planning impact] | [Yes / no] | [decomposer / planner / user] |

## 13. Contradictions <!-- section: contradictions -->

Places where two confirmed or partially confirmed facts conflict.

| Conflict | Claim A | Claim B | Current handling |
| --- | --- | --- | --- |
| [Contradiction] | [Claim A] | [Claim B] | [Resolved / open / deferred] |

## 14. Notes & Verbatim Quotes <!-- section: notes -->

Anything that surfaced during the conversation but did not fit elsewhere. Verbatim user quotes preserve nuance the structured fields strip away.

- > "[User quote]"
- [Note]

## 15. Source & Confidence Log <!-- section: source-confidence-log -->

Use this to distinguish confirmed user intent from inference.

| Item | Source | Confidence | Notes |
| --- | --- | --- | --- |
| [Claim / decision / constraint] | [User-stated / inferred-confirmed / open] | [High / medium / low] | [Why] |
