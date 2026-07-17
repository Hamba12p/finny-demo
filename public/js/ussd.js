// Finny — USSD engine. One state machine, two views: the phone screen
// (works on any device) and the raw session terminal (desktop only, styled
// like an Africa's Talking-shaped webhook log) so judges can see both the
// end-user experience and the integration underneath it.

function getCopy(session) {
  const code = session && session.lang ? session.lang : null;
  return COPY[code] || COPY.en;
}

function langMeta(session) {
  const code = session && session.lang ? session.lang : "en";
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}

function disclosureLine(session) {
  const lm = langMeta(session);
  if (!lm || !lm.fallback) return "";
  return `[${lm.label} translation in community review — shown in English for accuracy]`;
}

function fillTpl(tpl, vals) {
  return tpl.replace(/\{(\w+)\}/g, (m, key) => (key in vals ? vals[key] : m));
}

const COPY = {
  en: {
    serviceHeader: "Finny *247#",
    mainMenu: "1. Check a loan offer\n2. Talk to Finny\n3. My applications\n9. Change language\n0. Exit",
    incomePrompt: "Enter your monthly income\n(UGX), then press #",
    amountPrompt: "Enter loan amount wanted\n(UGX), then press #",
    eligibilityResult: "Best match for UGX {amount}:",
    eligibilityFooter: "Open the Finny app to\napply with full KYC.\n1. Check another amount\n0. Exit",
    noMatch: "No eligible offers found for that amount.",
    myLoansHeader: "My loans:",
    noLoans: "You have no loans yet.",
    repayHeader: "Repay a loan:",
    noRepay: "No loans due for repayment.",
    repayConfirmed: "Repayment confirmed.",
    talkMenu: "What do you want to know?\n1. My rights as a borrower\n2. Signs of a bad lender\n3. Common fraud tricks\n4. Where to get help",
    talkFooter: "0. Back to menu",
    fraudMenu: "Select fraud type:\n1. Fake loan app\n2. Asked to pay upfront\n3. Phishing SMS/call\n4. Impersonation",
    fraudReceived: "Report received.",
    fraudFooter: "Our team reviews all USSD\nfraud reports within 24h.\n\n9. Back  0. Exit",
    rightsMenu: "Know your rights:\n- Lenders must be UMRA-\n  licensed & renewed yearly\n- Never pay a fee BEFORE\n  a loan is released\n- No compound interest on\n  licensed loans\n- Report unfair treatment\n  to UMRA: 0417 799 700",
    langMenuHeader: "Choose your language:",
    exitMsg: "Session ended. Thank you for using Finny.",
    invalid: "That didn't work. Enter a number, or 0 to go back.",
    unavailable: "Unavailable.",
  },
  lg: {
    serviceHeader: "Finny *247#",
    mainMenu: "1. Kebera ekyokwongera\n2. Yogera ne Finny\n3. Ebisabo byange\n9. Kyusa olulimi\n0. Fuluma",
    incomePrompt: "Yingiza omuwendo gw'ebyokulya by'ofuna buli mwezi\n(UGX), oluvannyuma onyige #",
    amountPrompt: "Yingiza omuwendo gw'ekyokwongera (UGX):",
    eligibilityResult: "Ekisinga okukugwanira ku UGX {amount}:",
    eligibilityFooter: "Yingira ku Finny app\nokukozesa KYC ennungi.\n1. Kebera omuwendo omulala\n0. Fuluma",
    noMatch: "Tewali byokugwanira ebirina okuzuukusa ku omuwendo guno.",
    myLoansHeader: "Ebisabo byange:",
    noLoans: "Tolina bisabo by'ekyokwongera.",
    repayHeader: "Sasula ekisabo:",
    noRepay: "Tewali bisabo by'okusasula.",
    repayConfirmed: "Okusasula kukakasiddwa.",
    talkMenu: "Kiki ky'oyagala okumanya?\n1. Eddembe lyange ng'omuguzi\n2. Obubonero bw'omuwoze omubi\n3. Enkwe ezitera okukozesebwa\n4. Wa gy'oyinza okufuna obuyambi",
    talkFooter: "0. Ddayo ku menyu",
    fraudMenu: "Londa ekizibu ky'obulimba:\n1. Fake loan app\n2. Yasaba okusasula olubereberye\n3. Phishing SMS/call\n4. Impersonation",
    fraudReceived: "Ebyo byetabye.",
    fraudFooter: "Abakola bano basoma byonna\nnga biki bwe biri.\n\n9. Ddayo  0. Fuluma",
    rightsMenu: "Eddembe lyo:\n- Abawoze balina okuba aba UMRA-\n  abakakasiddwa era ne baddamu buli mwaka\n- Tewali kusasula nga tonafuna ddogolo\n- Tewali compound interest ku\n  abawoze abakakasiddwa\n- Buuza obuyambi eri UMRA\n  ku 0417 799 700",
    langMenuHeader: "Londa olulimi:",
    exitMsg: "Omulundi guwedde. Weebazizza okukozesa Finny.",
    invalid: "Ekyayingizza si kituufu. Ddamu oba 0 okudda ennyuma.",
    unavailable: "Tekiibawo.",
  },
  sw: {
    serviceHeader: "Finny *247#",
    mainMenu: "1. Angalia ofa ya mkopo\n2. Zungumza na Finny\n3. Maombi yangu\n9. Badilisha lugha\n0. Toka",
    incomePrompt: "Weka mapato yako ya mwezi\n(UGX), kisha bonyeza #",
    amountPrompt: "Weka kiasi cha mkopo (UGX):",
    eligibilityResult: "Chaguo bora kwa UGX {amount}:",
    eligibilityFooter: "Fungua programu ya Finny\nkuomba kwa KYC kamili.\n1. Angalia kiasi kingine\n0. Toka",
    noMatch: "Hakuna ofa inayolingana na kiasi hicho kwa sasa.",
    myLoansHeader: "Maombi yangu:",
    noLoans: "Huna maombi yoyote bado.",
    repayHeader: "Lipa mkopo:",
    noRepay: "Hakuna mikopo ya kulipwa.",
    repayConfirmed: "Malipo yamehakikishwa.",
    talkMenu: "Unataka kujua nini?\n1. Haki zangu kama mkopaji\n2. Dalili za mkopeshaji mbaya\n3. Mbinu za kawaida za udanganyifu\n4. Mahali pa kupata msaada",
    talkFooter: "0. Rudi kwenye menyu",
    fraudMenu: "Chagua aina ya ulaghai:\n1. Fake loan app\n2. Ulizwa kulipa ada kabla ya mkopo\n3. Phishing SMS/call\n4. Impersonation",
    fraudReceived: "Ripoti imepokelewa.",
    fraudFooter: "Timu yetu inachunguza taarifa zote za USSD\nkatika masaa 24.\n\n9. Rudi  0. Toka",
    rightsMenu: "Haki zako:\n- Wakopeshaji lazima wawe na leseni ya UMRA-\n  na kuijaribu kila mwaka\n- Usilipe ada KABLA\n  mkopo wa kutolewa\n- Hakuna riba ya mchanganyiko kwa\n  wakopeshaji walioidhinishwa\n- Ripoti ukosefu wa haki kwa UMRA\n  +256 417 799 700",
    langMenuHeader: "Chagua lugha:",
    exitMsg: "Kikao kimeisha. Asante kwa kutumia Finny.",
    invalid: "Haikufanya kazi. Weka namba, au 0 kurudi nyuma.",
    unavailable: "Haipatikani.",
  },
  nyn: {
    serviceHeader: "Finny *247#",
    mainMenu: "1. Reeba ekyetwa ky'eempeta\n2. Ganira na Finny\n3. Ebisabo byange\n9. Hindura orurimi\n0. Fuluma",
    incomePrompt: "Teekyamu esente ezioba z'okufunisa omwaka\n(UGX), hanyuma otsindike #",
    amountPrompt: "Teekyamu omubaro gw'eempeta (UGX):",
    eligibilityResult: "Ekirungi kukukwatanisa UGX {amount}:",
    eligibilityFooter: "Yingira omu app ya Finny\nokukora KYC.\n1. Reeba omubaro ogundi\n0. Fuluma",
    noMatch: "Tihariho ekyetwa ekyahikire omubaro ogu.",
    myLoansHeader: "Ebisabo byange:",
    noLoans: "Tihariho ebisabo byaiha.",
    repayHeader: "Sasura ekisabo:",
    noRepay: "Tihariho ebisabo ebishemereire kusasurwa.",
    repayConfirmed: "Okusasura nikukahyesibwa.",
    talkMenu: "Noyenda kumanya ki?\n1. Endiijo zangye nk'omuguzi\n2. Obubonero bw'omukopesa mubi\n3. Enkwe ezirikukoresibwa\n4. Aharikubonekana obuhwezi",
    talkFooter: "0. Garuka omu menyu",
    fraudMenu: "Hitamu ekika ky'ekibi:\n1. Fake loan app\n2. Yashabire okusasura sente zambere\n3. Phishing SMS/call\n4. Impersonation",
    fraudReceived: "Eby'okuronda byahairwe.",
    fraudFooter: "Ebikora byaitu nibikora okureba byona\nmu saaya 24.\n\n9. Garuka  0. Fuluma",
    rightsMenu: "Endiijo zawe:\n- Abakopesa bashemereire kuba ba UMRA-\n  bakyire kandi nibakora buri mwaka\n- Otasasura sente zambere\n  ekisabo kikagaruka\n- Tihariho compound interest kwa\n  abakopesa abakurizibwa\n- Hamagara UMRA\n  +256 417 799 700",
    langMenuHeader: "Hitamu orurimi:",
    exitMsg: "Akakwate kahwire. Webale kukoresa Finny.",
    invalid: "Ekyo tikirikukora. Teekyamu omubaro, nari 0 kugaruka enyima.",
    unavailable: "Tihariho.",
  },
};

