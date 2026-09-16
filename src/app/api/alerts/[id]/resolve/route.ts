import { NextResponse } from 'next/server';
import { INITIAL_ALERTS } from '@/data/mockData';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const alert = INITIAL_ALERTS.find(a => a.id.toLowerCase() === params.id.toLowerCase());
    if (!alert) {
      return NextResponse.json({ error: `Alert ${params.id} not found` }, { status: 404 });
    }

    const updated = {
      ...alert,
      status: body.falsePositive ? 'FALSE_POSITIVE' : 'RESOLVED',
      resolvedBy: body.resolvedBy || 'COMMANDER-BOP17',
      resolutionNotes: body.resolutionNotes || (body.falsePositive ? 'Flagged as false detection; edge filter updated.' : 'Incident interdiction complete.'),
      resolvedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      alert: updated,
      message: `Alert ${params.id} resolved as ${updated.status}`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
