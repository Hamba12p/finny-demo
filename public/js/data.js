// Finny — seed data. Everything here is fictional/mocked for demo purposes,
// but grounded in the real product's domain: UMRA-licensed money lenders,
// Uganda's flat/reducing interest conventions, and the borrower-rights
// content Finny's own knowledge base ships with.

const DISTRICTS = ["Kampala", "Wakiso", "Mukono", "Jinja", "Mbale", "Mbarara", "Gulu", "Lira", "Arua", "Masaka"];

const OCCUPATIONS = ["Boda boda rider", "Market vendor", "Salaried — private sector", "Salaried — civil service", "Small shop owner", "Tailor", "Teacher", "Hairdresser"];

function ugx(n) { return "UGX " + Math.round(n).toLocaleString(); }

const BORROWERS = [
  { id: "you", name: "Nakato Patricia", phone: "0700112233", district: "Kampala", occupation: "Market vendor", monthlyIncome: 420000, altScore: 68, memberSince: "Feb 2026" },
  { id: "b2", name: "Okello Brian", phone: "0752208891", district: "Gulu", occupation: "Boda boda rider", monthlyIncome: 310000, altScore: 54, memberSince: "Nov 2025" },
  { id: "b3", name: "Namuli Sarah", phone: "0781443320", district: "Wakiso", occupation: "Salaried — private sector", monthlyIncome: 950000, altScore: 81, memberSince: "Jun 2025" },
  { id: "b4", name: "Byamukama Ivan", phone: "0774091182", district: "Mbarara", occupation: "Small shop owner", monthlyIncome: 560000, altScore: 62, memberSince: "Sep 2025" },
  { id: "b5", name: "Auma Grace", phone: "0709887761", district: "Lira", occupation: "Tailor", monthlyIncome: 275000, altScore: 47, memberSince: "Jan 2026" },
  { id: "b6", name: "Ssempala Joseph", phone: "0782215567", district: "Masaka", occupation: "Teacher", monthlyIncome: 680000, altScore: 74, memberSince: "Mar 2026" },
];

const LENDERS = [
  {
    id: "apex-finance", name: "Apex Finance", licensed: true, umraRef: "UMRA/TL/0142",
    complaintsUpheld: 0, avgApprovalHours: 6, disbursedTotal: 184300000, activeBorrowers: 412,
    tint: "green", blurb: "Salary-linked digital lender, reducing-balance interest, five years in-market.",
  },
  {
    id: "bridge-credit", name: "Bridge Credit", licensed: true, umraRef: "UMRA/TL/0288",
    complaintsUpheld: 1, avgApprovalHours: 12, disbursedTotal: 96500000, activeBorrowers: 268,
    tint: "navy", blurb: "Short-tenure emergency cash, flat interest, agent network in eight districts.",
  },
  {
    id: "sente-yange", name: "Sente Yange", licensed: true, umraRef: "UMRA/TL/0355",
    complaintsUpheld: 0, avgApprovalHours: 3, disbursedTotal: 61200000, activeBorrowers: 190,
    tint: "gold", blurb: "USSD-first lender built for feature phones — \"your money\", no smartphone required.",
  },
  {
    id: "kasente-direct", name: "Kasente Direct", licensed: true, umraRef: "UMRA/TL/0410",
    complaintsUpheld: 0, avgApprovalHours: 8, disbursedTotal: 43800000, activeBorrowers: 151,
    tint: "green", blurb: "Asset-backed and salary-advance products for formally employed borrowers.",
  },
  {
    id: "mwamba-loans", name: "Mwamba Loans", licensed: false, umraRef: "Licence lapsed Aug 2025",
    complaintsUpheld: 2, avgApprovalHours: 1, disbursedTotal: 28900000, activeBorrowers: 87,
    tint: "red", blurb: "Instant-approval app. Licence not current with UMRA — flagged for review.",
  },
  {
    id: "quickshs-cash", name: "QuickShs Cash", licensed: false, umraRef: "Not found in UMRA register",
    complaintsUpheld: 5, avgApprovalHours: 0.25, disbursedTotal: 9400000, activeBorrowers: 34,
    tint: "red", blurb: "Requests an upfront \"unlocking fee\" before disbursing. Never licensed.",
  },
];