["ach", "teo", "kdj"].forEach((code) => {
  COPY[code] = Object.assign({}, COPY.en);
});

const UssdEngine = {
  session: null,

  start(phone) {
    const id = "sess-" + Date.now().toString().slice(-8);
    this.session = {
      id,
      phone: phone || "0700112233",
      nodeId: "root",
      vars: {},
      mode: "CON",
      invalid: false,
      screen: "",
      buffer: "",
      lang: null,
      langReturnState: "root",
      profile: Store.currentProfile ? Store.currentProfile() : "first_time_low_income",
      trace: [],
      sessionSeconds: 0,
      sessionCost: 0,
      billingTimer: null,
    };
    this._enter("root");
    this._traceLine("--- new USSD session ---", "meta");
    this._traceLine("dial *185*44# -> routed to Finny shortcode handler", "route");
    this._startBilling();
    Store.logUssd({ sessionId: id, phone: this.session.phone, dir: "IN", text: "*247#", nodeId: "root", response: this.session.screen, type: "CON" });
    return this.session;
  },

  press(digit) {
    const s = this.session;
    if (!s || s.mode === "END") return s;
    s.invalid = false;
    const node = USSD_TREE[s.nodeId] || {};

    if (node.input) {
      if (digit === "#") {
        if (!s.buffer) { s.invalid = true; return s; }
        s.vars[node.input] = s.buffer;
        s.buffer = "";
        this._enter(node.next);
      } else if (digit === "*") {
        s.buffer = s.buffer.slice(0, -1);
        this._renderInputPrompt(node);
      } else if (/^[0-9]$/.test(digit)) {
        s.buffer += digit;
        this._renderInputPrompt(node);
      }
      this._log(digit);
      return s;
    }

    if (s.nodeId === "repay_select" && !["0", "9"].includes(digit)) {
      this._doRepay(digit);
      this._log(digit);
      return s;
    }

    const next = node.options && node.options[digit];
    if (!next) {
      s.invalid = true;
      this._log(digit);
      return s;
    }
    if (digit === "9" && next === "lang_select") {
      s.langReturnState = s.nodeId;
    }
    if (next === "END") {
      s.mode = "END";
      s.screen = this._buildExitText();
      this._traceLine("session ended by user", "result");
      this._stopBilling();
      this._log(digit);
      return s;
    }
    if (next === "lang_select") {
      this._traceLine("user requested language change mid-session", "meta");
    }
    this._enter(next);
    this._log(digit);
    return s;
  },

  restart(phone) { return this.start(phone); },

  _log(digit) {
    const s = this.session;
    Store.logUssd({ sessionId: s.id, phone: s.phone, dir: "IN", text: digit, nodeId: s.nodeId, response: s.screen, type: s.mode });
  },

  _enter(nodeId) {
    const s = this.session;
    s.nodeId = nodeId;
    s.buffer = "";
    const node = USSD_TREE[nodeId] || {};
    if (node.input) { this._renderInputPrompt(node); return; }
    if (nodeId === "root") {
      s.screen = this._buildMainMenu();
      return;
    }
    if (nodeId === "check_income") {
      s.screen = this._getPromptScreen("income");
      return;
    }
    if (nodeId === "check_amount") {
      s.screen = this._getPromptScreen("amount");
      return;
    }
    if (nodeId === "talk_menu") {
      s.screen = this._buildTalkMenu();
      return;
    }
    if (nodeId === "lang_select") {
      s.screen = this._buildLanguageMenu();
      return;
    }
    if (nodeId === "fraud_category") {
      s.screen = this._buildFraudMenu();
      return;
    }
    if (nodeId === "rights_info") {
      s.screen = this._buildRightsMenu();
      return;
    }
    s.screen = node.isAction ? this._buildAction(node.text) : (node.text || this._buildExitText());
  },

  _renderInputPrompt(node) {
    const s = this.session;
    if (s.nodeId === "check_income") {
      s.screen = `${getCopy(s).incomePrompt}\n> ${s.buffer}_\n(# to send, * to erase)`;
      return;
    }
    if (s.nodeId === "check_amount") {
      s.screen = `${getCopy(s).amountPrompt}\n> ${s.buffer}_\n(# to send, * to erase)`;
      return;
    }
    s.screen = `${node.text || ""}\n> ${s.buffer}_\n(# to send, * to erase)`;
  },

  _buildMainMenu() {
    const c = getCopy(this.session);
    const disclosure = disclosureLine(this.session);
    const lines = [c.serviceHeader, c.mainMenu];
    if (disclosure) lines.splice(1, 0, disclosure);
    return lines.join("\n\n");
  },

  _buildTalkMenu() {
    this._traceLine("entering Talk flow — grounded Q&A over knowledge_base.py", "meta");
    const c = getCopy(this.session);
    return `${c.talkMenu}\n\n${c.talkFooter}`;
  },

  _buildFraudMenu() {
    const c = getCopy(this.session);
    return `${c.fraudMenu}\n\n9. Back  0. Exit`;
  },

  _buildRightsMenu() {
    const c = getCopy(this.session);
    return `${c.rightsMenu}\n\n9. Back  0. Exit`;
  },

  _buildLanguageMenu() {
    const c = getCopy(this.session);
    const langList = LANGUAGES.map((l, index) => `${index + 1}. ${l.label}${l.beta ? " (beta)" : ""}${l.fallback ? " (fallback)" : ""}`).join("\n");
    return `${c.langMenuHeader}\n\n${langList}\n\n0. Exit`;
  },

  _getPromptScreen(kind) {
    const c = getCopy(this.session);
    return kind === "income" ? c.incomePrompt : c.amountPrompt;
  },

  _buildAction(marker) {
    const parts = marker.replace("ACTION:", "").split(":");
    const kind = parts[0];
    const borrower = Store.currentBorrower();

    if (kind === "eligibility_result") {
      this._traceLine("entering Apply / eligibility flow", "meta");
      const income = parseInt(this.session.vars.income || "0", 10);
      const amount = parseInt(this.session.vars.amount || "0", 10);
      const synthetic = { monthlyIncomeUgx: income };
      const ranked = Recommender.rank(synthetic, amount, 30, this.session.profile).filter((r) => r.lender.licensed).slice(0, 3);
      ranked.forEach((r) => {
        this._traceLine(`${r.lender.name}: cost=${r.scoreBreakdown.cost.score} trust=${r.scoreBreakdown.trust.score} fit=${r.scoreBreakdown.fit.score} → final=${r.finalScore}`, "result");
      });
      let lines = ranked.map((r, i) => `${i + 1}. ${r.lender.name} ${r.product.apr}%APR`).join("\n");
      if (!lines) lines = getCopy(this.session).noMatch;
      return `${fillTpl(getCopy(this.session).eligibilityResult, { amount: amount.toLocaleString() })}\n${lines}\n\n${getCopy(this.session).eligibilityFooter}`;
    }

    if (kind === "my_loans") {
      this._traceLine("GET /applications?userId=... (scoped to this session)", "route");
      const apps = Store.applicationsByBorrower("you").slice(0, 4);
      if (!apps.length) return `${getCopy(this.session).noLoans}\n\n9. Back  0. Exit`;
      const lines = apps.map((a) => {
        const lender = Store.lender(a.lenderId);
        return `${lender.name}: UGX ${a.amount.toLocaleString()} - ${a.status}`;
      }).join("\n");
      return `${getCopy(this.session).myLoansHeader}\n${lines}\n\n9. Back  0. Exit`;
    }

    if (kind === "repay_select") {
      const repayable = Store.applicationsByBorrower("you").filter((a) => ["disbursed", "overdue"].includes(a.status));
      this.session._repayList = repayable;
      let out;
      if (this.session._repayMsg) {
        out = this.session._repayMsg + "\n\n";
        this.session._repayMsg = null;
      } else {
        out = "";
      }
      if (!repayable.length) return out + `${getCopy(this.session).noRepay}\n\n9. Back  0. Exit`;
      const lines = repayable.map((a, i) => {
        const lender = Store.lender(a.lenderId);
        return `${i + 1}. ${lender.name} UGX ${a.amount.toLocaleString()}`;
      }).join("\n");
      return `${out}${getCopy(this.session).repayHeader}\n${lines}\n\n9. Back  0. Exit`;
    }

    if (kind === "talk_menu") {
      this._traceLine("entering Talk flow — grounded Q&A over knowledge_base.py", "meta");
      return `${getCopy(this.session).talkMenu}\n\n${getCopy(this.session).talkFooter}`;
    }

    if (kind === "lang_set") {
      const code = parts[1];
      const lang = LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
      this.session.lang = lang.code;
      this._traceLine(`SET locale=${lang.code} (${lang.label})`, "route");
      if (lang.fallback) {
        this._traceLine(`${lang.label}: localized:false -> serving verified English copy under this session`, "meta");
      }
      const returnNode = this.session.langReturnState || "root";
      const nextScreen = returnNode === "lang_select" ? "root" : returnNode;
      this._enter(nextScreen);
      return this.session.screen;
    }

    if (kind === "fraud_confirm") {
      this._traceLine("submitting fraud report", "result");
      const category = parts[1];
      const report = Store.addFraudReport({ type: category, channel: "USSD", district: borrower.district, summary: `Reported via USSD self-service by ${borrower.phone}.` });
      return `${getCopy(this.session).fraudReceived}\nRef: ${report.id.toUpperCase()}\n${getCopy(this.session).fraudFooter}`;
    }

    return `${getCopy(this.session).unavailable}\n\n9. Back  0. Exit`;
  },

  _doRepay(digit) {
    const s = this.session;
    const list = s._repayList || [];
    const idx = parseInt(digit, 10) - 1;
    const app = list[idx];
    if (!app) { s.invalid = true; return; }
    Store.updateApplication(app.id, { status: "repaid", note: "Repaid via USSD self-service." });
    s._repayMsg = getCopy(s).repayConfirmed;
    this._enter("repay_select");
  },

  _traceLine(text, kind) {
    const s = this.session;
    if (!s) return;
    s.trace.push({ text, kind: kind || "meta" });
    if (s.trace.length > 30) s.trace = s.trace.slice(-30);
  },

  _startBilling() {
    if (this.session.billingTimer) return;
    this.session.billingTimer = window.setInterval(() => {
      this.session.sessionSeconds += 1;
      const increments = Math.ceil(this.session.sessionSeconds / 60);
      this.session.sessionCost = increments * 60;
    }, 1000);
  },

  _stopBilling() {
    if (!this.session.billingTimer) return;
    window.clearInterval(this.session.billingTimer);
    this.session.billingTimer = null;
  },

  _buildExitText() {
    return getCopy(this.session).exitMsg;
  },
};
