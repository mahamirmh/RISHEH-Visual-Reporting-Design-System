# Version 1 release audit

## Confirmed source-level findings fixed in this PR

- Duplicate source IDs and empty source identifiers/titles were not rejected.
- Metric blocks could omit values; paragraph/callout blocks could be empty.
- Static charts had no guard against unreadable category counts or label lengths.
- Browser screenshot output directory was not created explicitly.

## Outstanding release blockers

- Install dependencies and commit a lockfile for reproducible `npm ci`.
- Run TypeScript checks, unit tests, build and Playwright desktop/mobile tests.
- Visually inspect generated Persian PDF with an authorized Unicode font and verify bidi shaping.
- Inspect DOCX chart images, tables and RTL in a document viewer.
- Review browser screenshots and keyboard accessibility.
- Record dependency audit and CI results.

**Release decision: NO-GO until verified.** Source review does not substitute for successful execution.
