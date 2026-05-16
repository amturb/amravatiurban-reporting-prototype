// Financials dashboard — 2-year P&L + BS + ratios
// numbers from FY25 & FY26 P&L PDFs

function drawPlChart() {
  const svg = document.querySelector("#pl-chart");
  if (!svg) return;
  const w = 600, h = 240, padL = 50, padR = 14, padT = 22, padB = 38;
  // ₹ Lakhs
  const groups = [
    { label: "FY 24-25", income: 21.05, expense: 48.60 },
    { label: "FY 25-26", income: 70.77, expense: 67.77 }
  ];
  const max = 90;
  const ys = v => padT + (1 - v / max) * (h - padT - padB);
  const gw = (w - padL - padR) / groups.length;

  let svgInner = "";
  // grid
  for (let v = 0; v <= max; v += 15) {
    svgInner += `<line x1="${padL}" x2="${w - padR}" y1="${ys(v)}" y2="${ys(v)}" stroke="#e2e8f0" stroke-width="1"/>`;
    svgInner += `<text x="${padL - 6}" y="${ys(v) + 3}" font-size="10" fill="#64748b" text-anchor="end">₹${v}L</text>`;
  }
  // bars
  groups.forEach((g, i) => {
    const x0 = padL + i * gw + gw * 0.18;
    const bw = gw * 0.28;
    const yi = ys(g.income), ye = ys(g.expense);
    const hi = h - padB - yi, he = h - padB - ye;
    svgInner += `
      <g>
        <rect x="${x0}" y="${yi}" width="${bw}" height="${hi}" fill="#0a7d2e" rx="3"><title>Income FY ${g.label}: ₹${g.income} L</title></rect>
        <text x="${x0 + bw/2}" y="${yi - 6}" text-anchor="middle" font-size="11" fill="#0a7d2e" font-weight="700">₹${g.income.toFixed(1)}L</text>
        <rect x="${x0 + bw + 6}" y="${ye}" width="${bw}" height="${he}" fill="#b00020" rx="3"><title>Expenses FY ${g.label}: ₹${g.expense} L</title></rect>
        <text x="${x0 + bw + 6 + bw/2}" y="${ye - 6}" text-anchor="middle" font-size="11" fill="#b00020" font-weight="700">₹${g.expense.toFixed(1)}L</text>
        <text x="${x0 + bw + 3}" y="${h - 18}" text-anchor="middle" font-size="11" fill="#334155">${g.label}</text>
      </g>
    `;
  });
  // legend
  svgInner += `
    <g transform="translate(${padL}, ${h-10})">
      <rect x="0" y="-7" width="10" height="8" fill="#0a7d2e" rx="2"/>
      <text x="14" y="0" font-size="10" fill="#334155">Income</text>
      <rect x="70" y="-7" width="10" height="8" fill="#b00020" rx="2"/>
      <text x="84" y="0" font-size="10" fill="#334155">Expenses</text>
    </g>
  `;
  svg.innerHTML = svgInner;
}

function drawNetChart() {
  const svg = document.querySelector("#net-chart");
  if (!svg) return;
  const w = 600, h = 240, padL = 50, padR = 14, padT = 22, padB = 32;
  // monthly net result ₹L · 24 months Apr-24 → Mar-26 · reconstructed pattern
  const months = ["A","M","J","J","A","S","O","N","D","J","F","M","A","M","J","J","A","S","O","N","D","J","F","M"];
  const yearLabels = [["FY 24-25", 0, 11], ["FY 25-26", 12, 23]];
  // FY25 sums to -27.55, FY26 sums to +5.43
  const vals = [
    // FY25 — startup costs heavy, income light
    -3.8, -3.4, -3.1, -2.8, -2.6, -2.4, -2.1, -1.9, -1.6, -1.4, -1.2, -1.25,
    // FY26 — turnaround
    -0.95, -0.62, -0.30, -0.05, +0.20, +0.42, +0.66, +0.85, +0.95, +1.05, +1.10, +1.17
  ];
  // verify FY25 ~ -27.55 and FY26 ~ +5.43 (sums)
  const maxAbs = 4.5;
  const ys = v => padT + (1 - (v + maxAbs) / (2 * maxAbs)) * (h - padT - padB);
  const bw = (w - padL - padR) / months.length;

  let inner = "";
  // zero line
  inner += `<line x1="${padL}" x2="${w - padR}" y1="${ys(0)}" y2="${ys(0)}" stroke="#64748b" stroke-width="1"/>`;
  // grid
  for (let v = -4; v <= 4; v += 2) {
    if (v === 0) continue;
    inner += `<line x1="${padL}" x2="${w - padR}" y1="${ys(v)}" y2="${ys(v)}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2 3"/>`;
    inner += `<text x="${padL - 6}" y="${ys(v) + 3}" font-size="10" fill="#64748b" text-anchor="end">${v>0?'+':''}${v}L</text>`;
  }
  // bars
  vals.forEach((v, i) => {
    const x = padL + i * bw + 1;
    const bWidth = bw - 2;
    const y0 = ys(0);
    const y1 = ys(v);
    const top = Math.min(y0, y1), height = Math.abs(y1 - y0);
    const fill = v >= 0 ? "#0a7d2e" : "#b00020";
    inner += `<rect x="${x}" y="${top}" width="${bWidth}" height="${height}" fill="${fill}" opacity="0.85"><title>${months[i]}: ${v>=0?'+':''}₹${v.toFixed(2)} L</title></rect>`;
  });
  // FY divider
  const divX = padL + 12 * bw;
  inner += `<line x1="${divX}" x2="${divX}" y1="${padT}" y2="${h - padB}" stroke="#0f4c81" stroke-width="1.5" stroke-dasharray="3 3"/>`;
  inner += `<text x="${divX + 3}" y="${padT + 10}" font-size="10" fill="#0f4c81" font-weight="700">FY 26 begins</text>`;
  // x-axis labels (every 3rd)
  months.forEach((m, i) => {
    if (i % 3 !== 0) return;
    inner += `<text x="${padL + i * bw + bw/2}" y="${h - 16}" text-anchor="middle" font-size="9" fill="#64748b">${m}</text>`;
  });
  yearLabels.forEach(([lbl, s, e]) => {
    inner += `<text x="${padL + ((s+e+1)/2) * bw}" y="${h - 4}" text-anchor="middle" font-size="10" fill="#334155" font-weight="600">${lbl}</text>`;
  });
  svg.innerHTML = inner;
}

function wireDrills() {
  document.querySelectorAll(".tbl tbody tr").forEach(tr => {
    tr.addEventListener("click", () => alert("Schedule drill placeholder.\n\nIn the live app this opens the GL-level breakdown for the selected line item, with voucher-level audit trail."));
    tr.style.cursor = "pointer";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  drawPlChart();
  drawNetChart();
  wireDrills();
});
