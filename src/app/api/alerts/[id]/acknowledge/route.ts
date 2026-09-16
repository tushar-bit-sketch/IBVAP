import { NextResponse } from 'next/server';
import { INITIAL_ALERTS } from '@/data/mockData';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const alert = INITIAL_ALERTS.find(a => a.id.toLowerCase() === params.id.toLowerCase());
  if (!alert) {
    return NextResponse.json({ error: `Alert ${params.id} not found` }, { status: 404 });
  }

  const updated = {
    ...alert,
    acknowledged: true,
    status: 'ACKNOWLEDGED',
    acknowledgedBy: 'OP-ALPHA-07',
    acknowledgedAt: new Date().toISOString()
  };

  return NextResponse.json({
    success: true,
    alert: updated,
    message: `Alert ${params.id} acknowledged by OP-ALPHA-07`
  });
}
