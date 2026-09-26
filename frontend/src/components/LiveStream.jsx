'use client';
import React, { useState, useEffect, useRef } from 'react';
import { evaluateTransaction } from '../lib/fraudEngine';

const CHANNELS = ['TRANSFER', 'PAYMENT', 'CASH_OUT', 'CASH_IN', 'DEBIT'];

function generateSyntheticTx() {
  const isSuspicious = Math.random() < 0.22;
  const type = isSuspicious 
    ? (Math.random() < 0.5 ? 'TRANSFER' : 'CASH_OUT') 
    : CHANNELS[Math.floor(Math.random() * CHANNELS.length)];

  let amount = 0;
  let oldBalance = 0;
  let newBalance = 0;

  if (isSuspicious) {
    amount = Math.round(15000 + Math.random() * 200000);
    oldBalance = amount;
    newBalance = 0; // drain pattern
  } else {
    oldBalance = Math.round(1000 + Math.random() * 45000);
    amount = Math.round(15 + Math.random() * (oldBalance * 0.35));
    newBalance = Math.max(0, oldBalance - amount);
  }

  return {
    type,
    amount,
    oldBalance,
    newBalance,
    origId: 'acct_' + Math.floor(100000 + Math.random() * 900000),
    destId: (type === 'PAYMENT' ? 'merch_' : 'acct_') + Math.floor(100000 + Math.random() * 900000)
  };
}

export default function LiveStream({ threshold }) {
  const [events, setEvents] = useState([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [stats, setStats] = useState({ total: 0, blocked: 0, review: 0, allowed: 0, totalAmount: 0 });
  const intervalRef = useRef(null);

  const ingestTx = (txData = null) => {
    const raw = txData || generateSyntheticTx();
    const evaluated = evaluateTransaction(raw, { threshold });
    const item = {
      ...evaluated,
      timeString: new Date().toLocaleTimeString([], { hour12: false })
    };

    setEvents((prev) => [item, ...prev].slice(0, 25));
    setStats((prev) => ({
      total: prev.total + 1,
      blocked: prev.blocked + (item.decision === 'BLOCK' ? 1 : 0),
      review: prev.review + (item.decision === 'REVIEW' ? 1 : 0),
      allowed: prev.allowed + (item.decision === 'ALLOW' ? 1 : 0),
      totalAmount: prev.totalAmount + item.features.amount
    }));
  };

  useEffect(() => {
    if (isStreaming) {
      intervalRef.current = setInterval(() => {
        ingestTx();
      }, 1600);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isStreaming, threshold]);

  const simulateAttack = () => {
    ingestTx({
      type: 'TRANSFER',
      amount: 480000.0,
      oldBalance: 480000.0,
      newBalance: 0.0,
      origId: 'acct_flagged_88',
      destId: 'acct_dest_992'
    });
  };

  const clearFeed = () => {
    setEvents([]);
    setStats({ total: 0, blocked: 0, review: 0, allowed: 0, totalAmount: 0 });
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Live Transaction Event Stream</h2>
          <p className="card-description">
            Simulated payment gateway event pipe evaluated against Decision Tree rules in real time
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
            onClick={() => setIsStreaming(!isStreaming)}
          >
            {isStreaming ? 'Pause Stream' : 'Resume Stream'}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem', color: '#b91c1c' }}
            onClick={simulateAttack}
          >
            Simulate Attack Event
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
            onClick={clearFeed}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Aggregate stream metrics */}
      <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
        <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>EVENTS INGESTED</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{stats.total}</div>
        </div>
        <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.72rem', color: '#b91c1c', fontWeight: 600 }}>BLOCKED (FRAUD)</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#b91c1c' }}>{stats.blocked}</div>
        </div>
        <div style={{ padding: '0.75rem 1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 600 }}>REVIEW REQUIRED</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#b45309' }}>{stats.review}</div>
        </div>
        <div style={{ padding: '0.75rem 1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 600 }}>ALLOWED (CLEARED)</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#15803d' }}>{stats.allowed}</div>
        </div>
      </div>

      {/* Event table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Channel</th>
              <th>Amount</th>
              <th>Origin Account</th>
              <th>Beneficiary</th>
              <th>Risk Score</th>
              <th>Outcome</th>
              <th>Action Policy</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev, idx) => (
              <tr key={idx}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b' }}>{ev.timeString}</td>
                <td>
                  <span style={{ padding: '0.15rem 0.45rem', borderRadius: '4px', background: '#f1f5f9', fontSize: '0.72rem', fontWeight: 600, color: '#334155' }}>
                    {ev.features.channel}
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${ev.features.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b' }}>{ev.meta.originId}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b' }}>{ev.meta.destId}</td>
                <td>
                  <span style={{
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: ev.riskScore >= 70 ? '#b91c1c' : ev.riskScore >= 35 ? '#b45309' : '#15803d'
                  }}>
                    {ev.riskScore}
                  </span>
                </td>
                <td>
                  <span className={`pill ${ev.decision === 'BLOCK' ? 'danger' : ev.decision === 'REVIEW' ? 'warning' : 'success'}`}>
                    {ev.decision}
                  </span>
                </td>
                <td style={{ fontSize: '0.75rem', color: '#475569' }}>{ev.policyAction}</td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  Initializing event pipe. Streamed transactions will populate automatically...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