const PRODUCTS = [
  { id: "apex-salary", lenderId: "apex-finance", name: "Salary Advance", category: "Salary advance", principalMin: 100000, principalMax: 1500000, apr: 28, tenureMinDays: 14, tenureMaxDays: 90, interestModel: "reducing", fees: "1.5% processing fee, deducted from disbursement." },
  { id: "apex-business", lenderId: "apex-finance", name: "Business Float", category: "Business float", principalMin: 300000, principalMax: 3000000, apr: 32, tenureMinDays: 30, tenureMaxDays: 180, interestModel: "reducing", fees: "2% processing fee, deducted from disbursement." },
  { id: "bridge-emergency", lenderId: "bridge-credit", name: "Emergency Cash", category: "Emergency cash", principalMin: 50000, principalMax: 800000, apr: 41, tenureMinDays: 7, tenureMaxDays: 45, interestModel: "flat", fees: "UGX 3,000 flat fee, deducted from disbursement." },
  { id: "sente-quickloan", lenderId: "sente-yange", name: "USSD QuickLoan", category: "Emergency cash", principalMin: 20000, principalMax: 500000, apr: 35, tenureMinDays: 7, tenureMaxDays: 60, interestModel: "flat", fees: "No processing fee. Interest only." },
  { id: "kasente-salary", lenderId: "kasente-direct", name: "Payday Advance", category: "Salary advance", principalMin: 150000, principalMax: 2000000, apr: 26, tenureMinDays: 14, tenureMaxDays: 60, interestModel: "reducing", fees: "1% processing fee, deducted from disbursement." },
  { id: "kasente-asset", lenderId: "kasente-direct", name: "Asset Finance", category: "Asset finance", principalMin: 500000, principalMax: 5000000, apr: 24, tenureMinDays: 90, tenureMaxDays: 365, interestModel: "reducing", fees: "2.5% processing fee, deducted from disbursement." },
  { id: "mwamba-instant", lenderId: "mwamba-loans", name: "Instant Cash", category: "Emergency cash", principalMin: 50000, principalMax: 1200000, apr: 63, tenureMinDays: 30, tenureMaxDays: 120, interestModel: "flat", fees: "5% \"insurance fee\" — flagged: legitimate lenders deduct fees, never collect upfront." },
  { id: "quickshs-flash", lenderId: "quickshs-cash", name: "Flash Loan", category: "Emergency cash", principalMin: 30000, principalMax: 400000, apr: 89, tenureMinDays: 7, tenureMaxDays: 30, interestModel: "flat", fees: "UGX 15,000 \"unlocking fee\" requested before payout — this is a known scam pattern." },
];

function daysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString(); }

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return days + " days ago";
  if (days < 60) return Math.floor(days / 7) + (Math.floor(days / 7) === 1 ? " week ago" : " weeks ago");
  return Math.floor(days / 30) + (Math.floor(days / 30) === 1 ? " month ago" : " months ago");
}

function initials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const SEED_APPLICATIONS = [
  { id: "app-1001", borrowerId: "you", lenderId: "apex-finance", productId: "apex-salary", amount: 350000, riskScore: 71, status: "disbursed", channel: "App", createdAt: daysAgo(24), note: "Disbursed to mobile money." },
  { id: "app-1002", borrowerId: "you", lenderId: "sente-yange", productId: "sente-quickloan", amount: 120000, riskScore: 68, status: "repaid", channel: "USSD", createdAt: daysAgo(52), note: "Repaid in full via USSD." },
  { id: "app-1003", borrowerId: "you", lenderId: "bridge-credit", productId: "bridge-emergency", amount: 200000, riskScore: 65, status: "overdue", channel: "App", createdAt: daysAgo(38), note: "6 days past due date." },
  { id: "app-1004", borrowerId: "b2", lenderId: "sente-yange", productId: "sente-quickloan", amount: 80000, riskScore: 52, status: "submitted", channel: "USSD", createdAt: daysAgo(1), note: "Awaiting lender decision." },
  { id: "app-1005", borrowerId: "b3", lenderId: "apex-finance", productId: "apex-salary", amount: 900000, riskScore: 84, status: "approved", channel: "App", createdAt: daysAgo(3), note: "Approved, awaiting disbursement." },
  { id: "app-1006", borrowerId: "b4", lenderId: "kasente-direct", productId: "kasente-asset", amount: 1800000, riskScore: 66, status: "submitted", channel: "App", createdAt: daysAgo(2), note: "Awaiting lender decision." },
  { id: "app-1007", borrowerId: "b5", lenderId: "bridge-credit", productId: "bridge-emergency", amount: 150000, riskScore: 44, status: "rejected", channel: "App", createdAt: daysAgo(9), note: "Below minimum affordability threshold." },
  { id: "app-1008", borrowerId: "b6", lenderId: "apex-finance", productId: "apex-business", amount: 1200000, riskScore: 77, status: "disbursed", channel: "App", createdAt: daysAgo(15), note: "Disbursed to mobile money." },
  { id: "app-1009", borrowerId: "b2", lenderId: "apex-finance", productId: "apex-salary", amount: 250000, riskScore: 58, status: "repaid", channel: "App", createdAt: daysAgo(70), note: "Repaid in full." },
  { id: "app-1010", borrowerId: "b3", lenderId: "kasente-direct", productId: "kasente-salary", amount: 600000, riskScore: 82, status: "disbursed", channel: "App", createdAt: daysAgo(10), note: "Disbursed to mobile money." },
  { id: "app-1011", borrowerId: "b4", lenderId: "sente-yange", productId: "sente-quickloan", amount: 90000, riskScore: 60, status: "submitted", channel: "USSD", createdAt: daysAgo(1), note: "Awaiting lender decision." },
  { id: "app-1012", borrowerId: "b6", lenderId: "kasente-direct", productId: "kasente-salary", amount: 400000, riskScore: 70, status: "overdue", channel: "App", createdAt: daysAgo(45), note: "3 days past due date." },
];

