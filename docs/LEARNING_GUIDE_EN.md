# Illustrated Learning Guide — RVRDS

![Learning pathway](../assets/learning-path.svg)

## 1. Know the vocabulary

A **brief** defines purpose and audience. A **blueprint** maps a system. A **chart** visualizes quantities. A **diagram** explains relationships. A **flowchart** describes decisions. A **wireframe** sketches a layout.

![Visual vocabulary](../assets/visual-vocabulary.svg)

## 2. Pick the right visual

![Decision tree](../assets/visual-decision-tree.svg)

- Trends over time → line chart.
- Comparisons → bar chart.
- Exact records → table.
- Steps and decisions → flow.
- Single indicator → metric card.
- Explanations and relationships → diagram.

## 3. Build a report

![Architecture](../assets/architecture.svg)

1. Collect and verify data.
2. Express it as versioned Report IR; see [example](../examples/sample-report.json).
3. Run `validateReport` and resolve issues.
4. Render `<ReportView report={report} />` in React.
5. Export using `toDocx(report)` or `toPdf(report)`.
6. Compare output content with the original and run visual QA.

## 4. Check before publishing

- [ ] Source and date verified
- [ ] Demo values labeled synthetic
- [ ] Charts labeled and backed by tables
- [ ] Mobile layout tested
- [ ] RTL/font shaping checked
- [ ] Tests and build passed

**Current limitation:** Persian PDF shaping and embedded fonts need verification before production use.
