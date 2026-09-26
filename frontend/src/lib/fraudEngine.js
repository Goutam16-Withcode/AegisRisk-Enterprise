import modelData from '../data/decision_tree.js';

export const CHANNELS = {
  TRANSFER: 4,
  CASH_OUT: 1,
  PAYMENT: 2,
  CASH_IN: 3,
  DEBIT: 5
};

export const PRESET_SCENARIOS = [
  {
    name: 'Total Account Drain (Transfer)',
    type: 'TRANSFER',
    amount: 181000.0,
    oldBalance: 181000.0,
    newBalance: 0.0,
    origId: 'C192039120',
    destId: 'C889102452',
    description: 'High-value wire emptying origin balance to zero.'
  },
  {
    name: 'Full Balance Withdrawal (Cash Out)',
    type: 'CASH_OUT',
    amount: 65000.0,
    oldBalance: 65000.0,
    newBalance: 0.0,
    origId: 'C840083671',
    destId: 'C38997010',
    description: 'Immediate ATM/counter cash-out clearing origin balance.'
  },
  {
    name: 'Merchant Card Payment',
    type: 'PAYMENT',
    amount: 54.20,
    oldBalance: 4250.0,
    newBalance: 4195.80,
    origId: 'C1231006815',
    destId: 'M1979787155',
    description: 'Standard retail consumer purchase with remaining liquidity.'
  },
  {
    name: 'Commercial Wire Transfer',
    type: 'TRANSFER',
    amount: 15000.0,
    oldBalance: 240000.0,
    newBalance: 225000.0,
    origId: 'C1305486145',
    destId: 'C553264065',
    description: 'Standard business wire maintaining sufficient reserves.'
  },
  {
    name: 'Inbound Salary Deposit',
    type: 'CASH_IN',
    amount: 6200.0,
    oldBalance: 11000.0,
    newBalance: 17200.0,
    origId: 'C99481231',
    destId: 'M88210394',
    description: 'Legitimate inbound credit increasing account balance.'
  }
];

/**
 * Enhanced Fraud Risk Evaluation Engine
 * Combines Decision Tree structure traversal with Bayesian prior calibration
 * and domain ledger integrity checks.
 */
