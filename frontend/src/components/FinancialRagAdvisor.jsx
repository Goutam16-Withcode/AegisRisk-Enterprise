'use client';
import React, { useState, useEffect } from 'react';

const SUGGESTED_QUERIES = [
  'How to think about deploying ₹1 million (≈ $12,000 USD)?',
  'What is "Financial Condition" and how do Liquidity/LCR ratios connect to fraud risks?',
  'What patterns in the 6.36M PaySim dataset indicate high-risk wire transfers?',
  'Explain the Account Liquidation Drain signature and how to detect it.',
  'What are the mandatory SAR filing criteria for suspected structuring under the Bank Secrecy Act?'
];

function formatBoldText(text) {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ color: '#0f172a', fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function FormattedAnswer({ text }) {
  if (!text) return null;

  // 1. Separate Disclaimer
  let disclaimer = null;
  let remaining = text;

  const disclaimerRegex = /\*\*Important Disclaimer\*\*([\s\S]*?)(?=\n---\n|\n## |\n\|)/i;
  const disclaimerMatch = remaining.match(disclaimerRegex);
  if (disclaimerMatch) {
    disclaimer = disclaimerMatch[1].trim();
    remaining = remaining.replace(disclaimerMatch[0], '').replace(/^\s*---\s*/m, '').trim();
  }

  // 2. Separate Authoritative Regulatory References
  let references = [];
  const refIndex = remaining.indexOf('Authoritative Regulatory References:');
  if (refIndex !== -1) {
    const refText = remaining.slice(refIndex + 'Authoritative Regulatory References:'.length).trim();
    remaining = remaining.slice(0, refIndex).replace(/---\s*$/, '').trim();
    references = refText
      .split('\n')
      .map((r) => r.trim().replace(/^[-*•]\s*/, ''))
      .filter(Boolean);
  }

  // 3. Parse remaining blocks: headings, tables, paragraphs
  const blocks = [];
  const lines = remaining.split('\n');
  let currentTable = null;
  let currentParagraph = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({ type: 'paragraph', content: currentParagraph.join('\n').trim() });
      currentParagraph = [];
    }
  };

  const flushTable = () => {
    if (currentTable) {
      blocks.push(currentTable);
      currentTable = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('## ') || line.startsWith('### ')) {
      flushParagraph();
      flushTable();
      blocks.push({
        type: 'heading',
        level: line.startsWith('## ') ? 2 : 3,
        text: line.replace(/^#{2,3}\s+/, '')
      });
    } else if (line.startsWith('|') && line.endsWith('|')) {
      flushParagraph();
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());

      const isDelimiter = cells.every((c) => /^[-:\s]+$/.test(c));
      if (isDelimiter) {
        continue;
      }

      if (!currentTable) {
        currentTable = {
          type: 'table',
          headers: cells,
          rows: []
        };
      } else {
        currentTable.rows.push(cells);
      }
    } else if (line === '---') {
      flushParagraph();
      flushTable();
    } else if (line.length === 0) {
      flushParagraph();
      flushTable();
    } else {
      if (currentTable) {
        flushTable();
      }
      currentParagraph.push(line);
    }
  }

  flushParagraph();
  flushTable();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Disclaimer Box */}
      {disclaimer && (
        <div
          style={{
            background: '#fffdfa',
            border: '1px solid #fed7aa',
            borderLeft: '4px solid #f97316',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            boxShadow: '0 1px 3px rgba(249, 115, 22, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: '#c2410c',
                background: '#ffedd5',
                padding: '0.18rem 0.55rem',
                borderRadius: '4px'
              }}
            >
              Important Regulatory Disclaimer
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.6 }}>
            {disclaimer}
          </div>
        </div>
      )}

      {/* Main Blocks */}
      {blocks.map((block, bIdx) => {
        if (block.type === 'heading') {
          return (
            <div
              key={bIdx}
              style={{
                fontSize: block.level === 2 ? '1.08rem' : '0.96rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.3px',
                paddingBottom: '0.35rem',
                borderBottom: '1px solid #f1f5f9'
              }}
            >
              {block.text}
            </div>
          );
        }

        if (block.type === 'table') {
          return (
            <div
              key={bIdx}
              style={{
                overflowX: 'auto',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
                background: '#ffffff'
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {block.headers.map((h, hIdx) => (
                      <th
                        key={hIdx}
                        style={{
                          padding: '0.75rem 1rem',
                          color: '#475569',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.4px',
                          borderRight: hIdx < block.headers.length - 1 ? '1px solid #f1f5f9' : 'none'
                        }}
                      >
                        {h.replace(/\*\*/g, '')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rIdx) => {
                    const isEven = rIdx % 2 === 0;
                    return (
                      <tr
                        key={rIdx}
                        style={{
                          background: isEven ? '#ffffff' : '#fcfcfd',
                          borderBottom: rIdx < block.rows.length - 1 ? '1px solid #f1f5f9' : 'none',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        {row.map((cell, cIdx) => {
                          if (cIdx === 0) {
                            const stepMatch = cell.match(/\*\*([A-F0-9\.\s]+)\*\*(.*)/);
                            const cleanCell = cell.replace(/\*\*/g, '');
                            return (
                              <td
                                key={cIdx}
                                style={{
                                  padding: '0.85rem 1rem',
                                  verticalAlign: 'top',
                                  borderRight: '1px solid #f1f5f9',
                                  minWidth: '180px'
                                }}
                              >
                                <span
                                  style={{
                                    display: 'inline-block',
                                    fontSize: '0.73rem',
                                    fontWeight: 800,
                                    color: '#4338ca',
                                    background: '#eef2ff',
                                    border: '1px solid #c7d2fe',
                                    padding: '0.2rem 0.55rem',
                                    borderRadius: '5px',
                                    marginBottom: '0.35rem'
                                  }}
                                >
                                  {stepMatch ? stepMatch[1].trim() : cleanCell.split(' ')[0]}
                                </span>
                                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8rem', lineHeight: 1.35 }}>
                                  {stepMatch ? stepMatch[2].trim() : cleanCell}
                                </div>
                              </td>
                            );
                          }

                          if (cIdx === 1) {
                            const bullets = cell
                              .split(/<br\s*\/?>|\n|•/)
                              .map((b) => b.trim())
                              .filter(Boolean);

                            return (
                              <td
                                key={cIdx}
                                style={{
                                  padding: '0.85rem 1rem',
                                  verticalAlign: 'top',
                                  borderRight: '1px solid #f1f5f9',
                                  color: '#334155',
                                  lineHeight: 1.55
                                }}
                              >
                                {bullets.length > 1 ? (
                                  <ul style={{ paddingLeft: '1rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    {bullets.map((b, i) => (
                                      <li key={i} style={{ color: '#334155' }}>
                                        {formatBoldText(b)}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <div>{formatBoldText(cell)}</div>
                                )}
                              </td>
                            );
                          }

                          return (
                            <td
                              key={cIdx}
                              style={{
                                padding: '0.85rem 1rem',
                                verticalAlign: 'top',
                                color: '#475569',
                                fontSize: '0.78rem',
                                lineHeight: 1.55,
                                background: 'rgba(248, 250, 252, 0.45)'
                              }}
                            >
                              {formatBoldText(cell)}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <div
              key={bIdx}
              style={{
                fontSize: '0.82rem',
                color: '#334155',
                lineHeight: 1.65,
                whiteSpace: 'pre-wrap'
              }}
            >
              {formatBoldText(block.content)}
            </div>
          );
        }

        return null;
      })}

      {/* Authoritative References Block */}
      {references.length > 0 && (
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            marginTop: '0.5rem'
          }}
        >
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.65rem' }}>
            Authoritative Regulatory References
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {references.map((ref, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#334155',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '5px',
                  padding: '0.25rem 0.6rem',
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.02)'
                }}
              >
                {ref}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
            RC
          </div>
          <div>
            <h2 className="card-title">Autonomous Regulatory & Risk Copilot</h2>
            <p className="card-description">
              Institutional RAG intelligence engine indexed on 6.36M PaySim telemetry, GAAP/IFRS standards, and FinCEN / FATF mandates
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="status-badge" style={{ background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}>
            <span className="status-dot" style={{ background: '#10b981' }} />
            <span>Regulatory Policy Engine Active</span>
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
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.45rem' }}>
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
          placeholder="Ask about deploying capital, financial condition, fraud patterns, or AML regulations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-accent"
          style={{ padding: '0.55rem 1.25rem' }}
          disabled={loading}
        >
          {loading ? 'Analyzing Directives...' : 'Query Copilot'}
        </button>
      </form>

      {/* RAG Results Grid */}
      {result && (
        <div className="grid-2" style={{ gap: '1.65rem' }}>
          {/* Left Column: Retrieved Knowledge Documents */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.55rem' }}>
              Retrieved Dataset & Regulatory Chunks ({result.retrievedSources?.length || 0})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {result.retrievedSources?.map((doc, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.95rem 1.15rem',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    borderLeft: '3px solid #4338ca',
                    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                      {doc.title}
                    </span>
                    <span className="pill indigo">{doc.category}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.35rem', lineHeight: 1.5 }}>
                    <strong style={{ color: '#475569' }}>Authoritative Regulatory References:</strong>
                    <div style={{ marginTop: '0.2rem', color: '#334155' }}>
                      {doc.references?.join(' • ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.25rem', padding: '0.95rem 1.15rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', fontSize: '0.75rem', color: '#1e40af', lineHeight: 1.55 }}>
              <strong>Knowledge Index:</strong> Financial condition metrics (LCR, CET1, NSFR), PaySim 6.36M transaction empirical distributions, and banking compliance protocols (GAAP/IFRS, FinCEN, BSA).
            </div>
          </div>

          {/* Right Column: Generated Advice */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.55rem' }}>
              Autonomous Regulatory Assessment & Capital Strategy
            </div>

            <div
              className="bot-dialogue-card"
              style={{
                maxHeight: '620px',
                overflowY: 'auto'
              }}
            >
              {loading ? (
                <div style={{ color: '#64748b', padding: '2.5rem 1rem', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Synthesizing Regulatory Directives & Empirical Telemetry...</div>
                  <div style={{ fontSize: '0.75rem' }}>Evaluating Basel III capital adequacy, core banking ledger rules, and telemetry context</div>
                </div>
              ) : (
                <FormattedAnswer text={result.answer} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
