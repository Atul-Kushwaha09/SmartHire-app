# SmartHire: Business Requirements Document (BRD)

| | |
| --- | --- |
| **Product / Project** | SmartHire |
| **Repository** | github.com/thevyanzu-ship-it/SmartHire-app |
| **Version** | 1.0 (draft) |
| **Date** | 1 October 2026 |
| **Status** | Draft for stakeholder review |
| **Related document** | SmartHire PRD v1.0 |

> **Note on assumptions.** The codebase shows what was built, not the business context behind it. Figures, budgets, owners and dates below are placeholders or assumptions marked **[Assumption]** or **[TBD]**. Please replace them with real values before circulating.

## 1. Executive Summary
Hiring teams receive far more resumes than they can read carefully. First-pass screening is slow, varies between reviewers, and is difficult to justify later. SmartHire is a resume screening application that ranks candidates against a job description using structured extraction and a transparent weighted score. It runs locally, can use a local language model (Ollama) for higher-quality extraction, and degrades gracefully to a rule-based mode when no model is available.

This document describes the business need, objectives, scope, stakeholders, requirements, benefits, risks and constraints for SmartHire, and the business case for continued investment.

## 2. Business Context and Problem

### 2.1 Current situation
- Recruiters review resumes manually or with keyword search in email or spreadsheets.
- Review quality depends on the individual and on fatigue; the same resume can be judged differently.
- There is no consistent, recorded reason why a candidate was ranked high or low.
- Commercial AI screening tools exist, but many are costly, send candidate data to third parties, and operate as opaque "black boxes."

### 2.2 Business problem
The organisation needs a faster, more consistent and more explainable way to produce a first-pass shortlist, without the cost and data-privacy exposure of sending candidate PII to external services.

### 2.3 Opportunity
A lightweight, locally hosted tool that:
- cuts time spent on first-pass screening,
- standardises evaluation criteria across reviewers,
- keeps candidate data under the organisation's control,
- provides a visible scoring breakdown that supports defensible, human-made decisions.

## 3. Business Objectives

| ID | Objective | Measure of success [Targets are proposals] |
| --- | --- | --- |
| BO-1 | Reduce recruiter time spent on first-pass screening | At least 50% reduction in time-to-shortlist versus current process |
| BO-2 | Improve consistency of candidate evaluation | Same criteria applied to 100% of candidates for a role; ranking agreement with human reviewers of at least 80% on top candidates |
| BO-3 | Protect candidate data | Zero candidate data sent to external services in the default configuration |
| BO-4 | Keep cost of ownership low | No per-seat or per-resume licence fees; runs on standard hardware |
| BO-5 | Support defensible hiring decisions | Every ranking is accompanied by a viewable score breakdown |
| BO-6 | Enable faster hiring decisions | Reduce time from application close to interview invitations **[TBD baseline]** |

## 4. Scope

### 4.1 In scope
- Job description intake and requirement extraction
- Bulk resume ingestion (PDF, DOCX, TXT)
- Automated candidate profiling and weighted scoring
- Ranked leaderboard, candidate detail view and side-by-side comparison
- Local data storage

### 4.2 Out of scope (this phase)
- Full applicant tracking (pipeline stages, scheduling, offers)
- Automated rejection or any decision made without human review
- Candidate-facing application portal
- Third-party integrations (job boards, ATS, HRIS)
- Video, assessment or background-check features

### 4.3 Scope boundary statement
SmartHire supports a recruiter's judgement. It does not make or replace hiring decisions.

## 5. Stakeholders

| Stakeholder | Role / Interest | Involvement |
| --- | --- | --- |
| Business sponsor **[TBD]** | Funds and approves the initiative | Approves scope, budget and release |
| Recruiters / Talent acquisition | Primary users | Requirements, acceptance testing, feedback |
| Hiring managers | Consumers of shortlists | Review of outputs, comparison feature feedback |
| HR leadership | Process owner | Policy alignment, success metrics |
| Legal / Compliance | Responsible for employment and data-protection law | Review of automated-screening obligations, retention policy |
| IT / Security | Hosting and data security | Deployment, access control, backup |
| Product / Engineering (project team) | Builds and maintains SmartHire | Delivery |
| Candidates (indirect) | Subjects of screening | Affected by fairness, transparency and data handling |

## 6. Business Requirements

