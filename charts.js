/* Chart.js helpers — consistent styling for Amravati Urban dashboards.
   Loads only after Chart.js global is present.
*/
window.AU = window.AU || {};
AU.colors = {
  brand:   '#0f4c81',
  brand2:  '#1d6fb7',
  accent:  '#c9881e',
  green:   '#0a7d2e',
  green2:  '#38b864',
  red:     '#b00020',
  amber:   '#c9881e',
  purple:  '#6d4c93',
  teal:    '#0891b2',
  ink:     '#0f1d3f',
  muted:   '#64748b',
  line:    '#e2e8f0',
};
AU.alpha = (hex, a) => {
  const r = parseInt(hex.slice(1,3),16),
        g = parseInt(hex.slice(3,5),16),
        b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
};

AU.baseOpts = (yZero = true) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 12, color: AU.colors.ink } },
    tooltip: { backgroundColor: '#0f1d3f', titleFont: { size: 11 }, bodyFont: { size: 11 } },
  },
  scales: {
    y: { beginAtZero: yZero, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 }, color: AU.colors.muted } },
    x: { grid: { display: false }, ticks: { font: { size: 10 }, color: AU.colors.muted } },
  },
});

AU.doughnutOpts = () => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12 } } },
});

AU.radarOpts = () => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: { r: { beginAtZero: true, max: 100, grid: { color: '#e2e8f0' }, angleLines: { color: '#e2e8f0' }, ticks: { display: false }, pointLabels: { font: { size: 10 } } } },
  plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12 } } },
});

/* Defaults when Chart.js is present */
if (window.Chart) {
  Chart.defaults.font.family = '-apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  Chart.defaults.color = AU.colors.ink;
  Chart.defaults.borderColor = AU.colors.line;
}
