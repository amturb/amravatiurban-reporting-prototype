// Branch Manager dashboard — overdue ageing bar chart + drill placeholders
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function drawAgeingChart() {
  const svg = document.querySelector("#ageing-chart");
  if (!svg) return;
  const w = 600, h = 220, padL = 60, padR = 14, padT = 18, padB = 36;

  const buckets = [
    { name: "DRS",      amt: 12.63, n: "all", color: "#b00020" },
    { name: "Personal", amt:  9.84, n: 39,    color: "#d96b2a" },
    { name: "CC",       amt:  4.03, n:  6,    color: "#c9881e" },
    { name: "PIGMI",    amt:  0.20, n:  4,    color: "#a8c635" },
    { name: "LAFD",     amt:  0.18, n:  3,    color: "#0a7d2e" },
    { name: "Others",   amt:  1.14, n: 43,    color: "#0f4c81" }
  ];

  const max = Math.max(...buckets.map(b => b.amt)) * 1.15;
  const bw = (w - padL - padR) / buckets.length;
  const ys = (v) => padT + (1 - v / max) * (h - padT - padB);

  // Grid lines
  const grid = [];
  for (let v = 0; v <= max; v += 2) {
    grid.push(`<line x1="${padL}" x2="${w - padR}" y1="${ys(v)}" y2="${ys(v)}" stroke="#e2e8f0" stroke-width="1"/>`);
    grid.push(`<text x="${padL - 6}" y="${ys(v) + 3}" font-size="10" fill="#64748b" text-anchor="end">₹${v.toFixed(0)}L</text>`);
  }

  const bars = buckets.map((b, i) => {
    const x = padL + i * bw + bw * 0.15;
    const bwi = bw * 0.7;
    const y = ys(b.amt);
    const bh = h - padB - y;
    return `
      <g class="ageing-bar" style="cursor:pointer">
        <rect x="${x}" y="${y}" width="${bwi}" height="${bh}" fill="${b.color}" rx="3">
          <title>${b.name}: ₹${b.amt.toFixed(2)} L overdue across ${b.n} accounts</title>
        </rect>
        <text x="${x + bwi / 2}" y="${y - 6}" text-anchor="middle" font-size="11" fill="#0f1d3f" font-weight="600">₹${b.amt.toFixed(1)}L</text>
        <text x="${x + bwi / 2}" y="${h - 18}" text-anchor="middle" font-size="11" fill="#334155">${b.name}</text>
        <text x="${x + bwi / 2}" y="${h - 5}" text-anchor="middle" font-size="9" fill="#64748b">${b.n} a/c</text>
      </g>
    `;
  }).join("");

  svg.innerHTML = grid.join("") + bars;

  $$(".ageing-bar", svg).forEach((g, i) => {
    g.addEventListener("click", () => {
      const b = buckets[i];
      alert(`Drill placeholder: ${b.name} overdue\n\nShows list of accounts totalling ₹${b.amt.toFixed(2)} L.\nEach row links to Customer 360 + recovery action workflow.`);
    });
  });
}

function wireDrill() {
  $$(".tbl tbody tr").forEach(tr => {
    tr.addEventListener("click", () => alert("Customer 360 placeholder.\n\nWill show: all accounts · balances · recent transactions · KYC · linked loans · recovery notes."));
  });
  $$(".alert-list li").forEach(li => {
    li.addEventListener("click", () => alert("Exception detail placeholder.\n\nIn the live app this opens the underlying list of offending records + an action workflow (assign / resolve / snooze)."));
  });
  $$(".kpi").forEach(k => {
    k.addEventListener("click", () => alert("KPI drill-down placeholder.\n\nIn the live app: filtered list of vouchers/accounts contributing to this number."));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  drawAgeingChart();
  wireDrill();
});

/* ---------------- v2: 7-day cash trend ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.Chart) return;
  const el = document.getElementById('branch-7day');
  if (!el) return;
  new Chart(el, {
    type: 'line',
    data: {
      labels: ['10 May','11 May','12 May','13 May','14 May','15 May','16 May'],
      datasets: [
        { label: 'Cash in hand', data: [12.4, 14.8, 16.2, 15.6, 17.3, 18.4, 19.08],
          borderColor: AU.colors.accent, backgroundColor: AU.alpha(AU.colors.accent, .14), fill: true, tension: .35, pointRadius: 3 },
        { label: 'Bank balances', data: [18.6, 19.4, 20.2, 21.5, 22.1, 22.8, 22.34],
          borderColor: AU.colors.brand, backgroundColor: AU.alpha(AU.colors.brand, .12), fill: true, tension: .35, pointRadius: 3 },
        { label: 'Total liquid', data: [31.0, 34.2, 36.4, 37.1, 39.4, 41.2, 41.42],
          borderColor: AU.colors.green, borderDash: [4,3], pointRadius: 3, fill: false, tension: .35 }
      ]
    },
    options: Object.assign(AU.baseOpts(false), { plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 10 } } } })
  });
});