| ID | Priority | Business requirement | Traces to |
| --- | --- | --- | --- |
| BR-01 | Must | The business shall be able to define a role by its job description and have key requirements identified automatically. | BO-2 |
| BR-02 | Must | The business shall be able to process many resumes in common formats in one operation. | BO-1 |
| BR-03 | Must | Every candidate for a role shall be evaluated against the same criteria. | BO-2 |
| BR-04 | Must | The system shall present candidates in ranked order with a visible, understandable score breakdown. | BO-1, BO-5 |
| BR-05 | Must | The system shall allow reviewers to compare shortlisted candidates side by side. | BO-1, BO-6 |
| BR-06 | Must | Candidate data shall remain within the organisation's control by default. | BO-3 |
| BR-07 | Must | The system shall remain usable if the AI model is unavailable. | BO-1, BO-4 |
| BR-08 | Must | The system shall not automatically reject or advance candidates; a human shall make final decisions. | Compliance |
| BR-09 | Should | The business shall be able to remove a role and all related candidate data on demand. | BO-3 |
| BR-10 | Should | Users shall be able to export rankings and comparisons for sharing with hiring managers. | BO-6 |
| BR-11 | Should | The business shall be able to tailor scoring (weights, must-have skills) to each role. | BO-2 |
| BR-12 | Should | The system shall report resumes that could not be processed. | BO-2 |
| BR-13 | Should | Access shall be restricted to authorised staff. | BO-3 |
| BR-14 | Could | The system shall retain a record of who viewed or changed candidate data. | Compliance |
| BR-15 | Could | The system shall integrate with the organisation's ATS and email. | BO-6 |
| BR-16 | Could | The business shall be able to monitor screening outcomes for adverse impact. | Compliance |

## 7. Business Process

### 7.1 Current (as-is)
1. Recruiter receives resumes by email or job board.
2. Recruiter reads each resume and compares it informally to the job posting.
3. Recruiter keeps notes in a spreadsheet or in memory.
4. Shortlist is sent to the hiring manager, with limited documentation of rationale.

### 7.2 Future (to-be) with SmartHire
1. Recruiter creates the role by pasting the job description; the system extracts the required skills.
2. Recruiter uploads the batch of resumes.
3. System extracts structured profiles and scores each candidate.
4. Recruiter reviews the ranked leaderboard, filters, and opens individual breakdowns.
5. Recruiter compares finalists and applies human judgement to build the shortlist.
6. Shortlist (and, in a later phase, an export) goes to the hiring manager with a documented, consistent rationale.
7. Data is deleted when the role closes.

## 8. Benefits

### 8.1 Tangible (to be quantified)
- Recruiter hours saved per role **[TBD baseline: hours per role × roles per month × hourly cost]**
- Avoided licence cost compared with commercial screening tools **[TBD]**
- Reduced time-to-hire

### 8.2 Intangible
- More consistent and explainable evaluations
- Reduced reviewer fatigue
- Stronger data-privacy posture through local processing
- A foundation that can grow into a fuller hiring workflow

## 9. Cost and Resource Considerations [Assumption, no figures provided]

| Item | Notes |
| --- | --- |
| Development | Existing codebase; ongoing effort for roadmap items (see PRD Section 11) |
| Infrastructure | Standard workstation or small server; a GPU is optional but improves local-LLM speed |
| Software | Open-source stack (FastAPI, Next.js, SQLite, Ollama); no licence fees identified |
| Ongoing | Maintenance, security updates, periodic review of scoring fairness |
| Compliance | Legal review; possible bias audit depending on jurisdiction |

> A full cost-benefit calculation requires inputs from the sponsor: hiring volume, current recruiter cost and time per resume.

## 10. Assumptions, Constraints and Dependencies

### 10.1 Assumptions
- The tool is used as decision support, never as the sole decision-maker.
- Users operate on a trusted local machine or internal network.
- Job descriptions and resumes are primarily in English.
- Resumes are text-based documents (not scanned images).

### 10.2 Constraints
- Local-model extraction quality and speed depend on available hardware.
- Current skills dictionary is technology-focused, so non-technical roles are supported less well.
- Scoring uses fixed weights (technical 40%, experience 40%, education 20%) until configurability is delivered.
- Single-user, single-machine storage (SQLite) in the current release.

