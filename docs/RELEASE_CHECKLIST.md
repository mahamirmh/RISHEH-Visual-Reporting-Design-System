# Release and QA gates

## Mandatory verification

```bash
npm install
npm run typecheck
npm run test
npm run build
```

## Visual inspection

- [ ] Desktop (1440px), tablet (768px), mobile (375px)
- [ ] Browser rendering of every block kind
- [ ] RTL mixed English/Persian and long numbers
- [ ] Chart data table and keyboard navigation
- [ ] PDF and DOCX with representative Persian and English text
- [ ] Page breaks, tables, and chart fallbacks
- [ ] Security review and dependency audit

## Current known gaps

1. PDF renderer needs tested Persian font embedding, bidi shaping and page-break QA.
2. Document charts are represented as text/table fallback, not chart artwork.
3. Report IR is typed but needs comprehensive JSON Schema/runtime validation for untrusted input.
4. UI requires automated accessibility and browser screenshot tests.
5. CI workflow results must be observed; file presence is not proof of success.

Do not tag a production release while any mandatory gate is unverified.
