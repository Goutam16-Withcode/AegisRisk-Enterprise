import { NextResponse } from 'next/server';
import { retrieveContext, FINANCIAL_KNOWLEDGE_BASE } from '@/lib/financialKnowledge';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const query = body?.query || '';

    if (!query.trim()) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // 1. RAG Retrieval Step
    const retrievedDocs = retrieveContext(query, 3);
    const contextDocs = retrievedDocs.length > 0 ? retrievedDocs : FINANCIAL_KNOWLEDGE_BASE.slice(0, 2);

    const contextText = contextDocs
      .map(
        (doc, i) =>
          `[Source ${i + 1}: ${doc.title} (${doc.category})]\n${doc.content}\nReferences: ${doc.references.join(', ')}`
      )
      .join('\n\n---\n\n');

    const promptMessages = [
      {
        role: 'system',
        content: `You are an elite Financial Fraud, AML Compliance, and Banking Risk Advisor for a transaction monitoring platform.
You advise banks, fintechs, and analysts on transaction risk, fraud patterns, model metrics, and regulatory obligations.

You have access to knowledge extracted from the PaySim 6.36M transaction dataset and banking regulations (FinCEN, BSA, UCC 4A, FATF).
Use the provided retrieved context to answer the user's question with precise, structured, and actionable guidance.
Structure your response clearly with headings, key indicators, regulatory mandates, and recommended countermeasures.

Retrieved Context:
${contextText}`
      },
      {
        role: 'user',
        content: query
      }
    ];

    // 2. Generation Step via Groq
    let generatedAnswer = '';
    let usedModel = 'openai/gpt-oss-120b';

    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'FraudRiskPlatform/3.2 (Next.js)'
        },
        body: JSON.stringify({
          model: usedModel,
          messages: promptMessages,
          max_tokens: 800,
          temperature: 0.3
        })
      });

      if (groqResponse.ok) {
        const groqData = await groqResponse.json();
        generatedAnswer = groqData?.choices?.[0]?.message?.content || '';
      } else {
        console.warn('Groq API returned status:', groqResponse.status);
      }
    } catch (err) {
      console.warn('Groq API call error:', err.message);
    }

    // 3. Fallback synthesis if Groq call failed or returned empty
    if (!generatedAnswer) {
      usedModel = 'Local RAG Engine';
      generatedAnswer = `### Analysis & Financial Guidance

Based on the retrieved dataset patterns and financial regulatory standards:

${contextDocs[0]?.content || ''}

${contextDocs[1] ? `\n\n### Related Context: ${contextDocs[1].title}\n${contextDocs[1].content.substring(0, 400)}...` : ''}`;
    }

    const allReferences = Array.from(
      new Set(contextDocs.flatMap((d) => d.references || []))
    );

    return NextResponse.json({
      status: 'success',
      data: {
        query,
        answer: generatedAnswer,
        modelUsed: usedModel,
        retrievedSources: contextDocs.map((d) => ({
          id: d.id,
          title: d.title,
          category: d.category,
          references: d.references
        })),
        references: allReferences
      }
    });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: err.message || 'Advisor request failed' },
      { status: 500 }
    );
  }
}
