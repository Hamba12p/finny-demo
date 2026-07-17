// Finny — app shell: router, header/nav, and one delegated event listener.
// Views are pure templates; this file is the only place that mutates
// route/UI state and re-renders.

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseSafeInteger(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const n = Number.parseInt(String(value).trim(), 10);
  return Number.isFinite(n) ? n : fallback;
}

function sanitizeAmount(value, fallback = 0) {
  const parsed = parseSafeInteger(value, fallback);
  return parsed < 0 ? 0 : parsed;
}

const ROUTES = {
  "landing": { render: () => Views.landing(), role: null },
  "borrower-dashboard": { render: () => Views.borrowerDashboard(), role: "borrower" },
  "marketplace": { render: () => Views.marketplace(), role: "borrower" },
  "applications": { render: () => Views.applications(), role: "borrower" },
  "fraud": { render: () => Views.fraudCentre(), role: "borrower" },
  "rights": { render: () => Views.rights(), role: "borrower" },
  "assistant": { render: () => Views.assistant(), role: "borrower" },
  "lender-dashboard": { render: () => Views.lenderDashboard(), role: "lender" },
  "lender-applications": { render: () => Views.lenderApplications(), role: "lender" },
  "lender-products": { render: () => Views.lenderProducts(), role: "lender" },
  "ussd": { render: () => UssdViews.page(), role: null },
};

const BORROWER_NAV = [
  ["borrower-dashboard", "Dashboard"], ["marketplace", "Marketplace"], ["applications", "My applications"],
  ["fraud", "Fraud centre"], ["rights", "Know your rights"], ["assistant", "Assistant"], ["ussd", "USSD demo"],
];
const LENDER_NAV = [
  ["lender-dashboard", "Dashboard"], ["lender-applications", "Applications"], ["lender-products", "Products"], ["ussd", "USSD demo"],
];

