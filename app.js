// CEO Dashboard — illustrative prototype with real Amaravati Urban FY24-FY26 numbers
// Sources: rptPandL FY25 & FY26, rptBsN FY25, TrialBalance 01-Apr-2026, LoanOverDue 14-May-2026
// No external libraries. All chart drawing is hand-rolled SVG.

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------------- Sparklines ---------------- */
function sparkline(svg, points, { color = "#0f4c81", fill = true } = {}) {
  const w = 100, h = 28, pad = 2;
  const max = Math.max(...points), min = Math.min(...points);
  const span = max - min || 1;
  const xs = (i) => pad + (i * (w - 2 * pad)) / (points.length - 1);
  const ys = (v) => h - pad - ((v - min) / span) * (h - 2 * pad);
  const d = points.map((v, i) => `${i === 0 ? "M" : "L"}${xs(i).toFixed(2)},${ys(v).toFixed(2)}`).join(" ");
  let inner = `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.6"/>`;
  if (fill) {
    const area = d + ` L${xs(points.length - 1).toFixed(2)},${h} L${xs(0).toFixed(2)},${h} Z`;
    inner = `<path d="${area}" fill="${color}" opacity=".12"/>` + inner;
  }
  svg.innerHTML = inner;
}

// 3-point trajectories: FY24 → FY25 → FY26
const sparkData = {
  netprofit: [-27.55, -27.55, 5.43],        // ₹ L; profit/loss for the year
  deposits:  [2.40, 4.87, 8.68],            // ₹ Cr · FY24 is approx (carry-forward)
  advances:  [1.80, 3.30, 7.00],            // ₹ Cr
  cdratio:   [75.0, 67.7, 80.7],            // %
  overdue:   [10.5, 9.5, 8.1],              // % illustrative trend (PDFs only give current snapshot)
  cti:       [220, 209, 94]                 // Cost-to-Income %, illustrative
};

document.addEventListener("DOMContentLoaded", () => {
  $$("[data-sparkline]").forEach(svg => {
    const key = svg.getAttribute("data-sparkline");
    const kpi = svg.closest(".kpi");
    let color = "#0f4c81";
    if (kpi.classList.contains("warning")) color = "#c9881e";
    if (kpi.classList.contains("positive")) color = "#0a7d2e";
    sparkline(svg, sparkData[key], { color });
  });

  drawTrendChart();
  drawOverdueChart();
  wireLevers();
  wireDrillDown();
  wirePeriodLabel();
});

/* ---------------- Two-year deposits vs advances ---------------- */
function drawTrendChart() {
  const svg = $("#trend-chart");
  if (!svg) return;
  const w = 600, h = 220, padL = 50, padR = 14, padT = 14, padB = 32;
  // We have year-end snapshots. Add intra-year interpolation for visual rhythm only.
  const labels = ["FY24", "Mid-FY25", "FY25 close", "Mid-FY26", "FY26 close"];
  const dep = [2.40, 3.60, 4.87, 6.70, 8.68];     // ₹ Cr
  const adv = [1.80, 2.45, 3.30, 5.15, 7.00];
  const all = [...dep, ...adv];
  const min = 0;
  const max = Math.ceil(Math.max(...all));
  const xs = (i) => padL + (i * (w - padL - padR)) / (labels.length - 1);
  const ys = (v) => padT + (1 - (v - min) / (max - min)) * (h - padT - padB);

  const grid = [];
  for (let v = 0; v <= max; v += 2) {
    grid.push(`<line x1="${padL}" x2="${w - padR}" y1="${ys(v)}" y2="${ys(v)}" stroke="#e2e8f0"/>`);
    grid.push(`<text x="${padL - 6}" y="${ys(v) + 3}" font-size="10" fill="#64748b" text-anchor="end">${v}</text>`);
  }
  const path = (arr, color) => {
    const d = arr.map((v, i) => `${i ? "L" : "M"}${xs(i)},${ys(v)}`).join(" ");
    const area = d + ` L${xs(arr.length - 1)},${h - padB} L${xs(0)},${h - padB} Z`;
    return `<path d="${area}" fill="${color}" opacity=".08"/><path d="${d}" fill="none" stroke="${color}" stroke-width="2"/>` +
      arr.map((v, i) => `<circle cx="${xs(i)}" cy="${ys(v)}" r="3" fill="${color}"><title>${labels[i]}: ₹${v} Cr</title></circle>`).join("");
  };
  const xAxis = labels.map((l, i) => `<text x="${xs(i)}" y="${h - 12}" font-size="10" fill="#64748b" text-anchor="middle">${l}</text>`).join("");
  svg.innerHTML = grid.join("") + path(dep, "#0f4c81") + path(adv, "#c9881e") + xAxis;
}

