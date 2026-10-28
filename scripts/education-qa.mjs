#!/usr/bin/env node
// Offline structural QA for RISHEH educational materials. No npm dependencies.
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docs = ['README.md','docs/START_HERE_FA.md','docs/ACADEMY_FA.md','docs/GLOSSARY_FA.md','docs/VISUAL_ATLAS_FA.md','docs/WORKBOOK_FA.md','docs/DEVELOPER_GUIDE_FA.md','docs/QA_HANDBOOK_FA.md'];
const ids = 'brief blueprint chart graph diagram flowchart wireframe mockup prototype dashboard kpi scorecard timeline sankey heatmap treemap report-ir genui disclosure hierarchy provenance accessibility rtl tokens visual-qa regression'.split(' ');
const errors = [], warnings = [];
const read = p => readFileSync(resolve(root,p),'utf8');
for (const doc of docs) {
  const full = resolve(root,doc);
  if (!existsSync(full)) { errors.push('Missing document: '+doc); continue; }
  const content = read(doc);
  for (const m of content.matchAll(/!?\\[[^\\]]*\\]\\(([^)]+)\\)/g)) {
    const target = m[1].split('#')[0].split('?')[0];
    if (!target || /^(https?:|mailto:|data:)/.test(target)) continue;
    if (!existsSync(resolve(dirname(full), decodeURIComponent(target)))) errors.push('Broken link in '+doc+': '+target);
  }
}
for (const id of ids) {
  const p = 'assets/examples/'+id+'.svg';
  if (!existsSync(resolve(root,p))) { errors.push('Missing SVG: '+p); continue; }
  const s = read(p);
  if (!/<svg\\b/.test(s) || !/<\\/svg>\\s*$/.test(s)) errors.push('Invalid SVG wrapper: '+p);
  if (!/viewBox="0 0 900 550"/.test(s)) warnings.push('Nonstandard viewBox: '+p);
  if (!/<title\\b/.test(s) || !/<desc\\b/.test(s)) errors.push('Missing accessible title/description: '+p);
  if (/&(?!amp;|lt;|gt;|quot;|apos;|#\\d+;|#x[0-9a-f]+;)/i.test(s)) errors.push('Potential unescaped ampersand: '+p);
}
const academy = read('docs/ACADEMY_FA.md');
const glossary = read('docs/GLOSSARY_FA.md');
const atlas = read('docs/VISUAL_ATLAS_FA.md');
const lessons = [...academy.matchAll(/^## درس \\d+ — /gm)].length;
const entries = [...glossary.matchAll(/^## [۰-۹]+\\. /gm)].length;
if (lessons !== 10) errors.push('Expected 10 lessons, found '+lessons);
if (entries !== 26) errors.push('Expected 26 glossary entries, found '+entries);
for (const id of ids) {
  if (!glossary.includes('../assets/examples/'+id+'.svg')) errors.push('Glossary missing visual '+id);
  if (!atlas.includes('../assets/examples/'+id+'.svg')) errors.push('Atlas missing visual '+id);
}
console.log('Education QA: '+lessons+' lessons, '+entries+' glossary entries, '+ids.length+' SVG references checked.');
warnings.forEach(x=>console.warn('WARN '+x));
errors.forEach(x=>console.error('FAIL '+x));
if (errors.length) process.exitCode = 1;
else console.log('PASS structural and local-link checks. Manual desktop/mobile rendering is still required.');