const App = {
  state: { route: "landing", lenderAppFilter: "all" },

  init() {
    Store.init();
    if (Store.state.role === "borrower") this.state.route = "borrower-dashboard";
    else if (Store.state.role === "lender") this.state.route = "lender-dashboard";
    this.render();
    this._bindEvents();
  },

  navigate(route) {
    this.state.route = route;
    this._transitionMain();
    try {
      this.render();
      if (window.scrollTo) window.scrollTo({ top: 0, behavior: "instant" });
    } catch (error) {
      console.error(error);
      this.renderError(error);
    }
  },

  render() {
    document.body.dataset.role = Store.state.role || "guest";
    document.getElementById("app-header").innerHTML = this._header();
    const r = ROUTES[this.state.route] || ROUTES.landing;
    document.getElementById("app-main").innerHTML = r.render();
    document.getElementById("app-main").classList.remove("app-main-transitioning");
    if (this.state.route === "assistant") {
      const log = document.getElementById("chat-log");
      if (log) log.scrollTop = log.scrollHeight;
    }
  },

  renderError(error) {
    const main = document.getElementById("app-main");
    if (!main) return;
    main.innerHTML = `
      <div class="empty-state">
        <h3>We hit a rendering issue</h3>
        <p>${escapeHtml(String(error && error.message ? error.message : error))}</p>
        <button class="btn btn-primary" data-action="nav" data-route="borrower-dashboard">Return to the dashboard</button>
      </div>`;
  },

  renderLoading(message = "Preparing the next view…") {
    const main = document.getElementById("app-main");
    if (!main) return;
    main.innerHTML = `
      <div class="loading-surface">
        <div class="loading-line tall"></div>
        <div class="loading-line medium"></div>
        <div class="loading-line short"></div>
        <p class="small-note">${escapeHtml(message)}</p>
      </div>`;
  },

  _transitionMain() {
    const main = document.getElementById("app-main");
    if (!main) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    main.classList.add("app-main-transitioning");
    window.setTimeout(() => main.classList.remove("app-main-transitioning"), 180);
  },

  _header() {
    const role = Store.state.role;
    const nav = role === "lender" ? LENDER_NAV : role === "borrower" ? BORROWER_NAV : [];
    return `
    <div class="header-top">
      <button class="wordmark" data-action="nav" data-route="${role === "lender" ? "lender-dashboard" : role === "borrower" ? "borrower-dashboard" : "landing"}">
        <span class="wordmark-mark">${Icon.key(18)}</span>Finny
      </button>
      ${role ? `
      <div class="role-toggle" role="tablist" aria-label="Select a role">
        <button class="role-tab ${role === "borrower" ? "role-tab-active" : ""}" data-action="switch-role" data-role="borrower">Borrower</button>
        <button class="role-tab ${role === "lender" ? "role-tab-active" : ""}" data-action="switch-role" data-role="lender">Lender</button>
      </div>` : ""}
      <button class="btn-link header-reset" data-action="reset-demo">Reset demo data</button>
    </div>
    ${nav.length ? `<nav class="app-nav">${nav.map(([route, label]) => `<button class="nav-item ${this.state.route === route ? "nav-active" : ""}" data-action="nav" data-route="${route}">${label}</button>`).join("")}</nav>` : ""}`;
  },

  toast(msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("toast-show"));
    setTimeout(() => { el.classList.remove("toast-show"); setTimeout(() => el.remove(), 300); }, 2600);
  },

  _bindEvents() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-action]");
      if (!t) return;
      const action = t.dataset.action;

      if (action === "nav") this.navigate(t.dataset.route);

      if (action === "ask-suggestion") {
        const input = document.querySelector('.chat-form input[name="q"]');
        if (input) {
          input.value = t.dataset.q || "";
          input.focus();
        }
      }

      if (action === "enter-role") {
        Store.setRole(t.dataset.role);
        this.navigate(t.dataset.role === "lender" ? "lender-dashboard" : "borrower-dashboard");
      }

      if (action === "switch-role") {
        Store.setRole(t.dataset.role);
        this.navigate(t.dataset.role === "lender" ? "lender-dashboard" : "borrower-dashboard");
      }

      if (action === "set-profile") {
        Store.setBorrowerProfile(t.value);
        this.render();
      }

      if (action === "reset-demo") {
        if (confirm("Reset all demo data back to the seed state? This clears applications, fraud reports and USSD session logs you've created.")) {
          Store.reset();
          UssdEngine.session = null;
          this.state.route = "landing";
          this.render();
          this.toast("Demo data reset.");
        }
      }

      if (action === "apply") {
        const product = Store.product(t.dataset.product);
        const lender = Store.lender(product.lenderId);
        const borrower = Store.currentBorrower();
        const amountInput = document.querySelector('input[name="amount"]');
        const amount = sanitizeAmount(amountInput ? amountInput.value : null, Math.round((product.principalMin + product.principalMax) / 2));
        const risk = Math.max(20, Math.min(95, borrower.altScore + Math.round((Math.random() - 0.5) * 10)));
        this.renderLoading(`Submitting to ${escapeHtml(lender.name)}…`);
        window.setTimeout(() => {
          Store.addApplication({ borrowerId: borrower.id, lenderId: lender.id, productId: product.id, amount, riskScore: risk, channel: "App" });
          this.toast(`Application sent to ${lender.name}.`);
          this.navigate("applications");
        }, 260);
      }

      if (action === "repay") {
        Store.updateApplication(t.dataset.app, { status: "repaid", note: "Repaid in-app." });
        this.toast("Marked as repaid.");
        this.render();
      }

      if (action === "decide") {
        Store.updateApplication(t.dataset.app, {
          status: t.dataset.decision,
          note: t.dataset.decision === "approved" ? "Approved by lender." : "Rejected by lender.",
        });
        this.toast(`Application ${t.dataset.decision}.`);
        this.render();
      }

      if (action === "filter-apps") {
        this.state.lenderAppFilter = t.dataset.filter;
        this.render();
      }

      if (action === "ussd-dial") {
        UssdEngine.start(Store.currentBorrower().phone);
        this.render();
      }
      if (action === "ussd-key") {
        UssdEngine.press(t.dataset.key);
        this.render();
      }
      if (action === "ussd-reset") {
        UssdEngine.session = null;
        this.render();
      }
    });

    document.addEventListener("change", (e) => {
      const t = e.target.closest("[data-action]");
      if (!t) return;
      if (t.dataset.action === "switch-lender") {
        Store.state.currentLenderId = t.value;
        Store.save();
        this.render();
      }
      if (t.dataset.action === "set-profile") {
        Store.setBorrowerProfile(t.value);
        this.render();
      }
    });

    document.addEventListener("submit", (e) => {
      const form = e.target.closest("[data-form]");
      if (!form) return;
      e.preventDefault();
      const kind = form.dataset.form;

      if (kind === "marketplace-amount") {
        const rawAmount = sanitizeAmount(new FormData(form).get("amount"), 300000);
        const amount = rawAmount > 0 ? rawAmount : 0;
        const results = document.getElementById("marketplace-results");
        if (results) {
          results.innerHTML = Views.marketplaceSkeleton(amount);
          window.setTimeout(() => {
            results.innerHTML = Views._marketplaceResults(Store.currentBorrower(), amount);
          }, 260);
        }
      }

      if (kind === "fraud-report") {
        const fd = new FormData(form);
        Store.addFraudReport({
          type: fd.get("type"), channel: fd.get("channel"),
          district: Store.currentBorrower().district,
          summary: fd.get("summary") || "No further detail provided.",
        });
        this.toast("Report submitted — thank you.");
        this.render();
      }

      if (kind === "chat") {
        const fd = new FormData(form);
        const q = (fd.get("q") || "").trim();
        if (!q) return;
        Store.state.chatHistory.push({ from: "user", text: q });
        Store.state.chatHistory.push({ from: "bot", text: Assistant.reply(q) });
        Store.save();
        this.render();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (this.state.route === "ussd" && UssdEngine.session && UssdEngine.session.mode !== "END") {
        if (/^[0-9*#]$/.test(e.key)) { UssdEngine.press(e.key); this.render(); }
      }
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
  window.setInterval(() => {
    if (App.state.route === "ussd" && UssdEngine.session && UssdEngine.session.mode !== "END") {
      App.render();
    }
  }, 1000);
});
