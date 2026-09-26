import { NextResponse } from 'next/server';
import { evaluateTransaction } from '@/lib/fraudEngine';

export async function POST(request) {
  try {
    const body = await request.json();
    const transactions = Array.isArray(body) ? body : body.transactions;

    if (!Array.isArray(transactions)) {
      return NextResponse.json(
        { error: 'Invalid input. Expected an array of transactions under `transactions`.' },
        { status: 400 }
      );
    }

    const threshold = body.threshold ? Number(body.threshold) : 0.5;
    const evaluated = transactions.map((tx, idx) => {
      const result = evaluateTransaction(tx, { threshold });
      return {
        row: idx + 1,
        ...result
      };
    });

    const totalCount = evaluated.length;
    const fraudCount = evaluated.filter((t) => t.isFraud).length;
    const legitimateCount = totalCount - fraudCount;
    const totalVolume = evaluated.reduce((sum, t) => sum + (t.features.amount || 0), 0);
    const fraudVolume = evaluated
      .filter((t) => t.isFraud)
      .reduce((sum, t) => sum + (t.features.amount || 0), 0);

    return NextResponse.json({
      status: 'success',
      summary: {
        totalTransactions: totalCount,
        fraudDetected: fraudCount,
        legitimateApproved: legitimateCount,
        fraudRatePercent: totalCount > 0 ? ((fraudCount / totalCount) * 100).toFixed(2) : 0,
        totalVolumeProcessed: totalVolume,
        fraudExposureValue: fraudVolume
      },
      results: evaluated
    });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: err.message || 'Batch evaluation failed' },
      { status: 500 }
    );
  }
}
