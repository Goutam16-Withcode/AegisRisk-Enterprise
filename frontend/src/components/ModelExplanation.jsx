'use client';
import React, { useState } from 'react';

export default function ModelExplanation() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: '1. Model Architecture & Theory' },
    { id: 'dataset', title: '2. Dataset & Empirical Signals' },
    { id: 'features', title: '3. Features & Ledger Mathematics' },
    { id: 'tree-math', title: '4. Decision Tree Splitting Logic' },
    { id: 'scoring', title: '5. Risk Scoring & Policy Tiers' }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Machine Learning Model Architecture & Deep Dive</h2>
          <p className="card-description">
            Technical explanation of the Decision Tree classifier, training dataset, mathematical heuristics, and production inference engine
          </p>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {sections.map((sec) => (
          <button
            key={sec.id}
            type="button"
            className="preset-btn"
            style={{
              background: activeSection === sec.id ? '#0f172a' : '#f8fafc',
              color: activeSection === sec.id ? '#ffffff' : '#475569',
              borderColor: activeSection === sec.id ? '#0f172a' : '#e2e8f0',
              fontWeight: activeSection === sec.id ? 600 : 500
            }}
            onClick={() => setActiveSection(sec.id)}
          >
            {sec.title}
          </button>
        ))}
      </div>

      {/* Content Section 1: Overview */}
      {activeSection === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', lineHeight: 1.6, color: '#334155' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Why a Decision Tree Classifier for Financial Fraud?
            </h3>
            <p>
              In banking and financial compliance, machine learning models face strict regulatory requirements (such as the Fair Credit Reporting Act, GDPR Article 22, and Basel III risk management frameworks). Black-box models (e.g. deep neural networks) are often difficult to defend during compliance audits because their internal decisions cannot be mathematically traced step-by-step.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              A <strong>Decision Tree Classifier (via Scikit-Learn)</strong> provides:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><strong>Deterministic Auditability:</strong> Every transaction follows an exact, transparent sequence of boolean threshold rules (e.g. <code>amount &gt; $181,000 &rarr; oldbalanceOrg &lt;= $181,000</code>).</li>
              <li><strong>Sub-Millisecond Inference:</strong> Traversal across a tree of depth 32 takes fewer than 32 numerical comparison operations, executing in under <strong>0.8 milliseconds</strong> without requiring heavy GPU infrastructure.</li>
              <li><strong>Zero External Latency:</strong> The tree matrix can be serialized and loaded in memory both in Python backends and edge JavaScript runtimes.</li>
            </ul>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Model Governance Snapshot
            </div>
            <div className="grid-3" style={{ gap: '0.75rem', fontSize: '0.8rem' }}>
              <div><strong>Core Algorithm:</strong> <code>DecisionTreeClassifier</code></div>
              <div><strong>Framework:</strong> <code>scikit-learn 1.3+</code></div>
              <div><strong>Total Training Samples:</strong> 6,362,620 rows</div>
              <div><strong>Validation Accuracy:</strong> 99.97%</div>
              <div><strong>Tree Depth:</strong> 32 levels</div>
              <div><strong>Total Decision Nodes:</strong> 3,025 splits</div>
            </div>
          </div>
        </div>
      )}

      {/* Content Section 2: Dataset */}
      {activeSection === 'dataset' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', lineHeight: 1.6, color: '#334155' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              The PaySim Financial Fraud Dataset
            </h3>
            <p>
              The model was trained on the <strong>PaySim Synthetic Financial Dataset</strong> (published by Lopez-Rojas et al.), containing <strong>6,362,620 real-world mobile money transactions</strong> over 30 simulation days.
            </p>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Channel Rail</th>
                  <th>Total Volume</th>
                  <th>Fraudulent Incidents</th>
                  <th>Empirical Fraud Rate</th>
                  <th>Operational Risk Tier</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>TRANSFER</strong></td>
                  <td>532,909</td>
                  <td style={{ color: '#b91c1c', fontWeight: 600 }}>4,097</td>
                  <td style={{ color: '#b91c1c', fontWeight: 600 }}>0.769%</td>
                  <td><span className="pill danger">High Risk Rail</span></td>
                </tr>
                <tr>
                  <td><strong>CASH_OUT</strong></td>
                  <td>2,237,500</td>
                  <td style={{ color: '#b91c1c', fontWeight: 600 }}>4,116</td>
                  <td style={{ color: '#b91c1c', fontWeight: 600 }}>0.184%</td>
                  <td><span className="pill danger">High Risk Rail</span></td>
                </tr>
                <tr>
                  <td><strong>PAYMENT</strong></td>
                  <td>2,151,495</td>
                  <td style={{ color: '#15803d' }}>0</td>
                  <td style={{ color: '#15803d' }}>0.000%</td>
                  <td><span className="pill success">Low Risk Rail</span></td>
                </tr>
                <tr>
                  <td><strong>CASH_IN</strong></td>
                  <td>1,399,284</td>
                  <td style={{ color: '#15803d' }}>0</td>
                  <td style={{ color: '#15803d' }}>0.000%</td>
                  <td><span className="pill success">Low Risk Rail</span></td>
                </tr>
                <tr>
                  <td><strong>DEBIT</strong></td>
                  <td>41,432</td>
                  <td style={{ color: '#15803d' }}>0</td>
                  <td style={{ color: '#15803d' }}>0.000%</td>
                  <td><span className="pill success">Low Risk Rail</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ background: '#eff6ff', padding: '1rem', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '0.82rem', color: '#1e40af' }}>
            <strong>Key Data Science Takeaway:</strong> In the entire dataset of 6.36 million rows, fraudulent activity exclusively manifests in <code>TRANSFER</code> and <code>CASH_OUT</code> channels. Transactions in <code>PAYMENT</code>, <code>CASH_IN</code>, and <code>DEBIT</code> never contain fraudulent chargebacks or theft.
          </div>
        </div>
      )}

      {/* Content Section 3: Features */}
      {activeSection === 'features' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', lineHeight: 1.6, color: '#334155' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Feature Weights & Ledger Integrity Checks
            </h3>
            <p>
              The classifier evaluates four primary transaction dimensions alongside engineered balance consistency signals.
            </p>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Feature Name</th>
                  <th>Type</th>
                  <th>Gini Importance</th>
                  <th>Detection Functionality</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>oldbalanceOrg</code></td>
                  <td>Numeric (Float)</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>59.9%</td>
                  <td>Captures initial liquidity in victim account before transfer initiation.</td>
                </tr>
                <tr>
                  <td><code>amount</code></td>
                  <td>Numeric (Float)</td>
                  <td style={{ fontWeight: 700, color: '#2563eb' }}>31.6%</td>
                  <td>Detects total capital being extracted in the operation.</td>
                </tr>
                <tr>
                  <td><code>newbalanceOrig</code></td>
                  <td>Numeric (Float)</td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>8.1%</td>
                  <td>Flags whether account was completely emptied ($0.00 post-balance).</td>
                </tr>
                <tr>
                  <td><code>type</code></td>
                  <td>Categorical (1-5)</td>
                  <td style={{ fontWeight: 700, color: '#d97706' }}>0.4%</td>
                  <td>Filters channel risk (TRANSFER: 4, CASH_OUT: 1, PAYMENT: 2, etc.).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
              Engineered Ledger Discrepancy Equation
            </h4>
            <pre className="code-container" style={{ margin: '0.4rem 0' }}>
              <code>Discrepancy = |(oldbalanceOrg - newbalanceOrig) - amount|</code>
            </pre>
            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
              In legitimate debits, the terminal balance strictly equals <code>oldbalanceOrg - amount</code>. When an attacker drains an account or uses stolen credentials, a discrepancy or full liquidation (<code>newbalanceOrig == 0</code> when <code>amount &gt;= oldbalanceOrg</code>) triggers instant high-risk weighting.
            </p>
          </div>
        </div>
      )}

      {/* Content Section 4: Tree Math */}
      {activeSection === 'tree-math' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', lineHeight: 1.6, color: '#334155' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Gini Impurity Splitting Criteria
            </h3>
            <p>
              During model training, the Decision Tree evaluates splits using the <strong>Gini Impurity Metric</strong>:
            </p>
            <pre className="code-container" style={{ margin: '0.5rem 0' }}>
              <code>Gini(D) = 1 - &sum; [p_i &sup2;]   for classes i &isin; {`{Fraud, Legitimate}`}</code>
            </pre>
            <p>
              At each decision node, the algorithm tests all possible threshold values across features to select the threshold that maximizes information gain (minimizing child node impurity):
            </p>
            <pre className="code-container" style={{ margin: '0.5rem 0' }}>
              <code>&Delta;Gini = Gini(Parent) - [ (N_left / N_total) &times; Gini(Left) + (N_right / N_total) &times; Gini(Right) ]</code>
            </pre>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
              Top Tree Decision Path Example
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
              <div><strong>Split 1:</strong> <code>amount &gt; $500,000</code> &rarr; Evaluates large transaction threshold.</div>
              <div><strong>Split 2:</strong> <code>oldbalanceOrg &le; amount</code> &rarr; Checks if transaction exhausts total balance.</div>
              <div><strong>Split 3:</strong> <code>newbalanceOrig == $0.00</code> &rarr; Confirms zero remaining liquidity (Liquidation).</div>
              <div><strong>Terminal Leaf:</strong> Purity 100% Fraud &rarr; Flagged as <code>BLOCK</code>.</div>
            </div>
          </div>
        </div>
      )}

      {/* Content Section 5: Scoring & Tiers */}
      {activeSection === 'scoring' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', lineHeight: 1.6, color: '#334155' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Risk Scoring Policy & Enforcement
            </h3>
            <p>
              The calculated score (0 to 100) translates raw leaf probabilities into actionable enforcement tiers:
            </p>
          </div>

          <div className="grid-3" style={{ gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
              <span className="pill success" style={{ marginBottom: '0.4rem' }}>SCORE 0 - 34</span>
              <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.9rem', marginTop: '0.3rem' }}>Normal (Low Risk)</div>
              <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.25rem' }}>
                Standard transactions matching expected customer patterns with sufficient liquidity reserves. Automatically authorized.
              </p>
            </div>

            <div style={{ padding: '1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px' }}>
              <span className="pill warning" style={{ marginBottom: '0.4rem' }}>SCORE 35 - 69</span>
              <div style={{ fontWeight: 700, color: '#b45309', fontSize: '0.9rem', marginTop: '0.3rem' }}>Elevated Risk</div>
              <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.25rem' }}>
                Minor balance discrepancies or high-value transfers requiring secondary verification (SMS OTP / 3D Secure step-up).
              </p>
            </div>

            <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px' }}>
              <span className="pill danger" style={{ marginBottom: '0.4rem' }}>SCORE 70 - 100</span>
              <div style={{ fontWeight: 700, color: '#b91c1c', fontSize: '0.9rem', marginTop: '0.3rem' }}>Critical Fraud</div>
              <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.25rem' }}>
                Total account drain or zero-balance mule transfers. Transaction blocked and account frozen immediately for investigation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
