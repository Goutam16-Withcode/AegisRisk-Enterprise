'use client';
import React, { useState } from 'react';
import Header from '../components/Header';
import SingleInspector from '../components/SingleInspector';
import BatchScanner from '../components/BatchScanner';
import SandboxSimulator from '../components/SandboxSimulator';
import LiveStream from '../components/LiveStream';
import FinancialRagAdvisor from '../components/FinancialRagAdvisor';
import ModelExplanation from '../components/ModelExplanation';
import ModelIntelligence from '../components/ModelIntelligence';

export default function Home() {
  const [activeTab, setActiveTab] = useState('single');
  const [threshold, setThreshold] = useState(0.5);

  const tabs = [
    { id: 'single', label: 'Overview & Inspector' },
    { id: 'batch', label: 'Batch Processing' },
    { id: 'sandbox', label: 'Scenario Sandbox' },
    { id: 'stream', label: 'Event Stream' },
    { id: 'advisor', label: 'Financial Advisor (RAG)' },
    { id: 'explain', label: 'Model ML Explained' },
    { id: 'intelligence', label: 'API & Governance' }
  ];

  return (
    <div className="app-container">
      {/* Top Application Header */}
      <Header threshold={threshold} setThreshold={setThreshold} />

      {/* Clean Segmented Navigation Tabs */}
      <nav className="nav-tabs" aria-label="Module Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`nav-tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Tab View */}
      <main>
        {activeTab === 'single' && <SingleInspector threshold={threshold} />}
        {activeTab === 'batch' && <BatchScanner threshold={threshold} />}
        {activeTab === 'sandbox' && <SandboxSimulator threshold={threshold} />}
        {activeTab === 'stream' && <LiveStream threshold={threshold} />}
        {activeTab === 'advisor' && <FinancialRagAdvisor />}
        {activeTab === 'explain' && <ModelExplanation />}
        {activeTab === 'intelligence' && <ModelIntelligence />}
      </main>

      {/* Clean Footer */}
      <footer style={{ marginTop: '3rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.75rem' }}>
        <div>
          Fraud Risk Platform &bull; Scikit-Learn DecisionTree v3.2 &bull; Next.js 16
        </div>
        <div>
          Trained on 6,362,620 transactions &bull; Local zero-telemetry evaluation
        </div>
      </footer>
    </div>
  );
}
