import { NextResponse } from 'next/server';
import { INITIAL_REPORTS } from '@/data/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const report = INITIAL_REPORTS.find(r => r.id.toLowerCase() === params.id.toLowerCase());
  if (!report) {
    return NextResponse.json({ error: `Report ${params.id} not found` }, { status: 404 });
  }
  return NextResponse.json(report);
}
