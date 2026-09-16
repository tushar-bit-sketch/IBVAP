import { NextResponse } from 'next/server';
import { INITIAL_EDGE_NODE } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    edgeNodes: [INITIAL_EDGE_NODE]
  });
}
