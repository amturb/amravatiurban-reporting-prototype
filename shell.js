/* Shared shell: injects sidebar navigation + topbar styling, sets active link.
   Usage: <body data-page="ceo"> + <script src="shell.js" defer></script>
*/
(function () {
  const NAV = [
    { group: "Chairman's view", items: [
      { id: 'ceo',        href: 'index.html',       label: 'CEO Scorecard',         icon: '◎' },
      { id: 'insights',   href: 'insights.html',    label: 'AI Insights & Calendar',icon: '✦' },
      { id: 'board',      href: 'board.html',       label: 'Board & Committee',     icon: '⌂' },
    ]},
    { group: 'Daily operations', items: [
      { id: 'branch',     href: 'branch.html',      label: 'Branch Manager',        icon: '☰' },
      { id: 'eod',        href: 'eod.html',         label: 'EOD Close Register',    icon: '⏱' },
      { id: 'employee',   href: 'employee.html',    label: 'Employee Performance',  icon: '◉' },
    ]},
    { group: 'Financial statements', items: [
      { id: 'financials', href: 'financials.html',  label: 'P&L · BS · Ratios',     icon: '∑' },
      { id: 'cashflow',   href: 'cashflow.html',    label: 'Cash Flow',             icon: '⇄' },
      { id: 'budget',     href: 'budget.html',      label: 'Budget vs Actual',      icon: '◇' },
      { id: 'gl',         href: 'gl.html',          label: 'GL / Trial Balance',    icon: '☷' },
    ]},
    { group: 'Risk & compliance', items: [
      { id: 'loans',      href: 'loans.html',       label: 'Loans & Recovery',      icon: '◈' },
      { id: 'alm',        href: 'alm.html',         label: 'ALM / Liquidity gap',   icon: '◑' },
      { id: 'compliance', href: 'compliance.html',  label: 'Statutory Compliance',  icon: '⚖' },
      { id: 'audit',      href: 'audit.html',       label: 'Audit & Inspection',    icon: '✓' },
    ]},
    { group: 'Members & products', items: [
      { id: 'member360',  href: 'member360.html',   label: 'Member Profile 360°',   icon: '◐' },
      { id: 'merchants',  href: 'merchants.html',   label: 'Merchant Loan Engine',  icon: '⚡' },
      { id: 'dividend',   href: 'dividend.html',    label: 'Dividend & Lifecycle',  icon: '✺' },
    ]},
  ];

  const currentPage = document.body.dataset.page || '';

  /* Build sidebar */
  const aside = document.createElement('aside');
  aside.className = 'side';
  let html = `
    <div class="side-brand">
      <div class="side-logo">AU</div>
      <div>
        <div class="side-name">Amravati Urban</div>
        <div class="side-sub">CBS reporting · K3One</div>
      </div>
    </div>
    <nav class="side-nav">`;
  NAV.forEach(g => {
    html += `<div class="side-group">${g.group}</div>`;
    g.items.forEach(it => {
      const cls = it.id === currentPage ? 'side-link active' : 'side-link';
      html += `<a class="${cls}" href="${it.href}"><span class="si">${it.icon}</span>${it.label}</a>`;
    });
  });
  html += `</nav>
    <div class="side-foot">
      <div class="side-stamp">Live · 16 May 2026</div>
      <a class="side-repo" href="https://github.com/amturb/amravatiurban-reporting-prototype" target="_blank">View on GitHub</a>
    </div>`;
  aside.innerHTML = html;

  /* Remove existing horizontal tab strip if present */
  const oldTabs = document.querySelector('nav.tabs');
  if (oldTabs) oldTabs.remove();

  document.body.classList.add('has-sidebar');
  document.body.insertBefore(aside, document.body.firstChild);

  /* Mobile toggle */
  const toggle = document.createElement('button');
  toggle.className = 'side-toggle';
  toggle.setAttribute('aria-label', 'Open menu');
  toggle.innerHTML = '☰';
  toggle.onclick = () => aside.classList.toggle('open');
  document.body.appendChild(toggle);
})();