const SEED_FRAUD_REPORTS = [
  { id: "fr-501", type: "upfront_fee", channel: "App", district: "Kampala", summary: "App demanded UGX 20,000 \"activation fee\" via mobile money before releasing an approved loan.", createdAt: daysAgo(6), status: "confirmed-scam" },
  { id: "fr-502", type: "phishing", channel: "SMS", district: "Mukono", summary: "SMS claiming to be Finny asking to confirm PIN to \"unlock\" a loan offer.", createdAt: daysAgo(14), status: "resolved" },
  { id: "fr-503", type: "impersonation", channel: "Call", district: "Jinja", summary: "Caller claimed to be a UMRA officer threatening arrest over an unpaid loan from an app the borrower never used.", createdAt: daysAgo(21), status: "under-review" },
];

const FRAUD_TYPES = [
  { id: "upfront_fee", label: "Asked to pay a fee before receiving the loan" },
  { id: "fake_app", label: "Fake loan app / clone of a known lender" },
  { id: "phishing", label: "Phishing SMS or call asking for PIN / OTP" },
  { id: "impersonation", label: "Caller impersonating UMRA, police or a bank" },
];

const RIGHTS_CONTENT = [
  {
    title: "Every legitimate lender is licensed",
    body: "All licensed money lenders and Tier 4 microfinance institutions must hold a current licence from the Uganda Microfinance Regulatory Authority (UMRA), renewed every calendar year. Finny shows a licence badge and UMRA reference for every lender in the marketplace — check it before you borrow.",
  },
  {
    title: "No lender should ask you to pay first",
    body: "Legitimate lenders deduct processing fees from the amount they disburse. A lender that asks you to pay a fee upfront — an \"activation\", \"insurance\", or \"unlocking\" fee — before releasing money is running a known scam pattern, not a real loan process.",
  },
  {
    title: "You get a real loan agreement, not a sales agreement",
    body: "A lender must give you a proper loan agreement stating the interest rate and all charges in shillings. Being asked to sign a \"sales agreement\" instead is an abusive practice UMRA has flagged directly.",
  },
  {
    title: "Compound interest on licensed loans is illegal",
    body: "Licensed money lenders are prohibited from computing compound interest. Ask for the total repayment amount — principal plus all interest and fees, in shillings, over the full term — before you accept.",
  },
  {
    title: "You can complain, and get a fair hearing",
    body: "You're entitled to a fair, balanced response if you raise a complaint of financial loss, material inconvenience, or distress caused by a lender's action. File with UMRA directly: +256 417 799 700, Rwenzori Towers, Nakasero Road, Kampala.",
  },
];

const HELP_CONTACTS = [
  { label: "Unauthorised mobile money deduction", detail: "Report to your telecom first, then UCC toll-free: 0800 222 777." },
  { label: "Online scams, phishing, fake websites", detail: "Report to NITA-U: www.nita.go.ug." },
  { label: "Criminal fraud or theft", detail: "Police emergency: 112 or 999. Fraud lines: 0800 199 399 / 0800 199 499." },
  { label: "A licensed lender behaving unfairly", detail: "UMRA complaint line: +256 417 799 700." },
  { label: "Lost phone or stolen SIM", detail: "Dial 100 on most networks, then notify UCC." },
];

