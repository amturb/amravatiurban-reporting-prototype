# Amaravati Urban — Reporting Layer Prototype

> **Illustrative HTML/CSS/JS prototype** of the advanced reporting layer being scoped for
> Amaravati Urban Co-Op. Credit Society Ltd. on top of the existing K3One CBS.
>
> All visible numbers are reconstructed from a handful of standard K3 PDF reports
> (P&L, Balance Sheet, Trial Balance, Loan Overdue, Day Book, Members & Directors lists).
> The purpose of this mock is to validate **layout, flow and the metrics that matter** —
> not to validate the values.
>
> Final dashboards will be wired to the live K3 / CBS database once data-layer access
> is granted.

## What this is

A static, dependency-free HTML prototype of five role-based dashboards a small UCB
typically needs from its CBS:

| Tab | File | Audience |
|-----|------|----------|
| CEO / Board | [`index.html`](./index.html) | CEO, Chairman, Board — turnaround story, KPIs, what-if levers |
| Branch Manager | [`branch.html`](./branch.html) | Branch / Operations Manager — Today's daybook, account activity, recovery worklist |
| Loans & Recovery | [`loans.html`](./loans.html) | Recovery officer / Credit committee — GL-wise book, overdue, concentration, DRS deep-dive |
| Financials | [`financials.html`](./financials.html) | Auditor / CA / Board — full P&L, Balance Sheet, 17 ratios with peer benchmarks |
| Compliance & Exceptions | [`compliance.html`](./compliance.html) | Compliance officer / DDR — statutory ratios, K3 exception catalogue |

Two Phase-2 dashboards (**Deposits & Liquidity**, **Reports catalogue**) are
mentioned in the tab strip but not yet built.

## How to run

No build step, no dependencies. Just open `index.html` in any modern browser:

```powershell
# Windows
start prototype\index.html
```

Or serve the folder with any static server:

```powershell
# Python
python -m http.server 8000

# Node
npx serve .
```

## What is real vs illustrative

**Real** (computed / extracted from K3 PDF reports as of 14–16 May 2026):
- All P&L, Balance Sheet and Trial Balance figures
- Loan book GL-wise breakdown (11 schemes)
- Loan overdue ₹ and % per GL
- Daybook 16-May-2026 receipts/payments/cash positions
- Statutory ratios (CRAR, SLR-equivalent, NIM, RoA, RoE, Cost-to-Income, etc.)
- Member roster size, director count, top overdue borrower names
- Top single exposure (Keche Atul J. ₹64.94 L Home Loan)
- DRS deep-dive numbers (₹15.17 L outstanding, 83.3% overdue)

**Illustrative** (placeholder until DB access):
- SMA / ageing-bucket split (PDF only gives action history, not dpd)
- Account-level drill rows (alerts simply pop a placeholder modal)
- 21-tile exception counts (uses K3's standard catalogue, not live counts)
- GST recon, TDS tracker, audit trail
- Top members for action calling (some names illustrative)

## Stack

- Pure HTML, hand-rolled CSS, vanilla JavaScript
- SVG charts hand-drawn — no chart library, no external CDN
- ~3,000 lines total, designed to drop straight into a Phase-1 production
  re-implementation with the chart layer swapped for ApexCharts / ECharts / Chart.js

## Folder layout

```
prototype/
├── index.html          # CEO dashboard
├── app.js              # CEO charts & what-if levers
├── branch.html         # Branch Manager
├── branch.js
├── loans.html          # Loans & Recovery
├── loans.js
├── financials.html     # P&L, BS, ratios
├── financials.js
├── compliance.html     # Statutory + exceptions
├── compliance.js
└── styles.css          # shared design system
```

## Context for the implementation partner

This prototype is being shared to communicate **what** the society needs from its
reporting layer, not **how** it should be built. The expectation is that the
implementation partner will:

1. Wire each tile / table / chart to a documented K3 / CBS data source.
2. Replace SVG hand-drawn charts with their preferred chart library.
3. Add the standard auth / roles / audit-trail layer.
4. Add account-level drill workflows where the prototype currently shows a placeholder.

For the underlying data-access ask, see the separate
*Peocit Data Access Request* document shared by the society.

---

© Amaravati Urban Co-Op. Credit Society Ltd. · prepared by CEO office · 16 May 2026
