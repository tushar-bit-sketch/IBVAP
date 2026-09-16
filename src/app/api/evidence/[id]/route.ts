import { NextResponse } from 'next/server';
import { INITIAL_EVIDENCE } from '@/data/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const item = INITIAL_EVIDENCE.find(e => e.id.toLowerCase() === params.id.toLowerCase());
  if (!item) {
    return NextResponse.json({ error: `Evidence package ${params.id} not found` }, { status: 404 });
  }
  return NextResponse.json(item);
}
