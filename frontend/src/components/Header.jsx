'use client';
import React from 'react';

export default function Header({ threshold, setThreshold }) {
  return (
    <header className="top-header">
      <div className="brand-section">
        {/* Pure Typographic Monogram (Zero Icons) */}
        <div className="brand-monogram">
          AR
        </div>
        <div>
          <div className="brand-name">AegisRisk Enterprise</div>
          <div className="brand-tag">Institutional AML & Fraud Defense Platform &bull; Decision Tree v3.2</div>
        </div>
      </div>

      <div className="header-status-group">
        <div className="status-badge">
          <span className="status-dot" />
          <span>Model Engine Ready (0.6ms)</span>
        </div>

        <div className="status-badge" style={{ fontFamily: 'var(--font-mono)' }}>
          6.36M Trained Samples
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <label htmlFor="threshold-select" style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Sensitivity:</label>
          <select
            id="threshold-select"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#0f172a',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value={0.35}>High (35% threshold)</option>
            <option value={0.5}>Standard (50% threshold)</option>
            <option value={0.65}>Strict (65% threshold)</option>
          </select>
        </div>
      </div>
    </header>
  );
}
