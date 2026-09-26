'use client';
import React, { useState, useEffect } from 'react';

const SUGGESTED_QUERIES = [
  'What is "Financial Condition" and how do Liquidity/LCR ratios connect to fraud risks?',
  'What patterns in the 6.36M PaySim dataset indicate high-risk wire transfers?',
  'Explain the Account Liquidation Drain signature and how to detect it.',
  'What are the mandatory SAR filing criteria for suspected structuring under the Bank Secrecy Act?',
  'How does ledger balance discrepancy indicate internal tampering or gateway race conditions?'
];

export default function FinancialRagAdvisor() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchAdvice = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const json = await res.json();
      if (json.status === 'success') {
        setResult(json.data);
      }
    } catch (e) {
      console.error('Advisor fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice(SUGGESTED_QUERIES[0]);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAdvice(query);
  };

  const handlePreset = (text) => {
    setQuery(text);
    fetchAdvice(text);
  };

  const handleCopy = () => {
    if (!result?.answer) return;
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Typographic Monogram (Zero Icons) */}
          <div className="bot-monogram">
            AI
          </div>
          <div>
            <h2 className="card-title">Financial & Regulatory Copilot</h2>
            <p className="card-description">
              RAG intelligence assistant trained on the 6.36M transaction dataset, GAAP/IFRS standards, and Groq LLM inference
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="status-badge" style={{ background: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' }}>
            <span className="status-dot" style={{ background: '#2563eb' }} />
            <span>Groq LLM Active ({result?.modelUsed || 'Connecting...'})</span>
          </span>

          {result && (
            <button
              type="button"
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Copy Advice'}
            </button>
          )}
        </div>
      </div>

      {/* Preset Queries */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
          Suggested Financial & Regulatory Queries
        </div>
        <div className="presets-group">
          {SUGGESTED_QUERIES.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="preset-btn"
              onClick={() => handlePreset(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Query Search Form */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          className="form-input"
          style={{ flex: 1 }}
          placeholder="Ask about financial condition, LCR liquidity ratios, fraud patterns, or AML regulations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-accent"
          style={{ padding: '0.55rem 1.25rem' }}
          disabled={loading}
        >
          {loading ? 'Retrieving & Generating...' : 'Ask Copilot'}
        </button>
      </form>

      {/* RAG Results Grid */}
      {result && (
        <div className="grid-2" style={{ gap: '1.5rem' }}>
          {/* Left Column: Retrieved Knowledge Documents */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Retrieved Dataset & Regulatory Chunks ({result.retrievedSources?.length || 0})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {result.retrievedSources?.map((doc, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.9rem 1.1rem',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    borderLeft: '3px solid #4338ca'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                      {doc.title}
                    </span>
                    <span className="pill indigo">{doc.category}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.35rem' }}>
                    <strong>Authoritative Regulatory References:</strong>
                    <div style={{ marginTop: '0.2rem', color: '#334155' }}>
                      {doc.references?.join(' • ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.25rem', padding: '0.9rem 1.1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', fontSize: '0.75rem', color: '#1e40af' }}>
              <strong>Knowledge Index:</strong> Financial condition metrics (LCR, CET1, NSFR), PaySim 6.36M transaction empirical distributions, and banking compliance protocols (GAAP/IFRS, FinCEN, BSA).
            </div>
          </div>

          {/* Right Column: Generated Advice */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Synthesized Expert Guidance (Groq LLaMA / GPT-120B)
            </div>

            <div
              className="bot-dialogue-card"
              style={{
                maxHeight: '480px',
                overflowY: 'auto'
              }}
            >
              {loading ? (
                <div style={{ color: '#64748b', padding: '2.5rem 1rem', textAlign: 'center' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>Retrieving Knowledge & Synthesizing Guidance...</div>
                  <div style={{ fontSize: '0.75rem' }}>Querying Groq inference engine with retrieved dataset and regulatory context</div>
                </div>
              ) : (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {result.answer}
                </div>
              )}

              {result.references && result.references.length > 0 && !loading && (
                <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9', fontSize: '0.72rem', color: '#64748b' }}>
                  <strong>Authoritative Regulatory References:</strong>
                  <ul style={{ paddingLeft: '1.25rem', marginTop: '0.3rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {result.references.map((ref, i) => (
                      <li key={i} style={{ color: '#334155' }}>{ref}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
