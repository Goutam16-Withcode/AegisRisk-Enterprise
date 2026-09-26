'use client';
import React, { useState } from 'react';
import { evaluateTransaction } from '../lib/fraudEngine';

const BENCHMARK_BATCH = [
  { type: 'TRANSFER', amount: 181000.0, oldBalance: 181000.0, newBalance: 0.0, origId: 'acct_orig_10023', destId: 'acct_dest_99381' },
  { type: 'PAYMENT', amount: 125.40, oldBalance: 4200.0, newBalance: 4074.60, origId: 'acct_orig_10049', destId: 'acct_dest_10293' },
  { type: 'CASH_OUT', amount: 245000.0, oldBalance: 245000.0, newBalance: 0.0, origId: 'acct_orig_88492', destId: 'acct_dest_11928' },
  { type: 'CASH_IN', amount: 4500.0, oldBalance: 12000.0, newBalance: 16500.0, origId: 'acct_orig_99182', destId: 'acct_dest_99281' },
  { type: 'DEBIT', amount: 850.0, oldBalance: 9800.0, newBalance: 8950.0, origId: 'acct_orig_33819', destId: 'acct_dest_44819' },
  { type: 'TRANSFER', amount: 92000.0, oldBalance: 92000.0, newBalance: 0.0, origId: 'acct_orig_44810', destId: 'acct_dest_66719' },
  { type: 'PAYMENT', amount: 2400.0, oldBalance: 15000.0, newBalance: 12600.0, origId: 'acct_orig_22910', destId: 'acct_dest_33918' },
  { type: 'CASH_OUT', amount: 500000.0, oldBalance: 500000.0, newBalance: 0.0, origId: 'acct_orig_77819', destId: 'acct_dest_55192' },
  { type: 'TRANSFER', amount: 15000.0, oldBalance: 320000.0, newBalance: 305000.0, origId: 'acct_orig_55819', destId: 'acct_dest_99819' },
  { type: 'PAYMENT', amount: 35.0, oldBalance: 120.0, newBalance: 85.0, origId: 'acct_orig_11829', destId: 'acct_dest_88192' },
  { type: 'CASH_IN', amount: 10000.0, oldBalance: 5000.0, newBalance: 15000.0, origId: 'acct_orig_99182', destId: 'acct_dest_55819' },
  { type: 'TRANSFER', amount: 350000.0, oldBalance: 350000.0, newBalance: 0.0, origId: 'acct_orig_33910', destId: 'acct_dest_77192' }
];

