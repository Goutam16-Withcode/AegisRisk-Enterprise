'use client';
import React from 'react';

export default function RiskScoreBar({ score = 0, tier = 'low', policyAction = 'Authorize' }) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  let label = 'Low Risk';
  let badgeClass = 'success';

  if (clampedScore >= 70) {
    label = 'High Risk';
    badgeClass = 'danger';
  } else if (clampedScore >= 35) {
    label = 'Elevated Risk';
    badgeClass = 'warning';
  }

  return (
    <div className="risk-meter">
      <div className="risk-meter-header">
        <div>
          <div className="risk-meter-title">Risk Assessment</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
            <span className={`pill ${badgeClass}`}>{label}</span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Policy: {policyAction}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="risk-meter-score">{clampedScore} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>/ 100</span></div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Calculated Score</div>
        </div>
      </div>

      {/* Segmented Track */}
      <div className="risk-meter-track">
        <div className="track-segment-low" title="Normal risk: 0 - 34" />
        <div className="track-segment-mid" title="Elevated risk: 35 - 69" />
        <div className="track-segment-high" title="High risk: 70 - 100" />
      </div>

      {/* Needle Pointer */}
      <div className="risk-pointer-bar">
        <div
          className="risk-pointer-pin"
          style={{ left: `${clampedScore}%` }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>
        <span>0 (Safe)</span>
        <span>35</span>
        <span>70</span>
        <span>100 (Fraudulent)</span>
      </div>
    </div>
  );
}