### 10.3 Dependencies
- Ollama and a downloaded language model (optional; fallback exists)
- Python 3, Node.js, and the open-source libraries listed in the project
- Legal guidance on automated-employment-decision regulations in the operating jurisdictions

## 11. Risks and Mitigations

| ID | Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- | --- |
| R-1 | **Algorithmic bias** or disparate impact on protected groups (education weighting, name parsing, keyword dependence) | Medium | High | Human-in-the-loop policy; bias testing on sample data; avoid using score as sole criterion; allow scoring configuration; monitor outcomes |
| R-2 | **Regulatory non-compliance** (automated employment decision tools; data-protection law) | Medium | High | Legal review before production use; candidate notice; retention and deletion controls; audit trail |
| R-3 | **Data breach / PII exposure** (no authentication, open CORS, committed database file) | Medium | High | Add authentication; restrict CORS; keep database and resumes out of version control; encryption at rest |
| R-4 | **Over-reliance on scores** by recruiters | Medium | Medium | Clear UI messaging that scores are advisory; show breakdown and gaps; training |
| R-5 | **Inaccurate extraction**, especially in fallback mode | High | Medium | Surface extraction mode in UI; flag low-confidence profiles; allow manual correction; improve extractors |
| R-6 | **Missed qualified candidates** (skills outside the dictionary, scanned resumes, silent file skips) | Medium | High | Report unprocessed files; OCR; semantic matching; expand skills taxonomy |
| R-7 | **Performance issues** with large batches on modest hardware | Medium | Medium | Background processing queue; configurable model and timeout |
| R-8 | **Low adoption** if setup is difficult (Bash-only launcher on Windows) | Medium | Medium | Cross-platform launcher; simple installer; documentation |
| R-9 | **Naming and branding inconsistency** after rename | High | Low | Complete rename across code, docs and UI |

## 12. Compliance and Governance Considerations

SmartHire processes personal data and supports employment decisions, which are areas subject to regulation in many jurisdictions. Examples to review with legal counsel include automated-employment-decision-tool rules (e.g. New York City Local Law 144), the EU AI Act's treatment of recruitment systems, and data-protection laws such as GDPR. This document does not constitute legal advice.

Recommended governance practices:
1. Written policy that all hiring decisions are made by people.
2. Notice to candidates that automated tools assist screening, where required.
3. Defined retention period and process to honour deletion requests.
4. Periodic review of scoring outcomes for adverse impact.
5. Role-based access to candidate data.

## 13. Acceptance Criteria (Business Level)

The initiative is accepted when:
1. A recruiter can create a role, upload a batch of resumes, and receive a ranked list with score breakdowns without technical assistance.
2. The system continues to function when the local AI model is switched off.
3. A recruiter can compare up to three candidates and delete a role with all associated data.
4. Pilot users report time savings meeting BO-1 and satisfaction of at least 4 out of 5 **[targets to be confirmed]**.
5. Legal / Compliance has reviewed and approved use for the intended jurisdictions and roles.
6. Access controls are in place before any use beyond a single trusted machine.

## 14. Timeline [Assumption, adjust to capacity]

| Phase | Indicative duration | Outcome |
| --- | --- | --- |
| Stabilise (R1.1) | 2–4 weeks | Reliable single-user build; rename complete; launcher fixed |
| Explain and export (R1.2) | 3–5 weeks | Explainable scores; export; configurable scoring |
| Pilot | 4 weeks | Real-world use with recruiters; metrics baseline |
| Collaborate (R2.0) | 6–10 weeks | Authentication, roles, audit log, status tracking |
| Integrate (R3.0) | Roadmap | ATS and email integration; advanced matching |

## 15. Approvals

| Name | Role | Signature | Date |
| --- | --- | --- | --- |
| **[TBD]** | Business Sponsor | | |
| **[TBD]** | HR Lead | | |
| **[TBD]** | Legal / Compliance | | |
| **[TBD]** | IT / Security | | |
| **[TBD]** | Product / Engineering Lead | | |

## Appendix A: Glossary

- **BRD**: Business Requirements Document. **PRD**: Product Requirements Document.
- **ATS**: Applicant Tracking System. **PII**: Personally Identifiable Information.
- **Fallback mode**: Rule-based extraction used when the local AI model is unavailable.
- **Human-in-the-loop**: A person reviews and makes the final decision.
