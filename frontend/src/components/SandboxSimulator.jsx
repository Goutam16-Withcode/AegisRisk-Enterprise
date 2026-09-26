'use client';
import React, { useState, useMemo } from 'react';
import RiskScoreBar from './RiskScoreBar';
import { evaluateTransaction, CHANNELS } from '../lib/fraudEngine';

export default function SandboxSimulator({ threshold }) {
  const [type, setType] = useState('TRANSFER');
  const [amount, setAmount] = useState(150000);
  const [oldBalance, setOldBalance] = useState(150000);
  const [newBalance, setNewBalance] = useState(0);
  const [lockMath, setLockMath] = useState(true);

  const handleAmountChange = (val) => {
    setAmount(val);
    if (lockMath) {
      if (type === 'CASH_IN') {
        setNewBalance(oldBalance + val);
      } else {
        setNewBalance(Math.max(0, oldBalance - val));
      }
    }
  };

  const handleOldBalanceChange = (val) => {
    setOldBalance(val);
    if (lockMath) {
      if (type === 'CASH_IN') {
        setNewBalance(val + amount);
      } else {
        setNewBalance(Math.max(0, val - amount));
      }
    }
  };

  const result = useMemo(() => {
    return evaluateTransaction(
      { type, amount, oldBalance, newBalance },
      { threshold }
    );
  }, [type, amount, oldBalance, newBalance, threshold]);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Scenario Simulation Sandbox</h2>
          <p className="card-description">
            Adjust transaction parameters to test model sensitivity and observe tipping-point thresholds
          </p>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.78rem', color: '#475569' }}>
          <input
            type="checkbox"
            checked={lockMath}
            onChange={(e) => setLockMath(e.target.checked)}
          />
          <span>Synchronize Ledger Math (Terminal = Origin - Amount)</span>
        </label>
      </div>

      <div className="grid-2" style={{ gap: '2rem' }}>
        {/* Left Column: Sliders */}
        <div>
          {/* Channel selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
              Payment Channel
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {Object.keys(CHANNELS).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  className="preset-btn"
                  style={{
                    background: type === ch ? '#0f172a' : '#f8fafc',
                    color: type === ch ? '#ffffff' : '#475569',
                    borderColor: type === ch ? '#0f172a' : '#e2e8f0'
                  }}
                  onClick={() => setType(ch)}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Slider */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>Transaction Amount</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                ${amount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1000000"
              step="5000"
              value={amount}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#0f172a', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
              <span>$0</span>
              <span>$500,000</span>
              <span>$1,000,000</span>
            </div>
          </div>

          {/* Old Balance Slider */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>Origin Old Balance</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                ${oldBalance.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2000000"
              step="10000"
              value={oldBalance}
              onChange={(e) => handleOldBalanceChange(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#0f172a', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
              <span>$0</span>
              <span>$1,000,000</span>
              <span>$2,000,000</span>
            </div>
          </div>

          {/* New Balance Slider */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>
                Origin Terminal Balance {lockMath ? '(Calculated)' : ''}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: newBalance === 0 ? '#b91c1c' : '#0f172a' }}>
                ${newBalance.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2000000"
              step="10000"
              value={newBalance}
              disabled={lockMath}
              onChange={(e) => setNewBalance(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#0f172a', cursor: lockMath ? 'not-allowed' : 'pointer', opacity: lockMath ? 0.6 : 1 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
              <span>$0 (Depleted)</span>
              <span>$1,000,000</span>
              <span>$2,000,000</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Verdict */}
        <div>
          <div className={`verdict-box ${result.decision === 'BLOCK' ? 'danger' : result.decision === 'REVIEW' ? 'warning' : 'success'}`} style={{ marginBottom: '1rem' }}>
            <div>
              <div className="verdict-heading">
                {result.decision === 'BLOCK' && 'Simulated Outcome: Blocked (High Risk)'}
                {result.decision === 'REVIEW' && 'Simulated Outcome: Step-Up Verification'}
                {result.decision === 'ALLOW' && 'Simulated Outcome: Cleared (Normal Risk)'}
              </div>
              <div className="verdict-desc">
                {result.decision === 'BLOCK' && 'Parameter combination triggers liquidation and high-risk channel rules.'}
                {result.decision === 'REVIEW' && 'Elevated probability score; requires secondary authentication factor.'}
                {result.decision === 'ALLOW' && 'Parameters fall within standard non-anomalous distribution bounds.'}
              </div>
            </div>
          </div>

          <RiskScoreBar
            score={result.riskScore}
            tier={result.tier}
            policyAction={result.policyAction}
          />

          {/* Ledger analysis */}
          <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Parameter Sensitivity Breakdown
            </div>
            <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Balance Liquidation Ratio:</span>
                <strong style={{ color: result.ledger.liquidationRatio >= 95 ? '#b91c1c' : '#15803d' }}>
                  {result.ledger.liquidationRatio}%
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Account Drained to $0.00:</span>
                <strong style={{ color: newBalance === 0 && oldBalance > 0 ? '#b91c1c' : '#15803d' }}>
                  {newBalance === 0 && oldBalance > 0 ? 'Yes (High Correlation)' : 'No'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Payment Channel Baseline Risk:</span>
                <strong style={{ color: type === 'TRANSFER' || type === 'CASH_OUT' ? '#b45309' : '#15803d' }}>
                  {type === 'TRANSFER' || type === 'CASH_OUT' ? 'Elevated Channel Rail' : 'Low Vulnerability Rail'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
