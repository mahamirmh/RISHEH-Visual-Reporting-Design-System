# Visualization rules / قواعد نمایش

| Question | Recommended visual | Fallback |
|---|---|---|
| How does a metric change? | Line | Table |
| How do categories compare? | Bar | Table |
| How are parts distributed? | Pie for <=6 groups | Bar |
| What happened in order? | Timeline | Ordered list |
| What are the process steps? | Flow | Ordered list |
| What is the exact value? | Metric | Text |
| What are all the records? | Table | CSV export |

Never use pie for negative values or unbounded non-part-to-whole data. Label units, time ranges, and source. Avoid truncated axes that exaggerate comparisons. Do not infer absent values. All demo numbers must be marked synthetic.
