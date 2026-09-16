import { NextResponse } from 'next/server';
import { INITIAL_BOP_NODES } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    total: INITIAL_BOP_NODES.length,
    bops: INITIAL_BOP_NODES
  });
}
