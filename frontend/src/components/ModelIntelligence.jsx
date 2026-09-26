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
  const [envMode, setEnvMode] = useState('prod'); // 'prod' or 'local'
  const [copied, setCopied] = useState(false);

  const baseUrl = envMode === 'prod' ? 'https://aegisrisk-enterprise.onrender.com' : 'http://localhost:3000';

  const curlCode = `curl -X POST ${baseUrl}/api/predict \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "TRANSFER",
    "amount": 181000.0,
    "oldBalance": 181000.0,
    "newBalance": 0.0
  }'`;

  const pythonCode = `import requests

url = "${baseUrl}/api/predict"
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

  const jsCode = `const response = await fetch("${baseUrl}/api/predict", {
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
                <td style={{ fontWeight: 600, color: '#64748b' }}>Algorithm Class</td>
                <td>DecisionTreeClassifier (scikit-learn 1.3+)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: '#64748b' }}>Training Corpus</td>
                <td>6,362,620 transactions (PaySim)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: '#64748b' }}>Tree Complexity</td>
                <td>3,025 internal split nodes &bull; max depth 32</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: '#64748b' }}>Inference Latency</td>
                <td>&lt; 0.8ms (Zero GPU required)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: '#64748b' }}>Regulatory Auditing</td>
                <td>Full GDPR Art. 22 & FCRA path transparency</td>
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
            <p className="card-description">Synchronous JSON endpoints for transaction risk routing</p>
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

        {/* Live Cluster Pill & Environment Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0.65rem 0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem' }}>
            <span className="status-dot" style={{ background: '#10b981' }} />
            <span style={{ fontWeight: 700, color: '#0f172a' }}>Target Cluster:</span>
            <a href="https://aegisrisk-enterprise.onrender.com" target="_blank" rel="noreferrer" style={{ color: '#4338ca', fontWeight: 600, textDecoration: 'none' }}>
              {baseUrl}
            </a>
          </div>

          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              type="button"
              className="preset-btn"
              style={{
                fontSize: '0.7rem',
                padding: '0.15rem 0.5rem',
                background: envMode === 'prod' ? '#065f46' : '#ffffff',
                color: envMode === 'prod' ? '#ffffff' : '#475569',
                borderColor: envMode === 'prod' ? '#065f46' : '#cbd5e1'
              }}
              onClick={() => setEnvMode('prod')}
            >
              Cloud Production
            </button>
            <button
              type="button"
              className="preset-btn"
              style={{
                fontSize: '0.7rem',
                padding: '0.15rem 0.5rem',
                background: envMode === 'local' ? '#0f172a' : '#ffffff',
                color: envMode === 'local' ? '#ffffff' : '#475569',
                borderColor: envMode === 'local' ? '#0f172a' : '#cbd5e1'
              }}
              onClick={() => setEnvMode('local')}
            >
              Localhost
            </button>
          </div>
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