/* ---------------- Overdue % by product (horizontal bars) ---------------- */
function drawOverdueChart() {
  const svg = $("#overdue-chart");
  if (!svg) return;
  const w = 600, h = 220, padL = 130, padR = 60, padT = 14, padB = 14;
  const rows = [
    { name: "DRS (GL 269)",      pct: 83.3, out: 15.17, color: "#b00020" },
    { name: "Personal (GL 93)",  pct: 9.5,  out: 103.51, color: "#c9881e" },
    { name: "CC (GL 127)",       pct: 7.2,  out: 55.63,  color: "#a8c635" },
    { name: "PIGMI (GL 210)",    pct: 5.0,  out: 4.01,   color: "#d96b2a" },
    { name: "LAFD (GL 220)",     pct: 1.7,  out: 10.13,  color: "#0a7d2e" },
    { name: "LAP (GL 107)",      pct: 1.0,  out: 76.29,  color: "#0a7d2e" },
    { name: "Staff (GL 133)",    pct: 1.0,  out: 5.04,   color: "#0a7d2e" },
    { name: "Vehicle (GL 121)",  pct: 0.4,  out: 10.59,  color: "#0a7d2e" },
    { name: "Home (GL 279)",     pct: 0.4,  out: 64.04,  color: "#0a7d2e" }
  ];
  const max = 85;
  const rowH = (h - padT - padB) / rows.length;
  const bars = rows.map((r, i) => {
    const y = padT + i * rowH + 3;
    const bw = ((w - padL - padR) * r.pct) / max;
    return `
      <text x="${padL - 8}" y="${y + rowH/2 + 3}" font-size="10" fill="#0f172a" text-anchor="end">${r.name}</text>
      <rect x="${padL}" y="${y}" width="${bw}" height="${rowH - 6}" fill="${r.color}" opacity=".85"><title>${r.name}: ${r.pct}% of ₹${r.out} L</title></rect>
      <text x="${padL + bw + 6}" y="${y + rowH/2 + 3}" font-size="10" fill="#0f172a">${r.pct}% · ₹${r.out} L</text>
    `;
  }).join("");
  svg.innerHTML = bars;
}

/* ---------------- What-if levers ---------------- */
function wireLevers() {
  const levers = {
    rate: $("#lv-fd-rate"),
    disb: $("#lv-disb"),
    redeploy: $("#lv-redeploy"),
    rec: $("#lv-rec")
  };
  const outs = {
    rate: $("#lv-fd-rate-v"),
    disb: $("#lv-disb-v"),
    redeploy: $("#lv-redeploy-v"),
    rec: $("#lv-rec-v")
  };

  function recalc() {
    const rate = +levers.rate.value;       // bp on new disbursements
    const disbMo = +levers.disb.value;     // ₹ L/month
    const redeploy = +levers.redeploy.value; // ₹ L moved from bank balance to lending
    const recPct = +levers.rec.value;      // % of DRS overdue recovered

    outs.rate.textContent = (rate >= 0 ? "+" : "") + rate;
    outs.disb.textContent = disbMo;
    outs.redeploy.textContent = redeploy;
    outs.rec.textContent = recPct;

    // === Baselines (real FY26 numbers, ₹ in lakhs unless stated) ===
    const baseDepCr = 8.68, baseAdvCr = 7.00;
    const baseCD = 80.7, baseNIM = 5.0, baseCTI = 94;
    const baseNetResult = 5.43;       // ₹ L
    const baseAccLoss = 22.12;        // ₹ L
    const baseLendRate = 12.5;        // % avg lending yield (approx from interest/book)
    const baseFY26DisbMo = 50;        // ₹ L/mo assumed
    const idleBank = 22;              // ₹ L sitting in bank current a/cs

    // === Projections ===
    // Annual disbursement vs baseline
    const annualDisb = disbMo * 12;
    const baselineAnnualDisb = baseFY26DisbMo * 12;
    const newAdvances = baseAdvCr + (annualDisb - baselineAnnualDisb) / 100 * 0.6 + redeploy / 100;
    // Deposits grow at ~60% of FY26 pace (rate of growth slows)
    const newDeposits = baseDepCr * 1.55;
    const newCD = (newAdvances / newDeposits) * 100;

    // NIM impact: lending rate change adds ~0.7x to NIM (50% pass-through over a year)
    const newNIM = baseNIM + (rate / 100) * 0.7;
    // Cost-to-Income: more income at constant cost → CTI falls
    const incomeUplift = (annualDisb - baselineAnnualDisb) * (baseLendRate / 100) +
                         redeploy * ((baseLendRate - 2.86) / 100) +    // redeployment NIM
                         (annualDisb * rate / 10000);                   // rate change on new disb
    const newCTI = baseCTI / (1 + incomeUplift / 100);
    // Net result: baseline + uplifts + DRS recovery
    const drsOverdue = 12.63; // ₹ L
    const drsRecover = (recPct - 20) / 100 * drsOverdue;  // 20% is the assumed-baseline recovery
    const newNetResult = baseNetResult + incomeUplift + drsRecover;
    const newAccLoss = Math.max(0, baseAccLoss - newNetResult);

    // === Render headline forecasts ===
    $("#proj-deposits").textContent = newDeposits.toFixed(1);
    $("#proj-deposits-lo").textContent = (newDeposits * 0.91).toFixed(1);
    $("#proj-deposits-hi").textContent = (newDeposits * 1.09).toFixed(1);
    $("#proj-advances").textContent = newAdvances.toFixed(1);
    $("#proj-advances-lo").textContent = (newAdvances * 0.90).toFixed(1);
    $("#proj-advances-hi").textContent = (newAdvances * 1.10).toFixed(1);
    $("#proj-ni").textContent = newNetResult.toFixed(1);

    // === Impact table ===
    setVal("#imp-cd", newCD.toFixed(1) + "%", (newCD - baseCD).toFixed(1) + " pp", "#imp-cd-d");
    setVal("#imp-nim", newNIM.toFixed(2) + "%", ((newNIM - baseNIM) * 100).toFixed(0) + " bp", "#imp-nim-d");
    setVal("#imp-cti", newCTI.toFixed(0) + "%", (newCTI - baseCTI).toFixed(0) + " pp", "#imp-cti-d", true);
    setVal("#imp-ni", "₹ " + newNetResult.toFixed(1) + " L", ((newNetResult - baseNetResult) >= 0 ? "+" : "") + (newNetResult - baseNetResult).toFixed(1) + " L", "#imp-ni-d");
    setVal("#imp-acc", "₹ " + newAccLoss.toFixed(1) + " L", (newAccLoss - baseAccLoss).toFixed(1) + " L", "#imp-acc-d", true);
  }

  function setVal(valSel, valText, deltaText, deltaSel, invertGood = false) {
    $(valSel).textContent = valText;
    const numericDelta = parseFloat(deltaText);
    const el = $(deltaSel);
    if (Math.abs(numericDelta) < 0.05) { el.textContent = "—"; el.classList.remove("up","down"); return; }
    el.textContent = (numericDelta >= 0 && !deltaText.startsWith("-") && !deltaText.startsWith("+") ? "+" : "") + deltaText;
    el.classList.remove("up", "down");
    const isPositive = numericDelta > 0;
    const isGood = invertGood ? !isPositive : isPositive;
    el.classList.add(isGood ? "up" : "down");
  }

  Object.values(levers).forEach(l => l && l.addEventListener("input", recalc));
  $("#lv-reset").addEventListener("click", () => {
    levers.rate.value = 0; levers.disb.value = 50;
    levers.redeploy.value = 0; levers.rec.value = 20;
    recalc();
  });
  recalc();
}

