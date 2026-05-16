// Compliance & Exceptions dashboard
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const exceptions = [
  // mapped from K3 §I exception list — see 03-Reporting-Layer-Plan.md
  { name: "Debit balances in Deposits",         today: 4,  prev: 4,  sev: "high",   amt: "₹ 86,400" },
  { name: "Credit balances in Advances",        today: 2,  prev: 3,  sev: "med",    amt: "₹ 12,200" },
  { name: "Negative balance accounts",          today: 6,  prev: 5,  sev: "high",   amt: "₹ 1.18 L" },
  { name: "Zero balance accounts",              today: 218,prev: 220,sev: "low",    amt: "—" },
  { name: "Matured FDs not closed",             today: 14, prev: 12, sev: "med",    amt: "₹ 42.5 L" },
  { name: "CC over-limit accounts",             today: 3,  prev: 3,  sev: "high",   amt: "₹ 8.40 L" },
  { name: "Manual interest changes",            today: 0,  prev: 2,  sev: "med",    amt: "—" },
  { name: "Duplicate FDs printed",              today: 1,  prev: 0,  sev: "med",    amt: "₹ 2.50 L" },
  { name: "Duplicate member entries",           today: 2,  prev: 2,  sev: "med",    amt: "—" },
  { name: "Duplicate mobile numbers",           today: 38, prev: 41, sev: "low",    amt: "—" },
  { name: "Logins in odd hours",                today: 1,  prev: 0,  sev: "med",    amt: "—" },
  { name: "Active users not logged in (30d)",   today: 4,  prev: 4,  sev: "med",    amt: "—" },
  { name: "Dormant / non-operational",          today: 312,prev: 310,sev: "low",    amt: "—" },
  { name: "Non-members with deposits/loans",    today: 0,  prev: 0,  sev: "low",    amt: "—" },
  { name: "Accounts without SI",                today: 18, prev: 19, sev: "low",    amt: "—" },
  { name: "Closed accounts with balance",       today: 1,  prev: 1,  sev: "high",   amt: "₹ 4,200" },
  { name: "Clients with multiple accounts",     today: 142,prev: 140,sev: "low",    amt: "—" },
  { name: "Back-dated entries (today)",         today: 3,  prev: 1,  sev: "high",   amt: "₹ 9.60 L" },
  { name: "Users with rate-change rights",      today: 5,  prev: 5,  sev: "med",    amt: "—" },
  { name: "Incomplete KYC (under 90 days)",     today: 12, prev: 15, sev: "med",    amt: "—" },
  { name: "Mobile-no verification pending",     today: 21, prev: 23, sev: "low",    amt: "—" }
];

function severityRank(e) {
  const w = { high: 3, med: 2, low: 1 }[e.sev];
  const delta = e.today - e.prev;
  return w * 10 + Math.max(0, delta);
}

function renderExceptions() {
  const grid = document.querySelector("#exc-grid");
  if (!grid) return;
  const sorted = [...exceptions].sort((a, b) => severityRank(b) - severityRank(a));

  grid.innerHTML = sorted.map(e => {
    const delta = e.today - e.prev;
    const deltaCls = delta > 0 ? "down" : delta < 0 ? "up" : "muted";
    const deltaTxt = delta === 0 ? "0" : (delta > 0 ? `+${delta}` : `${delta}`);
    return `
      <div class="exc-card sev-${e.sev}" tabindex="0">
        <div class="exc-head">
          <div class="exc-name">${e.name}</div>
          <span class="sev-pill sev-pill-${e.sev}">${e.sev.toUpperCase()}</span>
        </div>
        <div class="exc-numbers">
          <div class="exc-count">${e.today}</div>
          <div class="exc-meta">
            <div class="muted small">vs yest. ${e.prev}</div>
            <div class="${deltaCls} small"><b>${deltaTxt}</b></div>
          </div>
        </div>
        <div class="exc-foot muted small">${e.amt}</div>
      </div>
    `;
  }).join("");

  $$(".exc-card", grid).forEach(c => {
    c.addEventListener("click", () => {
      alert("Exception drill placeholder.\n\nIn the live app this opens:\n• The list of offending records\n• Filters by branch / user / scheme\n• Bulk-action workflow (assign / resolve / snooze)\n• Export to Excel for the auditor");
    });
  });
}

function drawGstChart() {
  const svg = document.querySelector("#gst-chart");
  if (!svg) return;
  const w = 600, h = 220, padL = 48, padR = 14, padT = 18, padB = 36;
  const months = ["Dec","Jan","Feb","Mar","Apr","May"];
  const values = [42100, 45800, 48200, 51400, 53600, 54765];
  const max = Math.max(...values) * 1.15;
  const bw = (w - padL - padR) / months.length;
  const ys = v => padT + (1 - v / max) * (h - padT - padB);

  const grid = [];
  const step = 15000;
  for (let v = 0; v <= max; v += step) {
    grid.push(`<line x1="${padL}" x2="${w - padR}" y1="${ys(v)}" y2="${ys(v)}" stroke="#e2e8f0" stroke-width="1"/>`);
    grid.push(`<text x="${padL - 6}" y="${ys(v) + 3}" font-size="10" fill="#64748b" text-anchor="end">₹${(v / 1000).toFixed(0)}k</text>`);
  }

  const bars = months.map((m, i) => {
    const x = padL + i * bw + bw * 0.2;
    const bwi = bw * 0.6;
    const y = ys(values[i]);
    const bh = h - padB - y;
    return `
      <g>
        <rect x="${x}" y="${y}" width="${bwi}" height="${bh}" fill="#0f4c81" rx="3"><title>${m}: ₹${values[i].toLocaleString('en-IN')}</title></rect>
        <text x="${x + bwi / 2}" y="${y - 6}" text-anchor="middle" font-size="10" fill="#0f1d3f" font-weight="600">₹${(values[i]/1000).toFixed(1)}k</text>
        <text x="${x + bwi / 2}" y="${h - 16}" text-anchor="middle" font-size="11" fill="#334155">${m}</text>
      </g>
    `;
  }).join("");

  svg.innerHTML = grid.join("") + bars;
}

function wireDrill() {
  $$(".tbl tbody tr").forEach(tr => {
    tr.addEventListener("click", () => alert("Drill placeholder.\n\nIn the live app: opens the underlying record, edit/action workflow, or audit history."));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderExceptions();
  drawGstChart();
  wireDrill();
});