export default function BatchScanner({ threshold }) {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const processBatch = (rawList) => {
    const evaluated = rawList.map((tx, idx) => {
      const res = evaluateTransaction(tx, { threshold });
      return {
        id: tx.id || `txn_${String(idx + 1).padStart(4, '0')}`,
        ...res
      };
    });
    setItems(evaluated);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) return;

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const parsed = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map((c) => c.trim());
        if (row.length < 4) continue;

        const obj = {};
        headers.forEach((h, colIdx) => {
          obj[h] = row[colIdx];
        });

        parsed.push({
          type: obj.type || 'PAYMENT',
          amount: parseFloat(obj.amount) || 0,
          oldBalance: parseFloat(obj.oldbalanceorg || obj.oldbalance || obj.old_balance) || 0,
          newBalance: parseFloat(obj.newbalanceorig || obj.newbalance || obj.new_balance) || 0,
          origId: obj.nameorig || obj.origid || `acct_${100000 + i}`,
          destId: obj.namedest || obj.destid || `acct_${200000 + i}`
        });
      }

      processBatch(parsed);
    };
    reader.readAsText(file);
  };

  const loadBenchmark = () => {
    processBatch(BENCHMARK_BATCH);
  };

  // Metrics
  const totalCount = items.length;
  const blockedCount = items.filter((i) => i.decision === 'BLOCK').length;
  const reviewCount = items.filter((i) => i.decision === 'REVIEW').length;
  const allowedCount = items.filter((i) => i.decision === 'ALLOW').length;

  const totalExposure = items
    .filter((i) => i.decision === 'BLOCK')
    .reduce((sum, i) => sum + i.features.amount, 0);

  const filteredItems = items.filter((item) => {
    if (filter === 'BLOCK' && item.decision !== 'BLOCK') return false;
    if (filter === 'REVIEW' && item.decision !== 'REVIEW') return false;
    if (filter === 'ALLOW' && item.decision !== 'ALLOW') return false;

    if (search.trim().length > 0) {
      const q = search.toLowerCase();
      const matchType = item.features.channel.toLowerCase().includes(q);
      const matchOrig = item.meta.originId.toLowerCase().includes(q);
      const matchDest = item.meta.destId.toLowerCase().includes(q);
      return matchType || matchOrig || matchDest;
    }
    return true;
  });

  const exportCSV = () => {
    if (items.length === 0) return;
    const header = ['TransactionID,Channel,Amount,OldBalance,NewBalance,OriginID,DestID,RiskScore,Decision,PolicyAction\n'];
    const rows = items.map(
      (it) =>
        `"${it.id}","${it.features.channel}",${it.features.amount},${it.features.oldBalance},${it.features.newBalance},"${it.meta.originId}","${it.meta.destId}",${it.riskScore},"${it.decision}","${it.policyAction}"`
    );
    const blob = new Blob([...header, ...rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch_audit_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Batch Evaluation & File Ingestion</h2>
          <p className="card-description">Asynchronous batch processing and risk classification against Decision Tree model</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" className="btn btn-outline" onClick={loadBenchmark}>
            Load 12 Sample Records
          </button>
          <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
            Upload CSV
            <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* KPI Cards */}
      {items.length > 0 && (
        <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
          <div style={{ padding: '0.85rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>TOTAL PROCESSED</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>{totalCount}</div>
            <div style={{ fontSize: '0.7rem', color: '#475569' }}>100% Ingested</div>
          </div>

          <div style={{ padding: '0.85rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.72rem', color: '#b91c1c', fontWeight: 600 }}>BLOCKED (HIGH RISK)</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#b91c1c', marginTop: '0.15rem' }}>{blockedCount}</div>
            <div style={{ fontSize: '0.7rem', color: '#b91c1c' }}>
              {totalCount > 0 ? ((blockedCount / totalCount) * 100).toFixed(1) : 0}% Incident Rate
            </div>
          </div>

          <div style={{ padding: '0.85rem 1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 600 }}>MANUAL REVIEW</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#b45309', marginTop: '0.15rem' }}>{reviewCount}</div>
            <div style={{ fontSize: '0.7rem', color: '#b45309' }}>Step-up 2FA Required</div>
          </div>

          <div style={{ padding: '0.85rem 1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 600 }}>ALLOWED (CLEARED)</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#15803d', marginTop: '0.15rem' }}>{allowedCount}</div>
            <div style={{ fontSize: '0.7rem', color: '#15803d' }}>
              ${totalExposure.toLocaleString(undefined, { maximumFractionDigits: 0 })} Blocked Capital
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      {items.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {[
              { id: 'ALL', label: `All (${totalCount})` },
              { id: 'BLOCK', label: `Blocked (${blockedCount})` },
              { id: 'REVIEW', label: `Review (${reviewCount})` },
              { id: 'ALLOW', label: `Allowed (${allowedCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`preset-btn ${filter === tab.id ? 'active' : ''}`}
                style={{
                  background: filter === tab.id ? '#0f172a' : '#f8fafc',
                  color: filter === tab.id ? '#ffffff' : '#475569',
                  borderColor: filter === tab.id ? '#0f172a' : '#e2e8f0'
                }}
                onClick={() => setFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              className="form-input"
              style={{ width: '220px', padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
              placeholder="Filter by account or channel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="button" className="btn btn-outline" onClick={exportCSV} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
              Export CSV
            </button>
          </div>
        </div>
      )}

      {/* Results Table */}
      {items.length > 0 ? (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Channel</th>
                <th>Amount</th>
                <th>Origin Balance</th>
                <th>Terminal Balance</th>
                <th>Risk Score</th>
                <th>Decision</th>
                <th>Policy Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#64748b' }}>{item.id}</td>
                  <td>
                    <span style={{ padding: '0.15rem 0.45rem', borderRadius: '4px', background: '#f1f5f9', fontSize: '0.72rem', fontWeight: 600, color: '#334155' }}>
                      {item.features.channel}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>${item.features.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>${item.features.oldBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>${item.features.newBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: item.riskScore >= 70 ? '#b91c1c' : item.riskScore >= 35 ? '#b45309' : '#15803d'
                    }}>
                      {item.riskScore}
                    </span>
                  </td>
                  <td>
                    <span className={`pill ${item.decision === 'BLOCK' ? 'danger' : item.decision === 'REVIEW' ? 'warning' : 'success'}`}>
                      {item.decision}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: '#475569' }}>{item.policyAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
          <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>No batch data loaded</p>
          <p style={{ fontSize: '0.8rem', maxWidth: '380px', margin: '0 auto 1rem auto' }}>
            Upload a CSV containing financial transactions or load the 12 sample records to review batch classification performance.
          </p>
          <button type="button" className="btn btn-outline" onClick={loadBenchmark}>
            Load Sample Records
          </button>
        </div>
      )}
    </div>
  );
}
