// Loans & Recovery dashboard — overdue chart + interactions

function drawOdChart() {
  const svg = document.querySelector("#od-chart");
  if (!svg) return;
  const w = 600, h = 280, padL = 100, padR = 40, padT = 16, padB = 20;
  const data = [
    { label: "DRS",          val: 12.63, color: "#b00020" },
    { label: "Personal",     val: 9.84,  color: "#c9881e" },
    { label: "CC",           val: 4.03,  color: "#c9881e" },
    { label: "PIGMI",        val: 0.71,  color: "#0a7d2e" },
    { label: "Home",         val: 0.38,  color: "#0a7d2e" },
    { label: "LAP",          val: 0.38,  color: "#0a7d2e" },
    { label: "LAFD",         val: 0.32,  color: "#0a7d2e" },
    { label: "Vehicle",      val: 0.05,  color: "#0a7d2e" },
    { label: "Staff",        val: 0.02,  color: "#0a7d2e" }
  ];
  const max = 14;
  const xs = v => padL + (v / max) * (w - padL - padR);
  const rowH = (h - padT - padB) / data.length;

  let inner = "";
  // grid
  for (let v = 0; v <= max; v += 2) {
    inner += `<line x1="${xs(v)}" x2="${xs(v)}" y1="${padT}" y2="${h - padB}" stroke="#e2e8f0" stroke-width="1"/>`;
    inner += `<text x="${xs(v)}" y="${h - 6}" text-anchor="middle" font-size="9" fill="#64748b">₹${v}L</text>`;
  }
  data.forEach((d, i) => {
    const y = padT + i * rowH + rowH * 0.18;
    const bh = rowH * 0.64;
    const bw = xs(d.val) - padL;
    inner += `<text x="${padL - 6}" y="${y + bh/2 + 4}" text-anchor="end" font-size="11" fill="#334155">${d.label}</text>`;
    inner += `<rect x="${padL}" y="${y}" width="${bw}" height="${bh}" fill="${d.color}" rx="3"><title>${d.label}: ₹${d.val} L</title></rect>`;
    inner += `<text x="${xs(d.val) + 4}" y="${y + bh/2 + 4}" font-size="11" fill="${d.color}" font-weight="700">₹${d.val.toFixed(2)}L</text>`;
  });
  svg.innerHTML = inner;
}

function wireDrills() {
  document.querySelectorAll(".tbl tbody tr").forEach(tr => {
    tr.style.cursor = "pointer";
    tr.addEventListener("click", e => {
      if (e.target.tagName === "A") return;
      alert("Loan drill placeholder.\n\nIn the live app this opens:\n• Member 360 (KYC, all accounts, family link)\n• Loan-account ledger with EMI schedule vs actual\n• Repayment-history chart\n• Documents & guarantors\n• Action history & next-action workflow");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  drawOdChart();
  wireDrills();
});
