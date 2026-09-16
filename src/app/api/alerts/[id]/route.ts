import { NextResponse } from 'next/server';
import { INITIAL_ALERTS } from '@/data/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const alert = INITIAL_ALERTS.find(a => a.id.toLowerCase() === params.id.toLowerCase());
  if (!alert) {
    return NextResponse.json({ error: `Alert ${params.id} not found` }, { status: 404 });
  }
  return NextResponse.json(alert);
}
