'use client';
import React, { useState } from 'react';

const FEATURES = [
  { name: 'oldbalanceOrg (Origin Pre-Transaction Balance)', importance: 59.9, color: '#0f172a' },
  { name: 'amount (Transaction Value)', importance: 31.6, color: '#2563eb' },
  { name: 'newbalanceOrig (Origin Post-Transaction Balance)', importance: 8.1, color: '#059669' },
  { name: 'type (Payment Channel Rail)', importance: 0.4, color: '#d97706' }
];

export default function ModelIntelligence() {
  const [activeCodeTab, setActiveCodeTab] = useState('curl');
  const [copied, setCopied] = useState(false);

  const curlCode = `curl -X POST http://localhost:3000/api/predict \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "TRANSFER",
    "amount": 181000.0,
    "oldBalance": 181000.0,
    "newBalance": 0.0
  }'`;

  const pythonCode = `import requests

url = "http://localhost:3000/api/predict"
payload = {
    "type": "TRANSFER",
    "amount": 181000.0,
    "oldBalance": 181000.0,
    "newBalance": 0.0
}

response = requests.post(url, json=payload)
data = response.json()
print("Decision:", data["data"]["decision"])
print("Risk Score:", data["data"]["riskScore"], "/ 100")`;

  const jsCode = `const response = await fetch("http://localhost:3000/api/predict", {
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
console.log("Decision:", result.data.decision);
console.log("Risk Score:", result.data.riskScore);`;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid-2">
      {/* Left: Model Architecture & Governance */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Model Specifications & Governance</h2>
            <p className="card-description">Scikit-Learn DecisionTreeClassifier v3.2 architecture</p>
          </div>
        </div>

        {/* Feature Importance Bars */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
            Feature Importance Weighting (Gini Impurity)
          </div>
          {FEATURES.map((feat, idx) => (
            <div key={idx} style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#0f172a', fontWeight: 500 }}>{feat.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: feat.color }}>
                  {feat.importance}%
                </span>
              </div>
              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${feat.importance}%`,
                    background: feat.color,
                    borderRadius: '3px'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Specification Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <tbody>
              <tr>
                <td style={{ color: '#64748b', width: '40%' }}>Core Classifier</td>
                <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>DecisionTreeClassifier</td>
              </tr>
              <tr>
                <td style={{ color: '#64748b' }}>Training Records</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>6,362,620 transactions</td>
              </tr>
              <tr>
                <td style={{ color: '#64748b' }}>Validation Accuracy</td>
                <td style={{ fontWeight: 600, color: '#15803d', fontFamily: 'var(--font-mono)' }}>99.97%</td>
              </tr>
              <tr>
                <td style={{ color: '#64748b' }}>Tree Complexity</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>3,025 nodes &bull; 32 split levels</td>
              </tr>
              <tr>
                <td style={{ color: '#64748b' }}>Inference Latency</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>&lt; 0.8ms (In-Memory Engine)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: REST API Documentation */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Production REST API</h2>
            <p className="card-description">Synchronous JSON endpoints for backend transaction routing</p>
          </div>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            onClick={() => handleCopy(activeCodeTab === 'curl' ? curlCode : activeCodeTab === 'python' ? pythonCode : jsCode)}
          >
            {copied ? 'Copied' : 'Copy Code'}
          </button>
        </div>

        {/* Language selector */}
        <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.85rem' }}>
          {['curl', 'python', 'javascript'].map((lang) => (
            <button
              key={lang}
              type="button"
              className="preset-btn"
              style={{
                background: activeCodeTab === lang ? '#0f172a' : '#f8fafc',
                color: activeCodeTab === lang ? '#ffffff' : '#475569',
                borderColor: activeCodeTab === lang ? '#0f172a' : '#e2e8f0',
                padding: '0.25rem 0.65rem'
              }}
              onClick={() => setActiveCodeTab(lang)}
            >
              {lang === 'curl' ? 'cURL' : lang === 'python' ? 'Python' : 'Node.js'}
            </button>
          ))}
        </div>

        {/* Code Snippet Box */}
        <pre className="code-container">
          <code>
            {activeCodeTab === 'curl' && curlCode}
            {activeCodeTab === 'python' && pythonCode}
            {activeCodeTab === 'javascript' && jsCode}
          </code>
        </pre>

        {/* Endpoint documentation */}
        <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: '#475569' }}>
          <div style={{ marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#0f172a' }}>POST /api/predict</span> &mdash; Single transaction risk scoring with decision path trace.
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#0f172a' }}>POST /api/batch</span> &mdash; High-throughput batch array evaluation and aggregate metrics.
          </div>
        </div>
      </div>
    </div>
  );
}