/* ---------------- Drill-down ---------------- */
function wireDrillDown() {
  $$(".kpi[data-drill]").forEach(el => {
    el.addEventListener("click", () => {
      const what = el.getAttribute("data-drill");
      alert(`Drill-down placeholder · "${what}"\n\nIn the live app this opens the underlying GL transactions, account list, or P&L schedule with filters and Excel export.`);
    });
  });
  $$(".tbl tbody tr").forEach(tr => {
    tr.addEventListener("click", () => alert("Customer 360 placeholder · all accounts · balances · vouchers · KYC · linked loans · action history."));
  });
  $$(".alert-list li").forEach(li => {
    li.addEventListener("click", () => alert("Alert detail placeholder · underlying records + action workflow (assign / resolve / snooze)."));
  });
  const drs = $(".drs-callout");
  if (drs) drs.addEventListener("click", () => alert("DRS workspace placeholder · per-agent collection · daily route · target vs collected · escalation queue."));
}

/* ---------------- Period label ---------------- */
function wirePeriodLabel() {
  const period = $("#f-period"), compare = $("#f-compare"), label = $("#period-label");
  if (!period || !label) return;
  const periodTxt = { ytd: "FY 2025-26 (as of 31-Mar-2026)", fy25: "FY 2024-25", fy24: "FY 2023-24" };
  const compareTxt = { prev: "previous FY", none: "" };
  function update() {
    const p = periodTxt[period.value];
    const c = compareTxt[compare.value];
    label.textContent = c ? `${p} vs ${c}` : p;
  }
  period.addEventListener("change", update);
  compare.addEventListener("change", update);
  update();
}

/* ---------------- v2 enrichment: CRAR headroom (Chart.js) ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.Chart) return;
  const el = document.getElementById('crar-headroom');
  if (!el) return;
  new Chart(el, {
    type: 'line',
    data: {
      labels: ['FY24', 'FY25', 'FY26', 'FY27 (proj)', 'FY28 (proj)', 'FY29 (proj)'],
      datasets: [
        { label: 'CRAR % (current pace)', data: [4.8, 4.2, 3.2, 2.4, 1.6, 0.9],
          borderColor: AU.colors.red, backgroundColor: AU.alpha(AU.colors.red, .12), fill: true, tension: .35, pointRadius: 3 },
        { label: 'CRAR % (if ?38L fresh capital in FY27)', data: [4.8, 4.2, 3.2, 9.4, 9.8, 10.4],
          borderColor: AU.colors.green, backgroundColor: AU.alpha(AU.colors.green, .12), fill: true, tension: .35, pointRadius: 3, borderDash: [4,3] },
        { label: 'RBI floor 9%', data: [9,9,9,9,9,9],
          borderColor: AU.colors.muted, borderWidth: 1.4, borderDash: [2,3], pointRadius: 0, fill: false }
      ]
    },
    options: Object.assign(AU.baseOpts(true), { plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 10 } } } })
  });
});