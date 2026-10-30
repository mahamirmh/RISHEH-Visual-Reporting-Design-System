#!/usr/bin/env node
/**
 * Deterministic visual-asset smoke test. Produces screenshots at 3 viewports
 * and a machine-readable report. Screenshots require human visual approval.
 */
import { chromium } from '@playwright/test';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const ids = 'brief blueprint chart graph diagram flowchart wireframe mockup prototype dashboard kpi scorecard timeline sankey heatmap treemap report-ir genui disclosure hierarchy provenance accessibility rtl tokens visual-qa regression'.split(' ');
const viewports = [{ name: 'mobile-360', width: 360, height: 800 }, { name: 'mobile-390', width: 390, height: 844 }, { name: 'desktop-1440', width: 1440, height: 900 }];
const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'test-results/education-visual');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
const results = [];
try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
    for (const id of ids) {
      const file = resolve(root, 'assets/examples', id + '.svg');
      let errors = [];
      try {
        const svgSource = await readFile(file, 'utf8');
        await page.setContent('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0}svg{width:100vw;height:auto;display:block}</style></head><body>' + svgSource + '</body></html>', { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        const info = await page.evaluate(() => {
          const svg = document.querySelector('svg');
          if (!svg) return { missingSvg: true };
          const vb = svg.viewBox.baseVal;
          const bad = [];
          for (const node of svg.querySelectorAll('text')) {
            try {
              const b = node.getBBox();
              // Do not fail for decorative elements that merely touch the edge.
              if (b.width > 0 && b.height > 0 && (b.x < vb.x - 1 || b.y < vb.y - 1 || b.x + b.width > vb.x + vb.width + 1 || b.y + b.height > vb.y + vb.height + 1)) {
                bad.push({ text: (node.textContent || '').trim().slice(0, 90), x: Math.round(b.x), y: Math.round(b.y), width: Math.round(b.width), height: Math.round(b.height) });
              }
            } catch { bad.push({ text: (node.textContent || '').trim(), error: 'getBBox failed' }); }
          }
          return { title: !!svg.querySelector('title'), desc: !!svg.querySelector('desc'), viewBox: [vb.width, vb.height], outside: bad };
        });
        if (info.missingSvg) errors.push('Missing SVG document');
        if (!info.title || !info.desc) errors.push('Missing accessible title/desc');
        if (info.outside?.length) errors.push('Text outside viewBox: ' + JSON.stringify(info.outside));
        // SVG is rendered at the target viewport width, preserving its native aspect ratio.
        await page.evaluate(() => { document.documentElement.style.margin = '0'; if (document.body) document.body.style.margin = '0'; const s = document.querySelector('svg'); if (s) { s.style.width = '100vw'; s.style.height = 'auto'; s.style.display = 'block'; } });
        const shot = resolve(output, viewport.name + '-' + id + '.png');
        await page.screenshot({ path: shot, fullPage: true });
        results.push({ id, viewport: viewport.name, screenshot: 'test-results/education-visual/' + viewport.name + '-' + id + '.png', info, errors });
      } catch (error) {
        errors.push(String(error));
        results.push({ id, viewport: viewport.name, errors });
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
}
const failures = results.filter(x => x.errors.length);
const summary = { tested: results.length, expected: ids.length * viewports.length, failures: failures.length, status: failures.length ? 'FAIL' : 'AUTOMATED_PASS_MANUAL_REVIEW_REQUIRED', results };
await writeFile(resolve(output, 'report.json'), JSON.stringify(summary, null, 2));
console.log('Visual QA:', summary.status, '|', results.length, 'renders,', failures.length, 'structural failures');
for (const failure of failures) console.error(failure.viewport, failure.id, failure.errors.join('; '));
if (failures.length || results.length !== summary.expected) process.exitCode = 1;
