// Finny — mocked intelligence layer. Recommender.rank() mirrors the real
// finny-ai/app/recommendation.py scoring weights (cost 40 / trust 35 / fit
// 25) exactly, so the demo's numbers are the product's real logic, not a
// dressed-up random number. Assistant.reply() is a keyword-matched stand-in
// for the Groq-backed chatbot, pulling from the same knowledge base topics.

const Recommender = {
  rank(borrowerLike, amount, tenureDays, profile) {
    const income = borrowerLike.monthlyIncomeUgx || borrowerLike.monthlyIncome || null;
    const tenure = tenureDays || 30;
    const amt = Number(amount) || 0;
    const profileKey = profile || (typeof Store !== "undefined" && Store.currentProfile ? Store.currentProfile() : "first_time_low_income");

    const candidates = [];
    PRODUCTS.forEach((product) => {
      if (amt < product.principalMin || amt > product.principalMax) return;
      const lender = LENDERS.find((l) => l.id === product.lenderId);
      const yearsFraction = tenure / 365;
      const interest = amt * (product.apr / 100) * yearsFraction;
      const totalRepayment = product.interestModel === "flat" ? amt + interest : amt + interest * 0.55;

      const costScore = amt ? Math.max(0, 100 - Math.min(100, (totalRepayment / amt - 1) * 100)) : 100;
      const trustScore = Math.max(0, 100 - lender.complaintsUpheld * 25 - (lender.licensed ? 0 : 30));

      let fitScore = 100;
      if (income) {
        const monthlyInstallment = totalRepayment / Math.max(tenure / 30, 1);
        const burden = monthlyInstallment / income;
        fitScore = Math.max(0, 100 - Math.max(0, (burden - 0.4) * 200));
      }

      if (profileKey === "first_time_low_income") {
        fitScore = Math.max(0, fitScore - 5);
      } else if (profileKey === "student") {
        fitScore = Math.min(100, fitScore + 3);
      } else if (profileKey === "experienced_borrower") {
        fitScore = Math.min(100, fitScore + 2);
      }

      const finalScore = costScore * 0.40 + trustScore * 0.35 + fitScore * 0.25;

      const reasons = [];
      reasons.push(lender.licensed ? "UMRA-licensed" : "Not currently UMRA-licensed");
      if (trustScore < 70) reasons.push("complaint history reduces confidence");
      else reasons.push("clean complaint record");
      if (fitScore < 80 && income) reasons.push("installment is a stretch on stated income");
      else if (income) reasons.push("fits comfortably within stated income");
      if (product.interestModel === "reducing") reasons.push("reducing-balance interest");
      if (profileKey === "first_time_low_income") reasons.push("small, simpler offers prioritized");
      else if (profileKey === "student") reasons.push("flexible, low-pressure options favored");
      else if (profileKey === "experienced_borrower") reasons.push("more detail and history surfaced");

      candidates.push({
        lender, product, totalRepayment: Math.round(totalRepayment),
        finalScore: Math.round(finalScore), trustScore: Math.round(trustScore),
        costScore: Math.round(costScore), fitScore: Math.round(fitScore),
        reasons, flagged: !lender.licensed,
        scoreBreakdown: {
          cost: { score: Math.round(costScore), weight: 40 },
          trust: { score: Math.round(trustScore), weight: 35 },
          fit: { score: Math.round(fitScore), weight: 25 },
        },
      });
    });

    candidates.sort((a, b) => b.finalScore - a.finalScore);
    return candidates;
  },
};

const Assistant = {
  reply(rawQ) {
    const q = rawQ.toLowerCase();

    if (/(upfront|before.*(loan|disburs)|pay first|activation fee|unlock)/.test(q)) {
      return "Never pay a fee before a loan is disbursed. Legitimate lenders deduct their processing fee from the amount they release to you — a request to pay first (an \"activation\", \"insurance\" or \"unlocking\" fee) is a known scam pattern. If you've seen this, report it from the Fraud centre tab.";
    }
    if (/(licen[cs]e|umra|legit|trust|verify|scam.*lender|is .* safe)/.test(q)) {
      return "Every lender in the Finny marketplace shows a licence badge and UMRA reference number. Licensed money lenders and Tier 4 microfinance institutions must renew that licence every calendar year. If a lender shows as unlicensed or flagged, treat it as a red flag and check the UMRA register directly before borrowing.";
    }
    if (/(apr|interest rate|annual percentage)/.test(q)) {
      const g = GLOSSARY.find((x) => x.term === "APR");
      return `APR: ${g.def}`;
    }
    if (/(flat interest|reducing|balance interest|which is (cheaper|better))/.test(q)) {
      const flat = GLOSSARY.find((x) => x.term === "Flat interest").def;
      const red = GLOSSARY.find((x) => x.term === "Reducing balance").def;
      return `Flat interest: ${flat}\n\nReducing balance: ${red}\n\nAt the same stated rate, reducing balance is usually cheaper overall.`;
    }
    if (/(compound interest)/.test(q)) {
      return "Compound interest is interest charged on interest that's already accumulated. It's prohibited for licensed Ugandan money lenders — if a lender's repayment schedule looks compounded, that's grounds for a complaint to UMRA.";
    }
    if (/(collateral|security|no collateral)/.test(q)) {
      return GLOSSARY.find((x) => x.term === "Collateral").def;
    }
    if (/(total repayment|how much (will i|do i) (pay|owe)|full cost)/.test(q)) {
      return GLOSSARY.find((x) => x.term === "Total repayment").def + " You can see this figure for every offer in the Marketplace before you apply.";
    }
    if (/(report|fraud|scam happened|i.*(lost money|been scammed))/.test(q)) {
      return "You can file a report right in the Fraud centre tab — it takes under a minute. For urgent cases: telecom fraud → UCC 0800 222 777, criminal fraud → Police 112 / 999 or 0800 199 399, and a licensed lender behaving unfairly → UMRA +256 417 799 700.";
    }
    if (/(right|entitled|complain)/.test(q)) {
      return "You're entitled to a fair, balanced response if you raise a complaint about financial loss, material inconvenience, or distress caused by a lender. See the full list in Know your rights — it covers licensing, loan agreements, and where to escalate.";
    }
    if (/(sim swap|phishing|otp|pin)/.test(q)) {
      return "Never share your mobile money PIN, password, or an OTP code with anyone — not even someone claiming to be from Finny, your telecom, or a bank. Legitimate services never ask for these over a call or SMS.";
    }
    if (/(hello|hi there|^hi$|hey|good (morning|afternoon|evening))/.test(q)) {
      return "Hello! I can help with loan terms, spotting a risky lender, or your rights as a borrower — what's on your mind?";
    }
    if (/(thank|thanks)/.test(q)) {
      return "Anytime. Stay safe out there — and remember, no lender should ever ask you to pay first.";
    }
    return "I can help with loan terms (APR, flat vs reducing interest), spotting a risky or unlicensed lender, or your rights as a borrower in Uganda. Try asking something like \"what does APR mean\" or \"is it normal to pay a fee upfront\".";
  },
};
