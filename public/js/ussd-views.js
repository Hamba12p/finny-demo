// Finny — USSD demo page. Phone shell renders identically on any device
// (that's the point: the channel reaches feature phones, but the demo of
// it should work on the judge's own phone or laptop). The raw session
// terminal is desktop-only — it's the integration view, not the end-user
// experience, and style.css hides it under 880px.

const UssdViews = {
  page() {
    const s = UssdEngine.session;
    return `
    <div class="page-head"><div><h1>USSD demo — *247#</h1><p class="small-note">The same eligibility check, loan list, repayment and fraud-reporting flow as the app — reachable from any phone, no data connection needed.</p></div></div>
    <p class="ussd-mobile-note muted">The raw session terminal (right, on desktop) is the integration view for engineers — hidden here since it's not part of the end-user experience.</p>
    <div class="ussd-layout">
      <div>${this._phone(s)}</div>
      <div class="terminal">${this._terminal(s)}</div>
    </div>`;
  },

  _phone(s) {
    const idleText = "Type *185*44# and press\nthe green call key to begin.\n\n" + Store.currentBorrower().phone;
    return `
    <div class="phone-shell">
      <div class="phone-speaker"></div>
      <div class="phone-screen ${s ? "" : "phone-screen-idle"}">
        <div class="phone-screen-head"><span>MTN UG</span><span>${s ? "*247#" : "— — —"}</span></div>
        <p class="phone-screen-body">${s ? this._escape(s.screen) + (s.invalid ? "\n\n⚠ Invalid option" : "") : idleText}</p>
      </div>
      ${!s || s.mode === "END" ? `<button class="btn btn-primary phone-dial-btn" data-action="ussd-dial">${Icon.phone(14)} ${s ? "Dial *247# again" : "Dial *247#"}</button>` : ""}
      ${s && s.mode !== "END" ? `<div class="phone-session-meta"><span>Session cost: UGX ${s.sessionCost || 0}</span><span>${s.sessionSeconds || 0}s</span></div>` : ""}
      ${s && s.mode !== "END" ? this._keypad() : ""}
      ${s && s.mode !== "END" ? `<button class="btn-link" style="display:block;margin:10px auto 0;color:#cfe0d6" data-action="ussd-reset">End session</button>` : ""}
    </div>`;
  },

  _keypad() {
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
    return `<div class="keypad">${keys.map((k) => `<button class="key" data-action="ussd-key" data-key="${k}">${k}</button>`).join("")}</div>`;
  },

  _terminal(s) {
    const log = Store.state.ussdLog.slice(0, 12);
    const trace = s && Array.isArray(s.trace) ? s.trace.slice(-8) : [];
    const reqJson = s ? {
      sessionId: s.id, phoneNumber: s.phone, serviceCode: "*247#",
      text: Object.entries(s.vars).map(([k, v]) => k + "=" + v).join("&") || "(session start)",
    } : null;
    const respType = s ? s.mode : null;
    return `
    <div class="terminal-head">${Icon.phone(14)} Africa's Talking-shaped webhook ${s ? `· <span class="term-type-${respType}">${respType}</span>` : "· idle"}</div>
    <div class="terminal-body">
      <div class="terminal-json">
        <div class="terminal-label">Request</div>
        <pre>${s ? this._escape(JSON.stringify(reqJson, null, 2)) : "No session yet — dial\n*247# on the phone."}</pre>
        <div class="terminal-label" style="margin-top:12px">Response</div>
        <pre>${s ? this._escape(respType + " " + s.screen) : "—"}</pre>
      </div>
      <div class="terminal-log">
        <div class="terminal-label">Session log</div>
        <table class="terminal-table">
          <thead><tr><th>Dir</th><th>Input</th><th>Node</th><th>Type</th></tr></thead>
          <tbody>${log.map((l) => `<tr><td>${l.dir}</td><td>${this._escape(l.text)}</td><td>${l.nodeId}</td><td class="term-type-${l.type}">${l.type}</td></tr>`).join("") || `<tr><td colspan="4" class="muted">No activity yet.</td></tr>`}</tbody>
        </table>
        <div class="terminal-label" style="margin-top:12px">Trace</div>
        <div class="terminal-trace">${trace.length ? trace.map((entry) => `<div class="trace-line ${entry.kind}">${this._escape(entry.text)}</div>`).join("") : '<div class="trace-empty">No trace yet.</div>'}</div>
      </div>
    </div>`;
  },

  _escape(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  },
};
