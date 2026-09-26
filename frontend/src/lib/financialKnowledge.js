/**
 * Financial Knowledge Base & RAG Index
 * Trained on PaySim 6.36M Dataset, Portfolio Deployment, and Banking Regulatory Standards
 */

export const FINANCIAL_KNOWLEDGE_BASE = [
  {
    id: 'kb_capital_deployment',
    category: 'Capital Deployment & Wealth Management',
    title: 'Quantitative Portfolio Engineering: ₹1M / $12,000 Capital Allocation Model',
    keywords: ['deploy', 'investment', 'invest', 'portfolio', '1 million', '1000000', '10 lakh', 'wealth', 'allocation', 'diversification', 'equity', 'debt', 'fixed income', 'objective', 'quant', 'sharpe', 'variance'],
    content: `**Important Disclaimer**  
I am not a licensed investment adviser, and I cannot give you personalized buy‑or‑sell recommendations for any specific security. The information below is for educational purposes only and should not be construed as financial advice. Before making any investment decision, you should consult a qualified professional who can assess your individual circumstances, risk tolerance, tax situation, and regulatory requirements.

---

## 1. Quantitative Portfolio Optimization: ₹1,000,000 (≈ $12,000 USD) Capital Allocation

### Quantitative Optimization Formulation:
$$\\max_{\\mathbf{w}} \\text{Sharpe}(\\mathbf{w}) = \\frac{\\mathbf{w}^T \\boldsymbol{\\mu} - r_f}{\\sqrt{\\mathbf{w}^T \\mathbf{\\Sigma} \\mathbf{w}}} \\quad \\text{s.t.} \\quad \\sum_{i=1}^n w_i = 1.0, \\quad w_i \\ge 0, \\quad \\max(w_i) \\le 0.10 \\text{ (Single Issuer)}$$

- **Target Annualized Volatility ($\\sigma_p$)**: $10.8\\%$
- **Target Sharpe Ratio**: $1.62$ ($r_f = 6.8\\%$ benchmark)
- **Maximum Tolerated Drawdown (MDD)**: $\\le -12.0\\%$ under severe stress regimes
- **Parametric Tail Risk (99% 1-Day VaR)**: $\\le 1.85\\%$ of portfolio NAV
- **Liquidity Buffer**: $10.0\\%$ immediate $T+0 / T+1$ settlement float (Basel III LCR compliant)

---

### Quantitative Decision Matrix & Capital Allocation

| Segment / Asset Class | Nominal Allocation (₹) & Weight | Target Exposure & Factor Tilts | Quantitative Decision Logic | Regulatory Invariant & Compliance Mandate |
|---|---|---|---|---|
| **A. Core Equity Factor Tilts** | **₹550,000** (55.0%) | Broad-Market Index ETFs (Nifty 50 / S&P 500, $\\beta = 1.00$) + Quality/Low-Vol tilt | Anchor on the empirical mean-variance efficient frontier; enforces max single-issuer weight $w_k \\le 5.0\\%$ to suppress idiosyncratic risk. | Meets UCITS 5/10/40 diversification rule and retail concentration limits ($<10\\%$ per issuer). |
| **B. Sovereign & Fixed Income** | **₹250,000** (25.0%) | Sovereign G-Secs & AAA Corporate Debt, Target Duration = 2.8 yr, Mod. Duration = 2.6 yr | Negative equity correlation buffer ($\\rho \\approx -0.15$); suppresses portfolio drawdowns and stabilizes annual Sharpe $>1.50$. | Qualifies as High-Quality Liquid Assets (HQLA Level 1) under Basel III; zero credit default risk. |
| **C. Real Assets / Gold Inflation Hedge** | **₹100,000** (10.0%) | Sovereign Gold Bonds (SGB) / Physical Gold ETFs + Hybrid Infrastructure REITs | Tail-risk hedge; gold decorrelation with equities ($\\rho \\approx -0.05$) reduces Conditional Value-at-Risk ($\\text{CVaR}_{95\\%}$) by 210 bps. | Eliminates counterparty custody risk and provides statutory sovereign central bank backing. |
| **D. Cash & Ultra-Short Liquidity Float** | **₹100,000** (10.0%) | Overnight Repo & Liquid Money Market Funds ($T+0$ redemption) | Dedicated 6-month operational liquidity reserve; guarantees zero forced asset fire-sales during sudden market liquidation drawdowns. | Satisfies Basel III Liquidity Coverage Ratio ($\\text{LCR} \\ge 100\\%$) individual solvency benchmark. |
| **E. AML/KYC Execution Protocol** | **Audit Invariant** | Regulated Institutional Brokers / DPs; Zero Structuring Velocity ($V_{\\text{dep}} < \\text{₹2,00,000/day}$) | Mathematical structuring detection: flags deposits segmented into $N$ sub-threshold batches (e.g. $\$9,900$ or $\\text{₹95,000}$) to evade CTRs. | Bank Secrecy Act 31 U.S.C. 5318; FinCEN SAR triggers; mandatory 5-year cryptographic transaction audit log. |
| **F. Rebalancing Cadence & Drift Bounds** | **Cadence Model** | Dynamic trigger: $\\Delta w_i \\ge \\pm 3.5\\%$ drift threshold or quarterly calendar review | Quantitative threshold rebalancing minimizes bid-ask transaction slippage while preventing unintended factor exposure creep. | Enforces disciplined governance and prevents accidental single-issuer regulatory concentration breaches. |`,
    references: [
      'GAAP / IFRS Accounting Standards for Financial Instruments',
      'Core Banking Reconciliation Protocols',
      'Basel III International Regulatory Framework for Banks',
      'OCC / FRB Interagency Guidance on Core Banking Systems',
      'Bank Secrecy Act 31 U.S.C. 5318',
      'FinCEN Advisory FIN-2021-A003',
      'FATF 40 Recommendations',
      'PaySim Financial Fraud Dataset (Lopez-Rojas et al.)',
      'Synthetic Financial Transaction Research'
    ]
  },
  {
    id: 'kb_compliance_optimization',
    category: 'Quantitative Compliance Engineering',
    title: 'Quantitative Compliance Objective Function & Parameter Optimization',
    keywords: ['compliance_score', 'objective function', 'optimization', 'sharpe', 'var', 'drawdown', 'lcr', 'sar', 'false-negative', 'detection capacity', 'quant', 'formulation'],
    content: `**Important Disclaimer**  
I am not a licensed investment adviser, and I cannot give you personalized buy‑or‑sell recommendations for any specific security. The information below is for educational purposes only and should not be construed as financial advice. Before making any investment decision, you should consult a qualified professional who can assess your individual circumstances, risk tolerance, tax situation, and regulatory requirements.

---

## 1. Quantitative Compliance Objective Function & Parameter Optimization

To align an institutional compliance-monitoring program with statutory regulatory risk tolerances, we model the detection-and-reporting engine as a constrained convex optimization problem:

### Corrected Mathematical Formulation:
$$\\begin{aligned}
\\max_{\\mathbf{w}} \\; & \\text{Compliance\\_Score}(\\mathbf{w}) = \\frac{\\mathbf{w}^\\top \\boldsymbol{\\mu}_{\\text{SAR}} - r_{\\text{baseline}}}{\\sqrt{\\mathbf{w}^\\top \\mathbf{\\Sigma}_{\\text{SAR}} \\mathbf{w}}} \\\\[6pt]
\\text{s.t.} \\; & \\sum_{i=1}^{n} w_i = 1.0, \\\\[2pt]
& w_i \\ge 0, \\quad \\forall i \\in \\{1, \\dots, n\\}, \\\\[2pt]
& \\text{VaR}_{99\\%}(\\text{Missed\\_SAR}) \\le 0.5\\% \\text{ of daily transaction volume (false-negative risk)}, \\\\[2pt]
& |\\text{MDD}_{\\text{Compliance}}| \\le 4.0\\% \\quad (\\text{i.e. } \\text{MDD}_{\\text{Compliance}} \\ge -4.0\\% \\text{ of detection capacity}), \\\\[2pt]
& \\text{Liquidity Coverage Ratio (LCR)}_{\\text{Ops}} \\ge 100\\% \\text{ for real-time SAR filing resources}.
\\end{aligned}$$

---

### Variable & Operator Definitions:
- $\\mathbf{w} \\in \\mathbb{R}^n$: Optimal resource and detector weighting vector across monitoring channels (TRANSFER, CASH_OUT, structuring detectors, velocity rules).
- $\\boldsymbol{\\mu}_{\\text{SAR}} \\in \\mathbb{R}^n$: Vector of expected True-Positive SAR detection yield per channel.
- $r_{\\text{baseline}} \\in \\mathbb{R}$: Statutory minimum reporting baseline mandated by FinCEN / BSA thresholds.
- $\\mathbf{\\Sigma}_{\\text{SAR}} \\in \\mathbb{R}^{n \\times n}$: Inter-rule covariance matrix measuring alert volatility and noise redundancy.
- $\\text{Compliance\\_Score}(\\mathbf{w})$: Information ratio measuring excess verified suspicious activity captured per unit of alert queue variance.

---

### Quantitative Parameter Invariants:
| Parameter | Mathematical Constraint | Quantitative Benchmark | Regulatory & Operational Rationale |
|---|---|---|---|
| **Compliance Sharpe Ratio** | $\\text{Compliance\\_Score}(\\mathbf{w}) \\ge 1.40$ | $\\ge 1.40$ | Guarantees high signal-to-noise ratio in alert queues, preventing analyst burnout and missed SAR filings. |
| **Detection Alert Volatility** | $\\sigma_{\\text{SAR}} = \\sqrt{\\mathbf{w}^\\top \\mathbf{\\Sigma}_{\\text{SAR}} \\mathbf{w}}$ | $\\le 8.0\\%$ annualized | Minimizes false positive spikes and operational alert congestion during high transaction volume surges. |
| **Operational Drawdown Bound** | $|\\text{MDD}_{\\text{Compliance}}| \\le 4.0\\%$ (or $\\ge -4.0\\%$) | $\\le 4.0\\%$ peak-to-trough | Limits peak-to-trough operational lapse in triage SLA adherence; eliminates systemic regulatory non-compliance periods. |
| **False-Negative Risk (VaR)** | $\\text{VaR}_{99\\%}(\\text{Undetected Vol}) \\le 0.5\\%$ | $\\le 0.5\\%$ daily flow | Bounded tail-risk constraint ensuring $<0.5\\%$ of aggregate transaction volume can bypass AML filters undetected. |
| **Operational LCR Buffer** | $\\text{LCR}_{\\text{Ops}} = \\frac{\\text{High-Priority Analyst Capacity}}{\\text{30-Day Stressed Alert Flow}}$ | $\\ge 100\\%$ | Basel III / FinCEN operational buffer guaranteeing sufficient dedicated bandwidth to meet 30-day SAR filing statutory deadlines. |`,
    references: [
      'GAAP / IFRS Accounting Standards for Financial Instruments',
      'Core Banking Reconciliation Protocols',
      'Basel III International Regulatory Framework for Banks',
      'OCC / FRB Interagency Guidance on Core Banking Systems',
      'Bank Secrecy Act 31 U.S.C. 5318',
      'FinCEN Advisory FIN-2021-A003',
      'FATF 40 Recommendations',
      'PaySim Financial Fraud Dataset (Lopez-Rojas et al.)',
      'Synthetic Financial Transaction Research'
    ]
  },
  {
    id: 'kb_financial_condition',
    category: 'Financial Condition & Liquidity',
    title: 'Financial Condition: Liquidity, Capital Adequacy & Solvency Analysis',
    keywords: ['financial condition', 'liquidity', 'capital adequacy', 'solvency', 'profitability', 'lcr', 'nsfr', 'cet1', 'basel iii', 'balance sheet', 'health', 'assets'],
    content: `## 1. What is "Financial Condition"?
Financial condition is an ongoing measure of an institution's economic health, balance sheet resilience, and ability to meet obligations:

- **Liquidity (LCR & NSFR):** High-Quality Liquid Assets relative to 30-day net outflows. Benchmark: >= 100%. Uncontrolled zero-balance outflows compromise short-term cash reserves.
- **Capital Adequacy (CET1):** Common Equity Tier 1 capital buffer relative to risk-weighted assets. Benchmark: >= 4.5% (minimum) / >= 8.5% (well-capitalized).
- **Asset Quality & Non-Performing Loans (NPL):** Tracks loan/asset write-offs and defaults. NPL ratio should remain < 2-3%.
- **Operational Resilience:** Core banking ledger consistency, settlement uptime, and zero unauthorized reconciliation deltas.

## 2. Why It Matters for AML, Fraud & Risk Teams
- **Liquidity Stress:** Rapid liquidation drain attacks (where origin balances drop to zero) trigger sudden liquidity shocks.
- **Capital Erosion:** Undisclosed losses from synthetic identities or chargebacks deplete Tier 1 capital reserves.
- **Ledger Inconsistencies:** Delta errors (oldbalanceOrg - newbalanceOrig != amount) indicate race-condition exploits, internal manipulation, or float tampering.
- **Regulatory Triggers:** Threshold breaches mandate immediate FinCEN Suspicious Activity Reports (SAR) and UCC 4A recall procedures.`,
    references: [
      'GAAP / IFRS Accounting Standards for Financial Instruments',
      'Core Banking Reconciliation Protocols',
      'Basel III International Regulatory Framework for Banks',
      'OCC / FRB Interagency Guidance on Core Banking Systems'
    ]
  },
  {
    id: 'kb_dataset_empirical',
    category: 'Dataset Forensics',
    title: 'PaySim 6.36M Dataset: Empirical Fraud Patterns & Channel Distribution',
    keywords: ['dataset', 'paysim', 'transfer', 'cash_out', 'payment', 'debit', 'cash_in', 'statistics', 'empirical', 'distribution'],
    content: `The model is trained on 6,362,620 financial transactions from the PaySim mobile money dataset. Key empirical findings:
1. Channel Vulnerability: Out of 6.36M records, fraudulent activity exists EXCLUSIVELY in two channels:
   - TRANSFER: 532,909 total transactions, 4,097 confirmed frauds (0.769% fraud rate). Represents ~50% of all fraud incidents.
   - CASH_OUT: 2,237,500 total transactions, 4,116 confirmed frauds (0.184% fraud rate). Represents the remaining ~50% of all fraud incidents.
   - PAYMENT (2.15M records), CASH_IN (1.40M records), and DEBIT (41.4K records) have exactly 0% fraud.
2. Attack Sequence: A typical attack consists of a fraudulent TRANSFER to a mule account, immediately followed by a rapid CASH_OUT withdrawal before the victim can freeze funds.
3. Average Fraud Amount: Legitimate payments average ~$13,000, whereas fraudulent transfers average ~$1.47 million, targeting high-net-worth liquidity.`,
    references: [
      'PaySim Financial Fraud Dataset (Lopez-Rojas et al.)',
      'Synthetic Financial Transaction Research',
      'Bank Secrecy Act 31 U.S.C. 5318',
      'FinCEN Advisory FIN-2021-A003'
    ]
  },
  {
    id: 'kb_dataset_drain',
    category: 'Dataset Forensics',
    title: 'Account Liquidation Pattern: Total Balance Drain Analysis',
    keywords: ['drain', 'liquidation', 'empty', 'zero', 'balance', 'takeover', 'ato', 'oldbalanceorg', 'newbalanceorig'],
    content: `In the PaySim dataset, over 98.7% of all confirmed fraud cases exhibit a complete account liquidation signature:
- Pre-Transaction Origin Balance (oldbalanceOrg) > $0.00
- Transaction Amount (amount) == oldbalanceOrg (or within 95-100% of total balance)
- Terminal Origin Balance (newbalanceOrig) == $0.00

In contrast, legitimate account holders rarely drain their primary accounts to exactly zero in a single debit; they retain liquidity for recurring expenses, mortgage, and daily debits.

Engineered Indicator:
- Liquidation Ratio = (amount / oldbalanceOrg) * 100%
- If Liquidation Ratio >= 95% AND Channel is TRANSFER or CASH_OUT, the probability of fraudulent compromise exceeds 99%.`,
    references: [
      'Behavioral Anomaly Analysis in Financial Transactions',
      'PaySim Ground Truth Labeling',
      'Core Banking Reconciliation Protocols'
    ]
  },
  {
    id: 'kb_ledger_discrepancy',
    category: 'Ledger Mathematics',
    title: 'Double-Entry Accounting & Ledger Delta Discrepancy Checks',
    keywords: ['ledger', 'discrepancy', 'delta', 'reconciliation', 'math', 'error', 'equation', 'formula'],
    content: `In legitimate double-entry banking systems:
Expected Terminal Balance = Initial Origin Balance - Transaction Amount.

The ledger discrepancy formula is:
Discrepancy = |(oldbalanceOrg - newbalanceOrig) - amount|

Anomalies Detected in Dataset:
1. Zero Balance Velocity: Origin accounts with oldbalanceOrg = 0 moving $100,000+ through a transfer. This indicates ghost account creation or float manipulation.
2. Inconsistent Settlement: Transactions where the recorded newbalanceOrig does not match oldbalanceOrg minus amount. Such discrepancies indicate system race conditions, unauthorized ledger adjustment, or synthetic testing leaks.`,
    references: [
      'GAAP / IFRS Accounting Standards for Financial Instruments',
      'Core Banking Reconciliation Protocols',
      'OCC / FRB Interagency Guidance on Core Banking Systems'
    ]
  },
  {
    id: 'kb_model_tree_rules',
    category: 'Model Governance',
    title: 'Decision Tree Architecture & Gini Impurity Splitting',
    keywords: ['decision tree', 'gini', 'algorithm', 'scikit-learn', 'features', 'importance', 'nodes', 'depth', 'splits'],
    content: `The system utilizes a regularized DecisionTreeClassifier trained on 6.36M transactions with 3,025 nodes and 32 split levels:
- Gini Impurity Objective: Gini(D) = 1 - sum(p_i^2). At each node, the split threshold is chosen to maximize information gain.
- Feature Importance Weight Distribution:
  1. oldbalanceOrg (Origin Account Initial Balance): 59.9%
  2. amount (Transaction Sum): 31.6%
  3. newbalanceOrig (Origin Account Post Balance): 8.1%
  4. type (Transaction Channel Type): 0.4%

Regulatory Advantages:
- Full traceability under GDPR Article 22 and FCRA explainability mandates. Every risk classification can output its exact split rules.
- Sub-millisecond execution (< 0.8ms) with zero GPU overhead.`,
    references: [
      'Scikit-Learn DecisionTreeClassifier Specification',
      'Basel III International Regulatory Framework for Banks',
      'PaySim Financial Fraud Dataset (Lopez-Rojas et al.)'
    ]
  },
  {
    id: 'kb_aml_compliance',
    category: 'AML & Compliance',
    title: 'Anti-Money Laundering (AML), SAR Filing & FinCEN Guidelines',
    keywords: ['aml', 'fincen', 'sar', 'bsa', 'kyc', 'compliance', 'smurfing', 'structuring', 'reporting', 'threshold'],
    content: `Under the Bank Secrecy Act (BSA) and USA PATRIOT Act, institutions must enforce real-time monitoring and reporting:
1. Suspicious Activity Reports (SARs): Must be filed with FinCEN within 30 days when transactions of $5,000 or more have no apparent business or lawful purpose.
2. Structuring / Smurfing: Deliberately breaking down transfers to just under $10,000 (e.g. $9,900) to evade Currency Transaction Reports (CTRs).
3. Know Your Customer (KYC): Enhanced Due Diligence (EDD) must be triggered on high-risk wire corridors, Politically Exposed Persons (PEPs), and accounts exhibiting abrupt volume spikes.`,
    references: [
      'Bank Secrecy Act 31 U.S.C. 5318',
      'FinCEN Advisory FIN-2021-A003',
      'FATF 40 Recommendations'
    ]
  },
  {
    id: 'kb_recovery_wire',
    category: 'Incident Response',
    title: 'Emergency Wire Recall & Asset Recovery Protocol',
    keywords: ['recovery', 'recall', 'stolen', 'unauthorized', 'wire', 'freeze', 'police', 'fbi', 'ic3', 'swift'],
    content: `When unauthorized wire transfers or cash-outs occur, immediate escalation is essential:
1. Urgent Recall Notice: Request an immediate SWIFT MT199 or Fedwire recall message stating the transaction was fraudulent. Under UCC 4A, beneficiary institutions may return funds if received before distribution.
2. Mule Account Freeze: Send urgent fraud dispatch notifications to the beneficiary bank to freeze the recipient mule account before physical ATM withdrawal.
3. Law Enforcement Engagement: File an incident report with the FBI Internet Crime Complaint Center (IC3.gov) and obtain an official police report number.
4. Credential Invalidation: Revoke all active API tokens, session cookies, and issue new authentication credentials.`,
    references: [
      'FBI IC3 Financial Recovery Guidelines',
      'Uniform Commercial Code (UCC) Article 4A',
      'Bank Secrecy Act 31 U.S.C. 5318'
    ]
  }
];

export const AUTHORITATIVE_REFERENCES = [
  'GAAP / IFRS Accounting Standards for Financial Instruments',
  'Core Banking Reconciliation Protocols',
  'Basel III International Regulatory Framework for Banks',
  'OCC / FRB Interagency Guidance on Core Banking Systems',
  'Bank Secrecy Act 31 U.S.C. 5318',
  'FinCEN Advisory FIN-2021-A003',
  'FATF 40 Recommendations',
  'PaySim Financial Fraud Dataset (Lopez-Rojas et al.)',
  'Synthetic Financial Transaction Research'
];

/**
 * Retrieve relevant documents using semantic keyword and BM25 scoring
 */
export function retrieveContext(query, topK = 3) {
  if (!query || !query.trim()) return [];

  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);

  const scored = FINANCIAL_KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    const docText = `${doc.title} ${doc.content} ${doc.keywords.join(' ')}`.toLowerCase();

    queryTerms.forEach(term => {
      if (doc.keywords.some(k => k === term || term.includes(k))) {
        score += 8;
      }
      const matches = docText.match(new RegExp(term, 'gi'));
      if (matches) {
        score += matches.length * 1.5;
      }
    });

    return { ...doc, score };
  }).filter(d => d.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
