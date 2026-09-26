# AegisRisk Enterprise • Core Banking Fraud Defense & Regulatory Intelligence Suite

Production-grade financial crime detection, real-time risk scoring, explainable AI (XAI) diagnostics, and an integrated Autonomous Regulatory & Financial Intelligence Copilot.

---

## Table of Contents
1. [Overview](#1-overview)
2. [Platform Architecture](#2-platform-architecture)
3. [Machine Learning Model Deep-Dive](#3-machine-learning-model-deep-dive)
   - [Core Algorithm](#31-core-algorithm)
   - [Dataset & Empirical Findings](#32-dataset--empirical-findings)
   - [Features & Mathematical Heuristics](#33-features--mathematical-heuristics)
   - [Splitting Logic & Gini Impurity](#34-splitting-logic--gini-impurity)
   - [Calibrated Risk Scoring & Policy Tiers](#35-calibrated-risk-scoring--policy-tiers)
4. [Autonomous Regulatory & Risk Intelligence Copilot](#4-autonomous-regulatory--risk-intelligence-copilot)
5. [Frontend Application Modules](#5-frontend-application-modules)
6. [Quick Start & Execution Guide](#6-quick-start--execution-guide)
   - [Next.js Web Application](#61-nextjs-web-application)
   - [Python REST Backend Server](#62-python-rest-backend-server)
   - [Legacy Streamlit App](#63-legacy-streamlit-app)
   - [Jupyter Training Notebook](#64-jupyter-training-notebook)
7. [API Reference & Code Examples](#7-api-reference--code-examples)
8. [File Structure](#8-file-structure)
9. [License](#9-license)

---

## 1. Overview

**AegisRisk Enterprise** is an institutional financial risk platform designed with a clean, eye-comfort luxury developer aesthetic (inspired by Stripe Radar and Linear). 

Unlike prototype demos that rely on black-box predictions, this platform combines:
- A deterministic **Scikit-Learn Decision Tree Classifier** for sub-millisecond, auditable transaction risk classification.
- Real-time **ledger discrepancy validation** to catch liquidation drain attacks.
- An **Autonomous Regulatory & Financial Intelligence Copilot** providing compliance, capital deployment frameworks, AML, and fraud recovery advisory backed by authoritative banking regulations (FinCEN, BSA, FATF, UCC 4A, Basel III).

---

## 2. Platform Architecture

```
                          ┌──────────────────────────────────────────┐
                          │   Client Application (Next.js 16)        │
                          │   Clean Developer UI (Zinc/Slate theme)  │
                          └────────────────────┬─────────────────────┘
                                               │
               ┌───────────────────────────────┼───────────────────────────────┐
               ▼                               ▼                               ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌──────────────────────────────┐
│  In-Memory Decision Engine   │ │   Financial RAG Copilot      │ │  Python Backend (backend.py) │
│  - decision_tree.js matrix   │ │  - Regulatory corpus (FinCEN)│ │  - fraud_detection_model.pkl │
│  - Sub-millisecond inference │ │  - Semantic search retriever │ │  - Standard HTTP endpoints   │
│  - Explainable tree trace    │ │  - Advisory synthesis        │ │  - Port 8000                 │
└──────────────────────────────┘ └──────────────────────────────┘ └──────────────────────────────┘
```

---

## 3. Machine Learning Model Deep-Dive

### 3.1 Core Algorithm
- **Model**: `DecisionTreeClassifier` (`scikit-learn 1.3+`)
- **Evaluation Time**: `< 0.8 ms` per transaction
- **Tree Complexity**: 3,025 nodes across 32 split levels
- **Model Persistence**: Serialized in `fraud_detection_model.pkl` and exported to `frontend/src/data/decision_tree.js`

#### Why a Decision Tree for Financial Fraud?
1. **Regulatory Defensibility**: Financial laws (GDPR Art. 22, Fair Lending, Basel III) require institutions to explain *why* an automated system blocked a customer's funds. Decision trees output exact split criteria (e.g. `amount > $181,000` AND `origin_balance <= amount`).
2. **Sub-Millisecond In-Memory Execution**: Traversal requires fewer than 32 basic comparison operations. It executes with zero GPU overhead and minimal CPU load.
3. **Deterministic Consistency**: Given identical ledger states, the tree will always arrive at the exact same classification.

---

### 3.2 Dataset & Empirical Findings

Trained on the **PaySim Mobile Money Dataset** (Lopez-Rojas et al.), comprising **6,362,620 transactions** over a 30-day simulation.

| Payment Channel | Total Transactions | Fraud Count | Fraud Prevalence | Risk Assessment |
|-----------------|--------------------|-------------|------------------|-----------------|
| **TRANSFER**    | 532,909            | 4,097       | 0.769%           | High Risk Rail  |
| **CASH_OUT**    | 2,237,500          | 4,116       | 0.184%           | High Risk Rail  |
| **PAYMENT**     | 2,151,495          | 0           | 0.000%           | Low Risk Rail   |
| **CASH_IN**     | 1,399,284          | 0           | 0.000%           | Low Risk Rail   |
| **DEBIT**       | 41,432             | 0           | 0.000%           | Low Risk Rail   |

> **Critical Empirical Finding:** In 6.36 million real-world financial records, fraudulent transactions occur **exclusively in TRANSFER and CASH_OUT rails**. Retail merchant payments, inbound deposits, and direct debits exhibit 0% fraud. The platform leverages this prior knowledge to avoid false-positive alerts on standard purchases.

---

### 3.3 Features & Mathematical Heuristics

The model evaluates 4 primary features alongside derived ledger integrity metrics:

1. **`oldbalanceOrg` (Weight: 59.9%)**: Origin account balance before payment execution.
2. **`amount` (Weight: 31.6%)**: Total fiat value of transaction.
3. **`newbalanceOrig` (Weight: 8.1%)**: Terminal balance of origin account post-execution.
4. **`type` (Weight: 0.4%)**: Encoded channel type (`CASH_OUT: 1, PAYMENT: 2, CASH_IN: 3, TRANSFER: 4, DEBIT: 5`).

#### Engineered Ledger Discrepancy Check
In legitimate double-entry accounting:
$$\text{Expected Terminal Balance} = \text{Old Balance} - \text{Amount}$$

The system computes:
$$\text{Discrepancy} = |(\text{oldbalanceOrg} - \text{newbalanceOrig}) - \text{amount}|$$
$$\text{Liquidation Ratio} = \frac{\text{amount}}{\text{oldbalanceOrg}} \times 100\%$$

When $\text{newbalanceOrig} = 0$ and $\text{amount} \ge 0.95 \times \text{oldbalanceOrg}$ on a `TRANSFER` or `CASH_OUT`, the platform flags an **Account Liquidation Drain**.

---

### 3.4 Splitting Logic & Gini Impurity

During model training, nodes are partitioned by minimizing **Gini Impurity**:
$$\text{Gini}(D) = 1 - \sum_{i=1}^{C} p_i^2$$

The algorithm selects the split threshold that maximizes information gain:
$$\Delta\text{Gini} = \text{Gini}(\text{Parent}) - \left[ \frac{N_{\text{left}}}{N} \text{Gini}(\text{Left}) + \frac{N_{\text{right}}}{N} \text{Gini}(\text{Right}) \right]$$

---

### 3.5 Calibrated Risk Scoring & Policy Tiers

Raw tree leaf ratios are calibrated into an actionable **0–100 Risk Score**:

- **0 – 34 (Low Risk - ALLOW)**: Standard transactions with positive remaining liquidity. Cleared for immediate processing.
- **35 – 69 (Elevated Risk - REVIEW)**: High transaction sums or minor balance discrepancies. Triggers step-up authentication (SMS OTP, 3D Secure 2.0).
- **70 – 100 (Critical Fraud - BLOCK)**: Complete account drain, zero-balance transfer velocity, or known attack vectors. Transaction blocked and account frozen immediately.

---

## 4. Autonomous Regulatory & Risk Intelligence Copilot

The platform embeds a high-speed **Retrieval-Augmented Generation (RAG)** copilot indexed directly on 6.36M transaction telemetry, financial fraud patterns, capital deployment frameworks, and banking regulations:

### 4.1 Knowledge Corpus & Authoritative Regulatory References
1. **Capital Deployment Framework (₹1M / $12,000 Portfolio Strategy)**:
   - Structured 6-step roadmap (Investment Objectives, Risk Tolerance, Diversified Core Portfolio, Investment Vehicles, AML/KYC Practices, Review Cadence).
   - Prominent statutory educational disclaimers.
2. **Financial Condition & Balance Sheet Health**:
   - **Liquidity Coverage Ratio (LCR)** ($\ge 100\%$) & **Net Stable Funding Ratio (NSFR)** ($\ge 100\%$) under Basel III.
   - **Common Equity Tier 1 (CET1)** Capital Adequacy buffers ($\ge 4.5\%$ minimum / $\ge 8.5\%$ well-capitalized).
   - **Asset Quality & Non-Performing Loans (NPL)** thresholds ($< 2\text{--}3\%$).
   - *References*: **GAAP / IFRS Accounting Standards for Financial Instruments**, **Core Banking Reconciliation Protocols**, **OCC / FRB Interagency Guidance on Core Banking Systems**.
3. **Dataset Empirical Findings (PaySim 6.36M Records)**:
   - Empirical proof that fraud occurs exclusively on `TRANSFER` (0.769%) and `CASH_OUT` (0.184%).
   - Account liquidation signatures ($98.7\%$ of fraud cases drain accounts to exactly $\$0.00$).
4. **Anti-Money Laundering (AML) & Suspicious Activity Reports (SAR)**:
   - Mandatory FinCEN SAR filing within 30 days for unexplained transactions of $\$5,000+$.
   - Smurfing and structuring evasion checks under $\$10,000$ CTR thresholds.
   - *References*: **Bank Secrecy Act (31 U.S.C. 5318)**, **FinCEN Advisory FIN-2021-A003**, **FATF 40 Recommendations**.
5. **Emergency Asset Recovery & Recall Protocols**:
   - SWIFT MT199 and Fedwire recall procedures under the **Uniform Commercial Code (UCC) Article 4A**.
   - FBI IC3 financial fraud recovery and beneficiary mule account freeze guidelines.

### 4.2 RAG Architecture
- **Retriever**: Multi-factor keyword and BM25 token matching extracts top matching regulatory and dataset documents.
- **Generator**: Synthesizes regulatory directives, core banking ledger rules, and telemetry context.
- **Graceful Fallback**: Local deterministic synthesis engine automatically generates structured advice with cited regulatory references when offline.

---

## 5. Frontend Application Modules

Built with **Next.js 16**, **React 19**, and **Vanilla CSS** (zero dependency conflicts, crisp Inter typography, no icons/emojis, clean eye-comfort UI):

1. **Overview & Inspector**: Form for single transaction testing, preset scenario buttons, Stripe Radar-style horizontal risk meter, ledger check table, and expandable decision tree trace.
2. **Batch Processing**: CSV file ingestion dropzone, 12 benchmark preloaded records, KPI stat cards, filterable forensic table (All / Blocked / Review / Allowed), and clean CSV export.
3. **Scenario Sandbox**: Sliders for Channel, Amount, Old Balance, and New Balance with a balance math synchronization lock.
4. **Event Stream**: Real-time simulated gateway event stream with play/pause, clear, and "Simulate Attack Event" triggers.
5. **Regulatory Copilot (RAG)**: Interactive intelligence assistant with semantic search across regulatory financial documents and capital deployment strategies.
6. **Model ML Explained**: Interactive technical documentation breaking down the model architecture, dataset, feature weights, Gini math, and risk tiers.
7. **API & Governance**: Model governance specifications and interactive code snippets for **cURL**, **Python**, and **Node.js**.

---

## 6. Quick Start & Execution Guide

### 6.1 Next.js Web Application

Navigate to the `frontend` directory and start the dev server:

```bash
cd frontend
npm run dev
```

Open your browser at **`http://localhost:3000`**.

---

### 6.2 Python REST Backend Server

The repository includes a zero-dependency Python backend server in `backend.py`:

```bash
python backend.py
```

The server initializes on **`http://localhost:8000`** with the following endpoints:
- `GET /health` — Check model status
- `POST /predict` — Single transaction evaluation
- `POST /batch` — Batch array evaluation

---

### 6.3 Legacy Streamlit App

To run the legacy Streamlit interface:

```bash
streamlit run app.py
```

---

### 6.4 Jupyter Training Notebook

To inspect data preprocessing or retrain the Decision Tree model:

```bash
jupyter notebook fraud_detection.ipynb
```

---

## 7. API Reference & Code Examples

### 7.1 Single Transaction Prediction
`POST /predict` (Python Backend: `http://localhost:8000/predict` | Next.js API: `http://localhost:3000/api/predict`)

#### Request Body
```json
{
  "type": "TRANSFER",
  "amount": 181000.0,
  "oldBalance": 181000.0,
  "newBalance": 0.0
}
```

#### Response Body
```json
{
  "status": "success",
  "data": {
    "decision": "BLOCK",
    "isFraud": true,
    "riskScore": 100,
    "tier": "high",
    "policyAction": "Block & freeze account",
    "factors": [
      {
        "code": "LIQUIDATION_DRAIN",
        "severity": "high",
        "label": "Account liquidation pattern",
        "detail": "Origin balance was depleted to $0.00 in a single transaction."
      }
    ],
    "ledger": {
      "expectedNewBalance": 0.0,
      "actualNewBalance": 0.0,
      "discrepancy": 0.0,
      "liquidationRatio": 100.0
    }
  }
}
```

---

### 7.2 Code Snippets

#### cURL
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"type": "TRANSFER", "amount": 181000.0, "oldBalance": 181000.0, "newBalance": 0.0}'
```

#### Python
```python
import requests

url = "http://localhost:8000/predict"
payload = {
    "type": "TRANSFER",
    "amount": 181000.0,
    "oldBalance": 181000.0,
    "newBalance": 0.0
}

response = requests.post(url, json=payload)
data = response.json()
print("Decision:", data["data"]["decision"])
print("Risk Score:", data["data"]["riskScore"])
```

#### Node.js (JavaScript)
```javascript
const response = await fetch("http://localhost:3000/api/predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "TRANSFER",
    amount: 181000.0,
    oldBalance: 181000.0,
    newBalance: 0.0
  })
});

const result = await response.json();
console.log(result.data);
```

---

## 8. File Structure

```
Farud-Detection/
├── backend.py                   # Production Python HTTP/REST backend server
├── fraud_detection_model.pkl    # Serialized Scikit-Learn DecisionTree model
├── fraud_detection.ipynb        # Model training and data exploration notebook
├── app.py                       # Legacy Streamlit UI
├── requirements.txt             # Python dependencies
├── README.md                    # Project documentation
│
└── frontend/                    # Next.js 16 Web Application
    ├── src/
    │   ├── app/
    │   │   ├── api/
    │   │   │   ├── predict/     # Single prediction API route
    │   │   │   ├── batch/       # Batch forensic API route
    │   │   │   └── advisor/     # Financial RAG advisor API route
    │   │   ├── globals.css      # Real-world developer design system (Inter/Zinc)
    │   │   ├── layout.js        # Root metadata and typography
    │   │   └── page.js          # Main dashboard with segmented tabs
    │   │
    │   ├── components/
    │   │   ├── Header.jsx           # App navigation & sensitivity select
    │   │   ├── RiskScoreBar.jsx     # Stripe Radar-style horizontal risk meter
    │   │   ├── SingleInspector.jsx  # Single transaction risk scoring & trace
    │   │   ├── BatchScanner.jsx     # CSV file ingestion & batch forensics
    │   │   ├── SandboxSimulator.jsx # Real-time parameter what-if sliders
    │   │   ├── LiveStream.jsx       # Transaction event stream & simulation
    │   │   ├── FinancialRagAdvisor.jsx # Financial & compliance RAG copilot
    │   │   ├── ModelExplanation.jsx # Deep-dive educational ML page
    │   │   └── ModelIntelligence.jsx# Specifications & REST API docs
    │   │
    │   ├── data/
    │   │   ├── decision_tree.js     # Decision Tree structure module
    │   │   └── decision_tree.json   # Raw exported tree matrix
    │   │
    │   └── lib/
    │       ├── fraudEngine.js       # Fast ML inference & ledger heuristics
    │       └── financialKnowledge.js# RAG retrieval engine & banking corpus
    │
    ├── package.json
    └── next.config.mjs
```

---

## 9. License

This project is licensed under the MIT License.