const GLOSSARY = [
  { term: "APR", def: "The yearly cost of a loan as a percentage, including interest and standard fees. Higher APR = costlier to borrow the same amount for the same time." },
  { term: "Flat interest", def: "Interest calculated on the full original loan amount for the whole term, even as you repay. Usually costs more overall than reducing balance." },
  { term: "Reducing balance", def: "Interest calculated only on what you still owe, so it falls as you repay. Usually cheaper than flat interest at the same stated rate." },
  { term: "Total repayment", def: "The single most important number: principal + all interest + all fees, in shillings, over the full term." },
  { term: "Collateral", def: "Something of value pledged to secure a loan. \"No collateral\" doesn't mean no risk — non-repayment still damages your standing." },
];

// ---------------------------------------------------------------- languages
const LANGUAGES = [
  { code: "en", label: "English", beta: false, fallback: false },
  { code: "lg", label: "Luganda", beta: false, fallback: false },
  { code: "sw", label: "Kiswahili", beta: false, fallback: false },
  { code: "nyn", label: "Runyankore", beta: true, fallback: false },
  { code: "ach", label: "Acholi", beta: true, fallback: true },
  { code: "teo", label: "Ateso", beta: true, fallback: true },
  { code: "kdj", label: "Karimojong", beta: true, fallback: true },
];

// ------------------------------------------------------------- USSD_TREE
// A minimal state machine: menu nodes map digits -> next node id via
// `options`; input nodes collect free text into `vars[input]` via the
// digit-buffer protocol in ussd.js; isAction nodes call UssdEngine._buildAction.
const USSD_TREE = {
  root: {
    text: "Finny *247#\n1. Check a loan offer\n2. Talk to Finny\n3. My applications\n9. Change language\n0. Exit",
    options: { "1": "check_income", "2": "talk_menu", "3": "my_loans", "9": "lang_select", "0": "END" },
  },
  check_income: {
    input: "income", next: "check_amount",
    text: "Enter your monthly income\n(UGX), then press #",
  },
  check_amount: {
    input: "amount", next: "eligibility_result",
    text: "Enter loan amount wanted\n(UGX), then press #",
  },
  eligibility_result: {
    isAction: true, text: "ACTION:eligibility_result",
    options: { "1": "check_amount", "0": "END" },
  },
  my_loans: {
    isAction: true, text: "ACTION:my_loans",
    options: { "9": "root", "0": "END" },
  },
  talk_menu: {
    isAction: true, text: "ACTION:talk_menu",
    options: { "0": "root" },
  },
  repay_select: {
    isAction: true, text: "ACTION:repay_select",
    options: { "9": "root", "0": "END" },
  },
  fraud_category: {
    text: "Select fraud type:\n1. Fake loan app\n2. Asked to pay upfront\n3. Phishing SMS/call\n4. Impersonation\n9. Back  0. Exit",
    options: { "1": "fraud_confirm_1", "2": "fraud_confirm_2", "3": "fraud_confirm_3", "4": "fraud_confirm_4", "9": "root", "0": "END" },
  },
  fraud_confirm_1: { isAction: true, text: "ACTION:fraud_confirm:fake_app", options: { "9": "root", "0": "END" } },
  fraud_confirm_2: { isAction: true, text: "ACTION:fraud_confirm:upfront_fee", options: { "9": "root", "0": "END" } },
  fraud_confirm_3: { isAction: true, text: "ACTION:fraud_confirm:phishing", options: { "9": "root", "0": "END" } },
  fraud_confirm_4: { isAction: true, text: "ACTION:fraud_confirm:impersonation", options: { "9": "root", "0": "END" } },
  rights_info: {
    text: "Know your rights:\n- Lenders must be UMRA-\n  licensed & renewed yearly\n- Never pay a fee BEFORE\n  a loan is released\n- No compound interest on\n  licensed loans\n- Report unfair treatment\n  to UMRA: 0417 799 700\n\n9. Back  0. Exit",
    options: { "9": "root", "0": "END" },
  },
  lang_select: {
    text: "Choose your language:\n1. English\n2. Luganda\n3. Kiswahili\n4. Runyankore\n5. Acholi (beta)\n6. Ateso (beta)\n7. Karimojong (beta)\n0. Exit",
    options: { "1": "lang_set_en", "2": "lang_set_lg", "3": "lang_set_sw", "4": "lang_set_nyn", "5": "lang_set_ach", "6": "lang_set_teo", "7": "lang_set_kdj", "0": "END" },
  },
};
LANGUAGES.forEach((l) => {
  USSD_TREE["lang_set_" + l.code] = { isAction: true, text: "ACTION:lang_set:" + l.code, options: { "9": "root", "0": "END" } };
});
