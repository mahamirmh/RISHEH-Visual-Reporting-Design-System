# Phases 4–6 — Implementation and release gates

## Phase 4: Document exports

- PNG charts are rasterized from deterministic SVG using Sharp and embedded in DOCX and PDF.
- Chart values are also preserved in tabular form.
- DOCX paragraphs use bidirectional layout for Persian.
- Persian PDF export explicitly requires `toPdf(report,{fontPath:'/path/to/licensed-font.ttf'})` to avoid silent missing glyphs. Font embedding alone does not prove correct shaping: rendered QA is mandatory.
- Do not commit proprietary font files to this repository.

## Phase 5: Browser QA

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

Playwright exercises the actual Vite/React demo in desktop and mobile Chromium. Capture and inspect screenshots manually before release. Expand with keyboard navigation, contrast and visual baselines once a stable CI runner is available.

## Phase 6: Release verification

```bash
npm ci
npm run check
npm run build
npm run test:e2e
npm audit --omit=dev
```

`npm ci` requires a committed lockfile. Generate one with `npm install` and commit `package-lock.json` before using this release gate.

### Remaining blockers

- The commands above have not yet been run successfully against the GitHub branch.
- Persian PDF shaping, actual rendered pages, and font license verification remain to be inspected.
- Snapshot comparison, accessibility automation, and a release tag remain outstanding.
- The chart SVG generator must be audited for extreme category counts, long labels and large values.

**Do not tag this branch production-ready until every release gate is evidenced.**