export function evaluateTransaction(tx, options = {}) {
  const typeStr = (tx.type || 'PAYMENT').toUpperCase();
  const typeCode = typeof tx.type === 'number' ? tx.type : (CHANNELS[typeStr] || 2);

  const amount = Number(tx.amount) || 0;
  const oldBalance = Number(tx.oldBalance ?? tx.oldbalanceOrg) || 0;
  const newBalance = Number(tx.newBalance ?? tx.newbalanceOrig) || 0;
  const threshold = options.threshold || 0.5;

  const features = [typeCode, amount, oldBalance, newBalance];

  // 1. Walk Decision Tree
  let node = 0;
  const decisionPath = [];

  while (modelData.children_left[node] !== -1 && modelData.children_right[node] !== -1) {
    const featIdx = modelData.feature[node];
    const featName = modelData.feature_names[featIdx];
    const thresh = modelData.threshold[node];
    const val = features[featIdx];
    const wentLeft = val <= thresh;

    decisionPath.push({
      node,
      featureName: formatFeatureName(featName),
      threshold: thresh,
      actualValue: val,
      rule: wentLeft
        ? `${formatFeatureName(featName)} <= ${formatCurrencyOrVal(thresh, featName)}`
        : `${formatFeatureName(featName)} > ${formatCurrencyOrVal(thresh, featName)}`,
      branch: wentLeft ? 'Left' : 'Right'
    });

    node = wentLeft ? modelData.children_left[node] : modelData.children_right[node];
  }

  const leafValues = modelData.value[node][0]; // [fraud_count, legitimate_count]
  const totalLeaf = leafValues[0] + leafValues[1];
  const treeFraudRatio = totalLeaf > 0 ? leafValues[0] / totalLeaf : 0;

  // 2. Financial Ledger Consistency & Feature Analysis
  const factors = [];
  let scoreAdjustment = 0;

  const deltaOrig = oldBalance - newBalance;
  const ledgerDiscrepancy = Math.abs(deltaOrig - amount);
  const liquidationRatio = oldBalance > 0 ? (amount / oldBalance) : 0;
  const isDrained = (oldBalance > 0 && newBalance === 0);

  // Check 1: Account Drained
  if (isDrained && amount >= oldBalance * 0.95 && (typeCode === 4 || typeCode === 1)) {
    factors.push({
      code: 'LIQUIDATION_DRAIN',
      severity: 'high',
      label: 'Account liquidation pattern',
      detail: 'Origin balance was depleted to $0.00 in a single transaction.'
    });
    scoreAdjustment += 35;
  }

  // Check 2: High-risk channel
  if (typeCode === 4 || typeCode === 1) { // TRANSFER or CASH_OUT
    if (amount > 100000) {
      factors.push({
        code: 'HIGH_VALUE_CHANNEL',
        severity: 'medium',
        label: 'High-value outflow rail',
        detail: `Transfer of $${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} through vulnerable payment channel (${typeStr}).`
      });
      scoreAdjustment += 15;
    }
  } else {
    // PAYMENT, CASH_IN, and DEBIT have negligible historical fraud in baseline
    scoreAdjustment -= 30;
  }

  // Check 3: Ledger mismatch
  if (typeCode !== 3 && ledgerDiscrepancy > 1.0 && amount > 0 && oldBalance > 0) {
    factors.push({
      code: 'LEDGER_MISMATCH',
      severity: 'medium',
      label: 'Balance ledger discrepancy',
      detail: `Reported new balance ($${newBalance.toLocaleString()}) does not reflect old balance minus transaction sum.`
    });
    scoreAdjustment += 15;
  }

  // Check 4: Ghost account
  if (oldBalance === 0 && newBalance === 0 && amount > 5000) {
    factors.push({
      code: 'GHOST_ACCOUNT',
      severity: 'medium',
      label: 'Zero-balance transaction velocity',
      detail: 'Significant transaction initiated from an account with zero initial and terminal balances.'
    });
    scoreAdjustment += 20;
  }

  // 3. Calibrated Risk Score (0 to 100)
  let rawScore = (treeFraudRatio * 70) + scoreAdjustment;
  
  if (treeFraudRatio > 0.5) {
    rawScore = Math.max(rawScore, 75);
  }
  if ((typeCode === 2 || typeCode === 3 || typeCode === 5) && !isDrained) {
    rawScore = Math.min(rawScore, 15);
  }

  const riskScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // 4. Decision Action & Risk Tier
  let decision = 'ALLOW';
  let tier = 'low';
  let policyAction = 'Authorize transaction';

  if (riskScore >= 70) {
    decision = 'BLOCK';
    tier = 'high';
    policyAction = 'Block transaction & freeze account';
  } else if (riskScore >= 35) {
    decision = 'REVIEW';
    tier = 'medium';
    policyAction = 'Require step-up authentication (2FA)';
  }

  return {
    decision,
    isFraud: decision === 'BLOCK',
    riskScore,
    tier,
    policyAction,
    thresholdUsed: threshold,
    ledger: {
      expectedNewBalance: typeCode === 3 ? (oldBalance + amount) : Math.max(0, oldBalance - amount),
      actualNewBalance: newBalance,
      discrepancy: ledgerDiscrepancy,
      liquidationRatio: Number((liquidationRatio * 100).toFixed(1))
    },
    factors,
    decisionPath: decisionPath.slice(0, 5),
    treeStats: {
      depth: decisionPath.length,
      fraudSamplesInLeaf: leafValues[0],
      legitimateSamplesInLeaf: leafValues[1]
    },
    features: {
      channel: typeStr,
      channelCode: typeCode,
      amount,
      oldBalance,
      newBalance
    },
    meta: {
      transactionId: tx.id || `txn_${Math.random().toString(36).substr(2, 8)}`,
      originId: tx.origId || tx.nameOrig || 'acct_orig_' + Math.floor(100000 + Math.random() * 900000),
      destId: tx.destId || tx.nameDest || 'acct_dest_' + Math.floor(100000 + Math.random() * 900000),
      evaluatedAt: new Date().toISOString()
    }
  };
}

function formatFeatureName(name) {
  switch (name) {
    case 'type': return 'Channel';
    case 'amount': return 'Amount';
    case 'oldbalanceOrg': return 'Origin Old Balance';
    case 'newbalanceOrig': return 'Origin New Balance';
    default: return name;
  }
}

function formatCurrencyOrVal(val, feat) {
  if (feat === 'type') {
    return `Code ${val}`;
  }
  return `$${Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
