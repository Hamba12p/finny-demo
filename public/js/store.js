// Finny — Store. Single source of truth for demo state. Seed data is
// cloned into localStorage on first load so judges can freely mutate the
// app (apply, decide, repay, report fraud) and reset back to a clean seed
// at any point without a page reload.

const STORAGE_KEY = "finny_demo_v1";

function seedState() {
  return {
    role: null,
    currentLenderId: LENDERS[0].id,
    borrowerProfile: "first_time_low_income",
    applications: JSON.parse(JSON.stringify(SEED_APPLICATIONS)),
    fraudReports: JSON.parse(JSON.stringify(SEED_FRAUD_REPORTS)),
    ussdLog: [],
    chatHistory: [
      { from: "bot", text: "Hi, I'm the Finny assistant. Ask me about loan terms, spotting a risky lender, or your rights as a borrower." },
    ],
  };
}

const Store = {
  state: null,

  init() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { saved = null; }
    this.state = saved && saved.applications ? saved : seedState();
    this.save();
  },

  save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); } catch (e) { /* storage unavailable — demo still runs in-memory */ }
  },

  reset() {
    this.state = seedState();
    this.save();
  },

  setRole(role) {
    this.state.role = role;
    this.save();
  },

  setBorrowerProfile(profile) {
    this.state.borrowerProfile = profile;
    this.save();
  },

  // -------------------------------------------------------------- lookups
  currentBorrower() { return BORROWERS.find((b) => b.id === "you"); },
  borrower(id) { return BORROWERS.find((b) => b.id === id); },
  lender(id) { return LENDERS.find((l) => l.id === id); },
  currentLender() { return this.lender(this.state.currentLenderId); },
  currentProfile() { return this.state.borrowerProfile || "first_time_low_income"; },
  product(id) { return PRODUCTS.find((p) => p.id === id); },
  productsByLender(lenderId) { return PRODUCTS.filter((p) => p.lenderId === lenderId); },

  // ---------------------------------------------------------- applications
  applicationsByBorrower(id) {
    return this.state.applications.filter((a) => a.borrowerId === id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  applicationsByLender(id) {
    return this.state.applications.filter((a) => a.lenderId === id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  addApplication(fields) {
    const app = Object.assign({
      id: "app-" + Date.now().toString().slice(-6),
      status: "submitted",
      createdAt: new Date().toISOString(),
      note: "Awaiting lender decision.",
    }, fields);
    this.state.applications.unshift(app);
    this.save();
    return app;
  },
  updateApplication(id, fields) {
    const app = this.state.applications.find((a) => a.id === id);
    if (!app) return null;
    Object.assign(app, fields);
    this.save();
    return app;
  },

  // ------------------------------------------------------------ fraud log
  addFraudReport(fields) {
    const report = Object.assign({
      id: "fr-" + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString(),
      status: "under-review",
    }, fields);
    this.state.fraudReports.unshift(report);
    this.save();
    return report;
  },

  // -------------------------------------------------------------- ussd log
  logUssd(entry) {
    this.state.ussdLog.unshift(Object.assign({ ts: new Date().toISOString() }, entry));
    if (this.state.ussdLog.length > 60) this.state.ussdLog.length = 60;
    this.save();
  },
};
