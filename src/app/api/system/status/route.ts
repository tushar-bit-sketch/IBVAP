import { NextResponse } from 'next/server';
import { INITIAL_METRICS, INITIAL_DIAGNOSTICS, INITIAL_EDGE_NODE } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    metrics: INITIAL_METRICS,
    diagnostics: INITIAL_DIAGNOSTICS,
    edgeNode: INITIAL_EDGE_NODE,
    timestamp: new Date().toISOString()
  });
}
