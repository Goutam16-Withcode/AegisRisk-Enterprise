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

  // 2. Separate Authoritative Regulatory References & Strictly Deduplicate
  let references = [];
  const refIndex = remaining.indexOf('Authoritative Regulatory References:');
  if (refIndex !== -1) {
    const refText = remaining.slice(refIndex + 'Authoritative Regulatory References:'.length).trim();
    remaining = remaining.slice(0, refIndex).replace(/---\s*$/, '').trim();
    const rawRefs = refText
      .split('\n')
      .map((r) => r.trim().replace(/^[-*•]\s*/, ''))
      .filter((r) => r && !r.toLowerCase().includes('authoritative regulatory'));
    references = Array.from(new Set(rawRefs));
  }

  // 3. Parse remaining blocks: headings, math, tables, paragraphs, metric bullet points
  const blocks = [];
  const lines = remaining.split('\n');
  let currentTable = null;
  let currentParagraph = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const pText = currentParagraph.join('\n').trim();
      // Check if paragraph is purely math equation
      if (pText.startsWith('$$') && pText.endsWith('$$')) {
        blocks.push({ type: 'math', formula: pText.slice(2, -2).trim() });
      } else {
        blocks.push({ type: 'paragraph', content: pText });
      }
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
    } else if (line.startsWith('$$') && line.endsWith('$$') && line.length > 4) {
      flushParagraph();
      flushTable();
      blocks.push({
        type: 'math',
        formula: line.slice(2, -2).trim()
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
                fontSize: block.level === 2 ? '1.1rem' : '0.96rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.3px',
                paddingBottom: '0.35rem',
                borderBottom: '1px solid #f1f5f9',
                marginTop: '0.5rem'
              }}
            >
              {block.text}
            </div>
          );
        }

        if (block.type === 'math') {
          return (
            <div
              key={bIdx}
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderLeft: '4px solid #4f46e5',
                borderRadius: '8px',
                padding: '0.85rem 1.15rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: '#1e293b',
                overflowX: 'auto',
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.02)'
              }}
            >
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', fontWeight: 700, marginBottom: '0.25rem' }}>
                Mathematical Formulation & Objective
              </div>
              <code style={{ color: '#312e81', fontWeight: 600 }}>{block.formula}</code>
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
                          padding: '0.8rem 1rem',
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
                          // First Column: Step or Segment
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

                          // Second Column: Nominal Allocation / Target metrics
                          if (cIdx === 1 && (cell.includes('₹') || cell.includes('%') || cell.includes('•'))) {
                            if (cell.includes('₹') || cell.includes('%')) {
                              return (
                                <td
                                  key={cIdx}
                                  style={{
                                    padding: '0.85rem 1rem',
                                    verticalAlign: 'top',
                                    borderRight: '1px solid #f1f5f9',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      padding: '0.25rem 0.6rem',
                                      borderRadius: '6px',
                                      background: '#ecfdf5',
                                      color: '#065f46',
                                      border: '1px solid #a7f3d0',
                                      fontWeight: 800,
                                      fontSize: '0.78rem'
                                    }}
                                  >
                                    {cell.replace(/\*\*/g, '')}
                                  </span>
                                </td>
                              );
                            }

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

                          // Last column (Regulatory & Risk Invariant)
                          const isLastCol = cIdx === row.length - 1;

                          return (
                            <td
                              key={cIdx}
                              style={{
                                padding: '0.85rem 1rem',
                                verticalAlign: 'top',
                                borderRight: !isLastCol ? '1px solid #f1f5f9' : 'none',
                                color: isLastCol ? '#475569' : '#334155',
                                fontSize: '0.78rem',
                                lineHeight: 1.55,
                                background: isLastCol ? 'rgba(248, 250, 252, 0.45)' : 'transparent'
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
          // If paragraph has bullet points of key metrics
          const isBulletList = block.content.includes('- **') || block.content.includes('•');
          if (isBulletList) {
            const items = block.content.split('\n').filter(Boolean);
            return (
              <div
                key={bIdx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '0.65rem'
                }}
              >
                {items.map((it, iIdx) => (
                  <div
                    key={iIdx}
                    style={{
                      padding: '0.65rem 0.85rem',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      color: '#334155',
                      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.02)'
                    }}
                  >
                    {formatBoldText(it.replace(/^[-*•]\s*/, ''))}
                  </div>
                ))}
              </div>
            );
          }

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

      {/* Authoritative Regulatory References Block */}
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
      console.error('Quant advisor fetch error:', e);
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
          {/* Pure Typographic Monogram (Zero Icons) */}
          <div className="bot-monogram">
            QI
          </div>
          <div>
            <h2 className="card-title">Autonomous Quant & Regulatory Copilot</h2>
            <p className="card-description">
              Quantitative risk engineering, portfolio optimization models, and regulatory telemetry over 6.36M PaySim records
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="status-badge" style={{ background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}>
            <span className="status-dot" style={{ background: '#10b981' }} />
            <span>Quant Policy Core Active</span>
          </span>

          {result && (
            <button
              type="button"
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Copy Analysis'}
            </button>
          )}
        </div>
      </div>

      {/* Preset Queries */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.45rem' }}>
          Quantitative & Regulatory Telemetry Presets
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
          placeholder="Ask about quantitative capital deployment (₹1M), risk modeling, empirical fraud proofs, or AML regulations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-accent"
          style={{ padding: '0.55rem 1.25rem' }}
          disabled={loading}
        >
          {loading ? 'Synthesizing Quant Proofs...' : 'Evaluate Query'}
        </button>
      </form>

      {/* RAG Results Grid */}
      {result && (
        <div className="grid-2" style={{ gap: '1.65rem' }}>
          {/* Left Column: Retrieved Knowledge Documents */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.55rem' }}>
              Indexed Regulatory & Quantitative Chunks ({result.retrievedSources?.length || 0})
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
              <strong>Quantitative Telemetry Index:</strong> Mean-variance efficient frontier vectors, liquidity coverage buffers (LCR &ge; 100%), 6.36M empirical PaySim distributions, and ledger discrepancy invariants (&Delta;ledger = 0).
            </div>
          </div>

          {/* Right Column: Generated Advice */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.55rem' }}>
              Quantitative Research Guidance & Decision Matrix
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
                  <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Computing Optimization Parameters & Telemetry Verification...</div>
                  <div style={{ fontSize: '0.75rem' }}>Evaluating Sharpe ratio, tail-risk bounds, and double-entry ledger invariants</div>
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
