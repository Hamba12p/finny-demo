// Finny — view templates. Pure functions: read Store + seed data, return
// an HTML string. App.render() is the only thing that mutates the DOM.

function pillClass(status) {
  const map = { submitted: "pill-pending", approved: "pill-approved", disbursed: "pill-disbursed", repaid: "pill-repaid", rejected: "pill-rejected", overdue: "pill-overdue" };
  return "pill " + (map[status] || "pill-pending");
}
function statusLabel(status) {
  const map = { submitted: "Pending", approved: "Approved", disbursed: "Disbursed", repaid: "Repaid", rejected: "Rejected", overdue: "Overdue" };
  return map[status] || status;
}
function licensePill(lender) {
  if (!lender.licensed) return `<span class="pill pill-license-bad">${Icon.alert(12)} Not licensed</span>`;
  if (lender.complaintsUpheld > 0) return `<span class="pill pill-license-warn">Licensed · ${lender.complaintsUpheld} complaint${lender.complaintsUpheld > 1 ? "s" : ""}</span>`;
  return `<span class="pill pill-license-ok">${Icon.check(12)} UMRA licensed</span>`;
}
function reportPillClass(status) {
  const map = { "under-review": "pill-report-under-review", "resolved": "pill-report-resolved", "confirmed-scam": "pill-report-confirmed-scam" };
  return "pill " + (map[status] || "pill-report-under-review");
}
function reportStatusLabel(status) {
  const map = { "under-review": "Under review", "resolved": "Resolved", "confirmed-scam": "Confirmed scam" };
  return map[status] || status;
}
function brandBadge(lender, small) {
  const sz = small ? 20 : 24;
  const svgOpen = `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">`;
  const svgClose = "</svg>";
  let glyph;
  if (lender.id === "apex-finance") {
    glyph = svgOpen + '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12h8M12 8v8"/>' + svgClose;
  } else if (lender.id === "bridge-credit") {
    glyph = svgOpen + '<circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/>' + svgClose;
  } else if (lender.id === "sente-yange") {
    glyph = svgOpen + '<circle cx="12" cy="12" r="9"/>' + svgClose;
  } else if (lender.id === "kasente-direct") {
    glyph = svgOpen + '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12h8"/>' + svgClose;
  } else if (!lender.licensed) {
    glyph = svgOpen + '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path d="M12 10v4"/><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none"/>' + svgClose;
  } else {
    glyph = svgOpen + '<rect x="4" y="4" width="16" height="16" rx="2"/>' + svgClose;
  }
  return `<span class="brand-badge ${small ? "small" : ""} brand-${lender.tint}">${glyph}</span>`;
}
function fraudTypeLabel(type) {
  const found = FRAUD_TYPES.find((f) => f.id === type);
  return found ? found.label : type;
}
function safeText(value) {
  return escapeHtml(String(value == null ? "" : value));
}

function offerRow(cand) {
  const flagClass = cand.flagged ? " offer-row-flag" : "";
  const breakdown = cand.scoreBreakdown || { cost: { score: 0, weight: 40 }, trust: { score: 0, weight: 35 }, fit: { score: 0, weight: 25 } };
  return `
  <div class="offer-row${flagClass}">
    <div class="offer-lender">
      ${brandBadge(cand.lender)}
      <div>
        <div><b>${safeText(cand.lender.name)}</b> ${cand.flagged ? '<span class="pill pill-flagged">Flagged</span>' : ""}</div>
        <div class="offer-sub">${safeText(cand.product.name)} · ${safeText(cand.lender.umraRef)}</div>
      </div>
    </div>
    <div class="offer-terms">
      <span>${cand.product.apr}% APR</span>
      <span>${ugx(cand.totalRepayment)} total</span>
      <span>${cand.product.tenureMinDays}–${cand.product.tenureMaxDays}d</span>
    </div>
    <div class="offer-actions">
      <span class="match-score">${cand.finalScore} match</span>
      <button class="btn btn-primary btn-small" data-action="apply" data-product="${cand.product.id}">Apply</button>
    </div>
    <div class="offer-reasons">
      <div class="offer-reason-pills">${cand.reasons.map((r) => `<span>${safeText(r)}</span>`).join("")}</div>
      <details class="score-breakdown">
        <summary>Why this offer?</summary>
        <div class="score-breakdown-body">
          <div><span>Cost</span><b>${breakdown.cost.score}</b><small>${breakdown.cost.weight}%</small></div>
          <div><span>Trust</span><b>${breakdown.trust.score}</b><small>${breakdown.trust.weight}%</small></div>
          <div><span>Fit</span><b>${breakdown.fit.score}</b><small>${breakdown.fit.weight}%</small></div>
        </div>
      </details>
    </div>
  </div>`;
}

