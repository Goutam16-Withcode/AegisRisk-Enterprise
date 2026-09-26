import { NextResponse } from 'next/server';
import { evaluateTransaction } from '@/lib/fraudEngine';

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body) {
      return NextResponse.json({ error: 'Request body required' }, { status: 400 });
    }

    const result = evaluateTransaction(body, {
      threshold: body.threshold ? Number(body.threshold) : 0.5
    });

    return NextResponse.json({
      status: 'success',
      data: result
    });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: err.message || 'Evaluation failed' },
      { status: 500 }
    );
  }
}
