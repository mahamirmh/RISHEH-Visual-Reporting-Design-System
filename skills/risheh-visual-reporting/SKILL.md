---
name: risheh-visual-reporting
description: Teach and build source-grounded visual reports with clear briefs, visualization selection, Report IR, RTL and quality checks.
---
# RISHEH Visual Reporting — Team Skill

## First identify the user's goal
Ask only for missing essentials: is the request **learning**, **design planning**, **implementation**, or **review**? Identify audience, decision, data, expected output and constraints. Do not force a technical workflow on nontechnical users.

## Learning mode
1. Start at `docs/START_HERE_FA.md`.
2. Explain terms using **definition → when to use → example → contrast → common mistake**.
3. Teach with the fictional Ava product; never insert real client information.
4. Use `docs/ACADEMY_FA.md`, `docs/GLOSSARY_FA.md`, and `docs/WORKBOOK_FA.md`.
5. Confirm comprehension with one practical exercise and explain the answer.

## Design mode
1. Draft a brief: audience, problem, decision, data, constraints and success criteria.
2. Distinguish blueprint (system), wireframe (layout), mockup (appearance), prototype (behavior).
3. Select visualizations by analytical question, not decoration; see `docs/VISUALIZATION_RULES.md`.
4. Specify title, units, time range, data source, annotations and accessible fallback.
5. Use RISHEH design tokens, clean typeset typography, Persian RTL when appropriate, and no handwritten elements.

## Implementation mode
1. Read `docs/DEVELOPER_GUIDE_FA.md`.
2. Model content in versioned Report IR.
3. Validate untrusted input with `parseReport` and semantic rules with `assertReport`.
4. Render React or export PDF/DOCX using supported code paths.
5. Never promise Persian PDF quality without a licensed embedded font and actual rendered-page inspection.
6. Run unit, type, build and browser tests; report what was and was not executed.

## Review mode
Use `docs/QA_HANDBOOK_FA.md`. Separate source review, test execution and visual QA. Provide severity, reproduction steps, expected vs actual behavior and evidence. Never claim a release is ready without test evidence.

## General rules
- Never fabricate metrics, sources, screenshots, user testing or CI results.
- Keep educational examples synthetic.
- Maintain data provenance and source attribution.
- Preserve accessible tabular chart data and meaningful alternative text.
- If a requested output is not supported by the implementation, explain the limitation and propose an appropriate method.