const Views = {
  // ---------------------------------------------------------------- landing
  landing() {
    const licensedCount = LENDERS.filter((l) => l.licensed).length;
    const totalDisbursed = LENDERS.reduce((s, l) => s + l.disbursedTotal, 0);
    const avgApproval = (LENDERS.reduce((s, l) => s + l.avgApprovalHours, 0) / LENDERS.length).toFixed(1);
    const heroBorrower = Store.currentBorrower();
    const heroProfile = Store.currentProfile();
    const heroRecs = Recommender.rank(heroBorrower, 300000, 30, heroProfile);
    const heroTop = heroRecs.filter((c) => !c.flagged).slice(0, 3);
    const heroBest = heroTop[0] || heroRecs[0] || { totalRepayment: 311500, product: { apr: 18 }, lender: { name: "—", licensed: true }, finalScore: 0, costScore: 0, trustScore: 0, fitScore: 0 };
    const heroLicCount = heroTop.filter((c) => c.lender.licensed).length;
    const costMultiple = heroBest.totalRepayment && 300000 ? (heroBest.totalRepayment / 300000).toFixed(1) + "x" : "—";
    const heroLedgerItems = [
      { icon: Icon.check(14), badgeClass: "brand-green", label: "Total cost", figure: ugx(heroBest.totalRepayment), pill: costMultiple },
      { icon: Icon.chart(14), badgeClass: "brand-gold", label: "APR", figure: heroBest.product.apr + "%", pill: "clear" },
      { icon: Icon.shield(14), badgeClass: heroBest.lender.licensed ? "brand-navy" : "brand-red", label: "Lender", figure: heroBest.lender.licensed ? "UMRA licensed" : "Not licensed", pill: heroBest.lender.licensed ? "safe" : "risk" },
    ];
    return `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Finny — loan marketplace for Uganda</p>
        <h1 class="hero-title">Borrow with your eyes open.</h1>
        <p class="hero-sub">Finny keeps the same comparison engine in two registers: a ledger for the borrower and a terminal for the feature phone over USSD. Every offer shows total repayment, licence status, and plain-language guidance before you tap apply.</p>
        <div class="hero-cta">
          <button class="btn btn-primary" data-action="enter-role" data-role="borrower">${Icon.wallet(15)} Continue as borrower</button>
          <button class="btn btn-outline" data-action="enter-role" data-role="lender">${Icon.building(15)} Continue as lender</button>
        </div>
        <button class="link-cta" data-action="nav" data-route="ussd">${Icon.phone(14)} See the USSD channel ${Icon.arrowRight(14)}</button>
      </div>
      <div class="hero-stage" aria-hidden="true">
        <div class="hero-ledger">
          <div class="hero-ledger-head"><span>Ledger</span><span>${ugx(300000)}</span></div>
          <div class="hero-rotator">
            ${heroLedgerItems.map((item) => `<div class="hero-cycle-item"><span class="brand-badge small ${item.badgeClass}">${item.icon}</span><div><span class="hero-cycle-label">${safeText(item.label)}</span><span class="hero-cycle-figure">${item.figure}</span></div><span class="hero-cycle-pill">${safeText(item.pill)}</span></div>`).join("")}
          </div>
        </div>
        <div></div>
        <div class="hero-terminal">
          <div class="hero-terminal-head"><span>USSD trace</span><span>*247#</span></div>
          <div class="hero-terminal-body">
            <div class="hero-terminal-line"><span>1. Language</span><span>English</span></div>
            <div class="hero-terminal-line"><span>2. Amount</span><span>UGX 300k</span></div>
            <div class="hero-terminal-line"><span>3. Offer</span><span>${heroTop.length} lender${heroTop.length !== 1 ? "s" : ""}</span></div>
            <div class="hero-terminal-line"><span>4. Grounding</span><span>${heroLicCount}/${heroTop.length} licensed</span></div>
          </div>
          <div class="hero-terminal-footer">Same engine, every phone — not a stripped-down app.</div>
        </div>
      </div>
    </section>
    <div class="rail rail-wrap">
      <div class="rail-card"><h3>${Icon.phone(15)} Works without a smartphone</h3><p>USSD is still the dominant access channel in Uganda. Every screen a smartphone borrower sees also exists as a *247# session, right down to the language menu.</p></div>
      <div class="rail-card"><h3>${Icon.shield(15)} Every lender is checked</h3><p>Licence status against the UMRA register is shown on every offer — not buried in terms. ${licensedCount} of ${LENDERS.length} lenders in this marketplace are currently licensed.</p></div>
      <div class="rail-card"><h3>${Icon.chat(15)} Explains itself in plain language</h3><p>An assistant answers "what does APR mean" or "is this normal" in the moment, so a first-time borrower isn't guessing alone.</p></div>
    </div>
    <div class="grid-3">
      <div class="stat-card"><span class="stat-label">Marketplace disbursed</span><span class="stat-num">${ugx(totalDisbursed)}</span></div>
      <div class="stat-card"><span class="stat-label">Licensed lenders</span><span class="stat-num">${licensedCount}<span class="stat-of"> / ${LENDERS.length}</span></span></div>
      <div class="stat-card"><span class="stat-label">Avg. approval time</span><span class="stat-num">${avgApproval}<span class="stat-of"> hrs</span></span></div>
    </div>
    <p class="small-note" style="text-align:center;padding-top:6px">Demo data throughout — mocked lenders, mocked applications, real scoring logic and real Uganda consumer-protection content (NPS Act 2020, UMRA licensing, DPPA 2019 consent principles).</p>
    `;
  },

  // ------------------------------------------------------- borrower views
  borrowerDashboard() {
    const b = Store.currentBorrower();
    const apps = Store.applicationsByBorrower(b.id);
    const active = apps.filter((a) => ["disbursed", "overdue", "approved", "submitted"].includes(a.status));
    const overdue = apps.find((a) => a.status === "overdue");
    const repaidTotal = apps.filter((a) => a.status === "repaid").reduce((s, a) => s + a.amount, 0);
    const statusCounts = {};
    apps.forEach((a) => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1; });
    const donutSegs = Object.keys(statusCounts).map((s) => ({ label: statusLabel(s), value: statusCounts[s], color: { submitted: "var(--gold)", approved: "var(--gold)", disbursed: "var(--navy)", repaid: "var(--green)", rejected: "var(--red)", overdue: "var(--red)" }[s] }));
    const profile = Store.currentProfile();
    const recs = Recommender.rank(b, 300000, 30, profile).filter((c) => !c.flagged).slice(0, 3);

    return `
    <div class="page-head">
      <div><h1>Welcome back, ${safeText(b.name.split(" ")[0])}</h1><p class="small-note">${safeText(b.occupation)} · ${safeText(b.district)} · Finny member since ${safeText(b.memberSince)}</p></div>
    </div>
    <div class="panel profile-panel">
      <div class="panel-head-row"><h2>Borrower profile</h2><span class="small-note">Shapes which offers appear first</span></div>
      <label class="profile-select-label">Select a segment
        <select data-action="set-profile">
          <option value="first_time_low_income" ${profile === "first_time_low_income" ? "selected" : ""}>First-time borrower</option>
          <option value="experienced_borrower" ${profile === "experienced_borrower" ? "selected" : ""}>Experienced borrower</option>
          <option value="student" ${profile === "student" ? "selected" : ""}>Student</option>
        </select>
      </label>
      <p class="small-note">First-time borrowers see smaller, simpler offers; students see more flexible, low-pressure options.</p>
    </div>
    <div class="grid-4">
      <div class="stat-card"><span class="stat-label">Alt-data score</span><span class="stat-num">${b.altScore}<span class="stat-of"> / 100</span></span></div>
      <div class="stat-card"><span class="stat-label">Monthly income</span><span class="stat-num">${ugx(b.monthlyIncome)}</span></div>
      <div class="stat-card"><span class="stat-label">Active loans</span><span class="stat-num">${active.length}</span></div>
      <div class="stat-card"><span class="stat-label">${overdue ? "Overdue amount" : "Repaid to date"}</span><span class="stat-num">${overdue ? ugx(overdue.amount) : ugx(repaidTotal)}</span></div>
    </div>
    <div class="grid-2">
      <div class="panel">
        <div class="panel-head-row"><h2>Your loans at a glance</h2></div>
        ${apps.length ? Charts.donut(donutSegs, { centerNum: apps.length, centerSub: "applications" }) : `<div class="empty-state"><h3>${Icon.chart(18)} No loans on record</h3><p>Your loan applications will appear here once you apply through the Marketplace.</p></div>`}
      </div>
      <div class="panel">
        <div class="panel-head-row"><h2>Recommended for you</h2><span class="small-note">UGX 300,000 · 30 days</span></div>
        <div class="offer-list">${recs.length ? recs.map(offerRow).join("") : `<div class="empty-state"><p>No lender offers match your current profile right now. Try adjusting your borrower segment or visit the Marketplace for the full comparison.</p></div>`}</div>
        <button class="btn-link" data-action="nav" data-route="marketplace" style="margin-top:8px">See full marketplace →</button>
      </div>
    </div>
    <div class="panel">
      <div class="panel-head-row"><h2>Recent activity</h2><button class="btn-link" data-action="nav" data-route="applications">View all →</button></div>
      ${apps.slice(0, 4).map((a) => appRow(a, "borrower")).join("") || `<div class="empty-state"><p>No activity yet. Once you apply for a loan, your application history will show up here.</p></div>`}
    </div>`;
  },

  marketplace() {
    const b = Store.currentBorrower();
    const profile = Store.currentProfile();
    return `
    <div class="page-head"><div><h1>Marketplace</h1><p class="small-note">Compare every lender in one place — real total repayment, real licence status.</p></div></div>
    <div class="panel profile-panel">
      <div class="panel-head-row"><h2>Borrower profile</h2><span class="small-note">Affects which offers are ranked first</span></div>
      <label class="profile-select-label">Select a segment
        <select data-action="set-profile">
          <option value="first_time_low_income" ${profile === "first_time_low_income" ? "selected" : ""}>First-time borrower</option>
          <option value="experienced_borrower" ${profile === "experienced_borrower" ? "selected" : ""}>Experienced borrower</option>
          <option value="student" ${profile === "student" ? "selected" : ""}>Student</option>
        </select>
      </label>
    </div>
    <form class="inline-form" data-form="marketplace-amount">
      <label>Loan amount (UGX)<input type="number" name="amount" value="300000" min="20000" step="10000" /></label>
      <button class="btn btn-primary" type="submit">${Icon.search(14)} Compare offers</button>
    </form>
    <div id="marketplace-results">${Views._marketplaceResults(b, 300000)}</div>`;
  },

  marketplaceSkeleton(amount) {
    return `
      <div class="loading-surface">
        <div class="loading-line tall"></div>
        <div class="loading-line medium"></div>
        <div class="loading-line short"></div>
        <p class="small-note">Comparing ${ugx(amount)} across lenders…</p>
      </div>`;
  },

  _marketplaceResults(borrower, amount) {
    const profile = Store.currentProfile();
    const all = Recommender.rank(borrower, amount, 30, profile);
    const clean = all.filter((c) => !c.flagged);
    const flagged = all.filter((c) => c.flagged);
    if (!all.length) return `<div class="empty-state"><h3>${Icon.search(18)} No offers for that amount</h3><p>No lenders currently have products matching UGX ${amount.toLocaleString()}. Try a different loan amount — most products in this marketplace start from UGX 20,000.</p></div>`;
    return `
    <div class="offer-list">${clean.map(offerRow).join("")}</div>
    ${flagged.length ? `<div class="flagged-block">
      <h3>${Icon.alert(15)} Flagged lenders — proceed with caution</h3>
      <div class="offer-list">${flagged.map(offerRow).join("")}</div>
    </div>` : ""}`;
  },

  applications() {
    const apps = Store.applicationsByBorrower("you");
    return `
    <div class="page-head"><div><h1>My applications</h1><p class="small-note">${apps.length} total</p></div></div>
    <div class="panel">
      ${apps.length ? apps.map((a) => appRow(a, "borrower")).join("") : `<div class="empty-state"><h3>${Icon.wallet(18)} No applications yet</h3><p>You haven't applied for a loan. Head to the Marketplace to compare licensed lenders side by side and find the best offer for your situation.</p><button class="btn btn-primary btn-small" data-action="nav" data-route="marketplace">${Icon.search(14)} Browse the marketplace</button></div>`}
    </div>`;
  },

  fraudCentre() {
    const reports = Store.state.fraudReports;
    return `
    <div class="page-head"><div><h1>Fraud centre</h1><p class="small-note">Report a scam in under a minute, or check the warning signs first.</p></div></div>
    <div class="grid-2">
      <div class="panel">
        <h2>Report something suspicious</h2>
        <form data-form="fraud-report">
          <label>What happened?
            <select name="type">${FRAUD_TYPES.map((f) => `<option value="${f.id}">${f.label}</option>`).join("")}</select>
          </label>
          <label>Where did it happen?
            <select name="channel"><option>App</option><option>SMS</option><option>Call</option><option>USSD</option><option>WhatsApp</option></select>
          </label>
          <label>Tell us more<textarea name="summary" rows="3" placeholder="What did the lender or caller ask you to do?"></textarea></label>
          <button class="btn btn-primary" type="submit">${Icon.send(14)} Submit report</button>
        </form>
      </div>
      <div class="panel">
        <h2>Warning signs of a risky lender</h2>
        <ul style="margin:0;padding-left:18px;font-size:14px;color:var(--body-c);display:flex;flex-direction:column;gap:8px">
          <li>Asks you to pay a fee <b>before</b> releasing the loan.</li>
          <li>Guarantees approval with no assessment at all.</li>
          <li>Won't show total repayment in shillings before you accept.</li>
          <li>Uses harassment or contacts people in your phone to pressure repayment.</li>
          <li>Has no licence information or physical contact details.</li>
          <li>Asks for your mobile money PIN, password, or an OTP code.</li>
        </ul>
      </div>
    </div>
    <div class="panel">
      <h2>Your reports</h2>
      ${reports.map((r) => `
      <div class="app-row">
        <div class="app-row-main"><span class="brand-badge small brand-red">${Icon.alert(14)}</span>
          <div><div><b>${safeText(fraudTypeLabel(r.type))}</b> <span class="small-note">· ${safeText(r.channel)} · ${safeText(r.district)}</span></div><div class="small-note">${safeText(r.summary)}</div></div>
        </div>
        <div class="app-row-end"><span class="${reportPillClass(r.status)}">${reportStatusLabel(r.status)}</span><span class="small-note">${timeAgo(r.createdAt)}</span></div>
      </div>`).join("") || `<div class="empty-state"><h3>${Icon.shield(18)} No reports filed</h3><p>You haven't reported any suspicious activity yet. If a lender asks for upfront fees, threatens you, or behaves suspiciously, file a report here — it takes under a minute.</p></div>`}
    </div>
    <div class="panel">
      <h2>Escalation contacts</h2>
      ${HELP_CONTACTS.map((h) => `<div class="ledger-row"><span>${safeText(h.label)}</span><b class="small">${safeText(h.detail)}</b></div>`).join("")}
    </div>`;
  },

  rights() {
    return `
    <div class="page-head"><div><h1>Know your rights</h1><p class="small-note">Grounded in Uganda's National Payment Systems Act 2020, UMRA licensing rules, and the Data Protection and Privacy Act 2019.</p></div></div>
    <div class="grid-2">
      ${RIGHTS_CONTENT.map((r) => `<div class="rail-card"><h3>${Icon.badge(15)} ${safeText(r.title)}</h3><p>${safeText(r.body)}</p></div>`).join("")}
    </div>
    <div class="panel">
      <h2>Plain-language glossary</h2>
      <div class="grid-2">
        ${GLOSSARY.map((g) => `<div><b>${safeText(g.term)}</b><p class="small muted" style="margin-top:2px">${safeText(g.def)}</p></div>`).join("")}
      </div>
    </div>
    <div class="panel">
      <h2>${Icon.globe(15)} Your data, your consent</h2>
      <p class="small muted">Under the DPPA 2019, Finny may only collect what it has a lawful basis and clear purpose for, and must appoint a registered data protection officer. Every credit-check step in this demo is a stand-in for a real, explicit consent screen — nothing here is collected without you seeing why first.</p>
    </div>`;
  },

  assistant() {
    const hist = Store.state.chatHistory;
    const suggestions = ["What does APR mean?", "Is it normal to pay a fee upfront?", "How do I know a lender is licensed?", "What's the difference between flat and reducing interest?"];
    return `
    <div class="page-head"><div><h1>Assistant</h1><p class="small-note">Plain-language answers on loan terms, fraud, and your rights.</p></div></div>
    <div class="chat-panel">
      <div class="chat-log" id="chat-log">${hist.map((m) => `<div class="chat-msg ${m.from === "bot" ? "chat-bot" : "chat-user"}">${safeText(m.text).replace(/\n/g, "<br>")}</div>`).join("")}</div>
      <form class="chat-form" data-form="chat">
        <input type="text" name="q" placeholder="Ask a question…" autocomplete="off" />
        <button class="btn btn-primary" type="submit">${Icon.send(15)}</button>
      </form>
    </div>
    <div class="rail rail-wrap" style="padding-top:14px">
      ${suggestions.map((s) => `<button class="rail-card" style="text-align:left;border:1px solid var(--hairline);cursor:pointer" data-action="ask-suggestion" data-q="${safeText(s)}"><p>${safeText(s)}</p></button>`).join("")}
    </div>`;
  },

  // --------------------------------------------------------- lender views
  lenderDashboard() {
    const lender = Store.currentLender();
    const apps = Store.applicationsByLender(lender.id);
    const pending = apps.filter((a) => a.status === "submitted").length;
    const statusCounts = {};
    apps.forEach((a) => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1; });
    const donutSegs = Object.keys(statusCounts).map((s) => ({ label: statusLabel(s), value: statusCounts[s], color: { submitted: "var(--gold)", approved: "var(--gold)", disbursed: "var(--navy)", repaid: "var(--green)", rejected: "var(--red)", overdue: "var(--red)" }[s] }));

    const weeks = 6;
    const buckets = new Array(weeks).fill(0).map((_, i) => ({ label: "W-" + (weeks - 1 - i), value: 0 }));
    apps.forEach((a) => {
      const days = Math.floor((Date.now() - new Date(a.createdAt).getTime()) / 86400000);
      const w = Math.min(weeks - 1, Math.floor(days / 7));
      buckets[weeks - 1 - w].value += 1;
    });

    return `
    <div class="page-head">
      <div><h1>${safeText(lender.name)}</h1><p class="small-note">${licensePill(lender)} · ${safeText(lender.umraRef)}</p></div>
      <select class="lender-picker" data-action="switch-lender">${LENDERS.map((l) => `<option value="${safeText(l.id)}" ${l.id === lender.id ? "selected" : ""}>${safeText(l.name)}</option>`).join("")}</select>
    </div>
    <div class="grid-4">
      <div class="stat-card"><span class="stat-label">Active borrowers</span><span class="stat-num">${lender.activeBorrowers}</span></div>
      <div class="stat-card"><span class="stat-label">Total disbursed</span><span class="stat-num">${ugx(lender.disbursedTotal)}</span></div>
      <div class="stat-card"><span class="stat-label">Avg. approval</span><span class="stat-num">${lender.avgApprovalHours}<span class="stat-of"> hrs</span></span></div>
      <div class="stat-card"><span class="stat-label">Pending decisions</span><span class="stat-num">${pending}</span></div>
    </div>
    <div class="grid-2">
      <div class="panel"><div class="panel-head-row"><h2>Applications by status</h2></div>${apps.length ? Charts.donut(donutSegs, { centerNum: apps.length, centerSub: "applications" }) : `<div class="empty-state"><h3>${Icon.chart(18)} No applications yet</h3><p>Applications from borrowers will appear here as they submit them through the marketplace.</p></div>`}</div>
      <div class="panel"><div class="panel-head-row"><h2>Applications received, last 6 weeks</h2></div>${Charts.line(buckets)}</div>
    </div>
    <div class="panel">
      <div class="panel-head-row"><h2>Recent applications</h2><button class="btn-link" data-action="nav" data-route="lender-applications">View all →</button></div>
      ${apps.slice(0, 5).map((a) => appRow(a, "lender")).join("") || `<div class="empty-state"><p>No applications have been submitted to ${safeText(lender.name)} yet. They'll appear here once borrowers start applying.</p></div>`}
    </div>`;
  },

  lenderApplications() {
    const lender = Store.currentLender();
    const filter = App.state.lenderAppFilter;
    const all = Store.applicationsByLender(lender.id);
    const apps = filter === "all" ? all : all.filter((a) => a.status === filter);
    const tabs = ["all", "submitted", "approved", "disbursed", "overdue", "repaid", "rejected"];
    return `
    <div class="page-head"><div><h1>Applications</h1><p class="small-note">${lender.name} · ${all.length} total</p></div></div>
    <div class="tab-row">${tabs.map((t) => `<button class="tab-pill ${filter === t ? "tab-active" : ""}" data-action="filter-apps" data-filter="${t}">${t === "all" ? "All" : statusLabel(t)}</button>`).join("")}</div>
    <div class="panel">${apps.length ? apps.map((a) => appRow(a, "lender")).join("") : `<div class="empty-state"><h3>${Icon.filter(18)} No applications${filter !== "all" ? ` with status "${statusLabel(filter)}"` : ""}</h3><p>${filter !== "all" ? "Try selecting a different filter tab, or wait for new applications to come in." : "No applications have been submitted to " + safeText(lender.name) + " yet. Applications appear here as borrowers submit them."}</p></div>`}</div>`;
  },

  lenderProducts() {
    const lender = Store.currentLender();
    const products = Store.productsByLender(lender.id);
    return `
    <div class="page-head"><div><h1>Products</h1><p class="small-note">${lender.name}</p></div></div>
    <div class="panel">
      <div style="display:flex;gap:14px;align-items:flex-start">
        ${brandBadge(lender)}
        <div>
          <h2 style="margin-bottom:2px">${safeText(lender.name)} ${licensePill(lender)}</h2>
          <p class="muted small">${safeText(lender.blurb)}</p>
          <div class="ledger-row"><span>UMRA reference</span><b>${safeText(lender.umraRef)}</b></div>
          <div class="ledger-row"><span>Active borrowers</span><b>${safeText(lender.activeBorrowers)}</b></div>
          <div class="ledger-row"><span>Complaints upheld</span><b>${safeText(lender.complaintsUpheld)}</b></div>
        </div>
      </div>
    </div>
    ${products.map((p) => `
    <div class="panel product-card">
      <div class="panel-head-row"><h2>${safeText(p.name)}</h2><span class="pill pill-license-ok">${safeText(p.category)}</span></div>
      <div class="product-terms">
        <div><span>Principal range</span><b>${ugx(p.principalMin)} – ${ugx(p.principalMax)}</b></div>
        <div><span>APR</span><b>${safeText(p.apr)}%</b></div>
        <div><span>Tenure</span><b>${safeText(p.tenureMinDays)}–${safeText(p.tenureMaxDays)} days</b></div>
        <div><span>Interest model</span><b>${p.interestModel === "flat" ? "Flat" : "Reducing balance"}</b></div>
      </div>
      <p class="small muted">${safeText(p.fees)}</p>
    </div>`).join("")}`;
  },
};

function appRow(a, viewer) {
  const lender = Store.lender(a.lenderId);
  const product = Store.product(a.productId);
  const borrower = Store.borrower(a.borrowerId);
  const who = viewer === "lender" ? borrower.name : lender.name;
  let actions = "";
  if (viewer === "borrower" && ["disbursed", "overdue"].includes(a.status)) {
    actions = `<button class="btn btn-small btn-outline" data-action="repay" data-app="${a.id}">Mark as repaid</button>`;
  }
  if (viewer === "lender" && a.status === "submitted") {
    actions = `<button class="btn btn-small btn-primary" data-action="decide" data-app="${a.id}" data-decision="approved">Approve</button>
      <button class="btn btn-small btn-outline btn-danger" data-action="decide" data-app="${a.id}" data-decision="rejected">Reject</button>`;
  }
  if (viewer === "lender" && a.status === "approved") {
    actions = `<button class="btn btn-small btn-primary" data-action="decide" data-app="${a.id}" data-decision="disbursed">Mark disbursed</button>`;
  }
  if (viewer === "lender" && a.status === "overdue") {
    actions = `<button class="btn btn-small btn-ghost" data-action="remind" data-app="${a.id}">Send reminder</button>`;
  }
  return `
  <div class="app-row">
    <div class="app-row-main">${brandBadge(lender, true)}
      <div><div><b>${safeText(who)}</b> <span class="small-note">· ${safeText(product.name)} · ${safeText(a.channel)}</span></div><div class="small-note">${ugx(a.amount)} · ${timeAgo(a.createdAt)} · ${safeText(a.note)}</div></div>
    </div>
    <div class="app-row-end"><span class="${pillClass(a.status)}">${statusLabel(a.status)}</span>${actions}</div>
  </div>`;
}
