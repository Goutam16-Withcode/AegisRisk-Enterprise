'use client';
import React, { useState } from 'react';
import RiskScoreBar from './RiskScoreBar';
import { PRESET_SCENARIOS, evaluateTransaction } from '../lib/fraudEngine';

export default function SingleInspector({ threshold }) {
  const [formData, setFormData] = useState({
    type: 'TRANSFER',
    amount: 181000.0,
    oldBalance: 181000.0,
    newBalance: 0.0,
    origId: 'acct_orig_102931',
    destId: 'acct_dest_992104'
  });

  const [result, setResult] = useState(() => evaluateTransaction(formData, { threshold }));
  const [showTreePath, setShowTreePath] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const applyPreset = (preset) => {
    const updated = {
      type: preset.type,
      amount: preset.amount,
      oldBalance: preset.oldBalance,
      newBalance: preset.newBalance,
      origId: preset.origId,
      destId: preset.destId
    };
    setFormData(updated);
    setResult(evaluateTransaction(updated, { threshold }));
  };

  const runEvaluation = () => {
    const res = evaluateTransaction(formData, { threshold });
    setResult(res);
  };

  const downloadAuditJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_${result.meta.transactionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Preset Scenarios */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
          Test Scenarios
        </div>
        <div className="presets-group">
          {PRESET_SCENARIOS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              className="preset-btn"
              onClick={() => applyPreset(preset)}
              title={preset.description}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-2">
        {/* Left: Input Form Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Transaction Details</h2>
              <p className="card-description">Specify transaction parameters for real-time model evaluation</p>
            </div>
            <button
              type="button"
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              onClick={() => {
                const sample = PRESET_SCENARIOS[Math.floor(Math.random() * PRESET_SCENARIOS.length)];
                applyPreset(sample);
              }}
            >
              Load Random
            </button>
          </div>

          <div className="form-field">
            <div className="form-label-row">
              <label className="form-label">Payment Channel</label>
              <span className="form-hint">type</span>
            </div>
            <select
              className="form-select"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
            >
              <option value="TRANSFER">TRANSFER (External Wire / P2P Outflow)</option>
              <option value="CASH_OUT">CASH_OUT (ATM / Over-the-Counter Withdrawal)</option>
              <option value="PAYMENT">PAYMENT (Point of Sale Merchant Purchase)</option>
              <option value="CASH_IN">CASH_IN (Account Deposit)</option>
              <option value="DEBIT">DEBIT (Direct Debit Settlement)</option>
            </select>
          </div>

          <div className="form-field">
            <div className="form-label-row">
              <label className="form-label">Transaction Amount ($)</label>
              <span className="form-hint">amount</span>
            </div>
            <input
              type="number"
              className="form-input"
              value={formData.amount}
              min="0"
              step="100"
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="grid-2" style={{ gap: '0.75rem', marginBottom: '0' }}>
            <div className="form-field">
              <div className="form-label-row">
                <label className="form-label">Origin Old Balance ($)</label>
                <span className="form-hint">oldbalanceOrg</span>
              </div>
              <input
                type="number"
                className="form-input"
                value={formData.oldBalance}
                min="0"
                step="100"
                onChange={(e) => handleInputChange('oldBalance', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="form-field">
              <div className="form-label-row">
                <label className="form-label">Origin New Balance ($)</label>
                <span className="form-hint">newbalanceOrig</span>
              </div>
              <input
                type="number"
                className="form-input"
                value={formData.newBalance}
                step="100"
                onChange={(e) => handleInputChange('newBalance', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '0.75rem' }}>
            <div className="form-field">
              <div className="form-label-row">
                <label className="form-label">Origin Account ID</label>
              </div>
              <input
                type="text"
                className="form-input"
                value={formData.origId}
                onChange={(e) => handleInputChange('origId', e.target.value)}
              />
            </div>

            <div className="form-field">
              <div className="form-label-row">
                <label className="form-label">Beneficiary ID</label>
              </div>
              <input
                type="text"
                className="form-input"
                value={formData.destId}
                onChange={(e) => handleInputChange('destId', e.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            onClick={runEvaluation}
          >
            Run Risk Evaluation
          </button>
        </div>

        {/* Right: Evaluation Results Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Evaluation Outcome</h2>
              <p className="card-description">Real-time model prediction, risk score, and ledger integrity</p>
            </div>
            <button
              type="button"
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              onClick={downloadAuditJSON}
            >
              Export JSON
            </button>
          </div>

          {result && (
            <div>
              {/* Verdict Header Banner */}
              <div className={`verdict-box ${result.decision === 'BLOCK' ? 'danger' : result.decision === 'REVIEW' ? 'warning' : 'success'}`}>
                <div>
                  <div className="verdict-heading">
                    {result.decision === 'BLOCK' && 'Transaction Blocked (High Risk)'}
                    {result.decision === 'REVIEW' && 'Manual Review Required'}
                    {result.decision === 'ALLOW' && 'Transaction Cleared (Low Risk)'}
                  </div>
                  <div className="verdict-desc">
                    {result.decision === 'BLOCK' && 'Risk threshold exceeded. Recommended action: halt payment and verify account.'}
                    {result.decision === 'REVIEW' && 'Unusual activity detected. Requires 2FA or analyst review prior to settlement.'}
                    {result.decision === 'ALLOW' && 'No anomalous liquidation patterns detected. Conforms to expected customer flow.'}
                  </div>
                </div>
              </div>

              {/* Risk Score Meter */}
              <RiskScoreBar
                score={result.riskScore}
                tier={result.tier}
                policyAction={result.policyAction}
              />

              {/* Ledger Integrity Breakdown */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Ledger Discrepancy Check
                </div>
                <div className="table-wrapper">
                  <table className="data-table">
                    <tbody>
                      <tr>
                        <td style={{ color: '#64748b' }}>Expected New Balance</td>
                        <td style={{ fontWeight: 600 }}>${result.ledger.expectedNewBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td style={{ color: '#64748b' }}>Reported New Balance</td>
                        <td style={{ fontWeight: 600 }}>${result.ledger.actualNewBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      </tr>
                      <tr>
                        <td style={{ color: '#64748b' }}>Discrepancy (Delta)</td>
                        <td style={{ color: result.ledger.discrepancy > 1 ? '#b91c1c' : '#15803d', fontWeight: 600 }}>
                          ${result.ledger.discrepancy.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ color: '#64748b' }}>Liquidation Ratio</td>
                        <td style={{ fontWeight: 600, color: result.ledger.liquidationRatio >= 95 ? '#b91c1c' : '#0f172a' }}>
                          {result.ledger.liquidationRatio}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Contributing Risk Factors */}
              {result.factors.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Triggered Risk Signals ({result.factors.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {result.factors.map((factor, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '0.65rem 0.85rem',
                          background: factor.severity === 'high' ? 'var(--danger-bg)' : 'var(--warning-bg)',
                          border: `1px solid ${factor.severity === 'high' ? 'var(--danger-border)' : 'var(--warning-border)'}`,
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: factor.severity === 'high' ? 'var(--danger-text)' : 'var(--warning-text)' }}>
                            {factor.label}
                          </span>
                          <span className={`pill ${factor.severity === 'high' ? 'danger' : 'warning'}`}>
                            {factor.code}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem' }}>
                          {factor.detail}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expandable Decision Tree Trace */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    padding: '0.4rem 0'
                  }}
                  onClick={() => setShowTreePath(!showTreePath)}
                >
                  <span>Decision Tree Rule Path ({result.decisionPath.length} Splits)</span>
                  <span style={{ fontSize: '0.75rem', color: '#2563eb' }}>{showTreePath ? 'Hide Details' : 'Show Details'}</span>
                </div>

                {showTreePath && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.4rem' }}>
                    {result.decisionPath.map((step, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.45rem 0.75rem',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          fontSize: '0.78rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', color: '#64748b', fontSize: '0.72rem' }}>#{i + 1}</span>
                          <span style={{ fontWeight: 500, color: '#0f172a' }}>{step.rule}</span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                          Branch: {step.branch}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
