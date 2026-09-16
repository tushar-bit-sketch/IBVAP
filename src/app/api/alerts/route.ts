import { NextResponse } from 'next/server';
import { INITIAL_ALERTS } from '@/data/mockData';
import { Alert } from '@/types';

let alertsStore: Alert[] = [...INITIAL_ALERTS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const severity = searchParams.get('severity');
  const status = searchParams.get('status');
  const cameraId = searchParams.get('cameraId');

  let result = alertsStore;
  if (severity) {
    result = result.filter(a => a.severity.toLowerCase() === severity.toLowerCase());
  }
  if (status) {
    result = result.filter(a => a.status.toLowerCase() === status.toLowerCase());
  }
  if (cameraId) {
    result = result.filter(a => a.cameraId.toLowerCase() === cameraId.toLowerCase());
  }

  return NextResponse.json({
    total: result.length,
    alerts: result
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newAlert: Alert = {
      id: `ALERT-${Date.now().toString().slice(-4)}`,
      severity: body.severity || 'CRITICAL',
      type: body.type || 'PERIMETER_BREACH',
      status: 'NEW',
      cameraId: body.cameraId || 'CAM-01',
      cameraName: body.cameraName || 'BORDER FENCE NORTH',
      zoneId: body.zoneId || 'zone-01',
      zoneName: body.zoneName || 'BORDER FENCE 01',
      objectId: body.objectId || 'PERSON-UNKNOWN',
      objectClass: body.objectClass || 'person',
      confidence: body.confidence || 0.95,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      description: body.description || 'Intrusion event generated via API trigger.',
      acknowledged: false,
      snapshotUrl: body.snapshotUrl || 'https://images.unsplash.com/photo-1566847936715-5e147ef9caec?auto=format&fit=crop&w=800&q=80',
      threatBreakdown: body.threatBreakdown || {
        score: 85,
        level: 'CRITICAL',
        factors: [
          { name: 'API TRIGGER', weight: 40, description: 'External edge daemon event' },
          { name: 'ZONE BREACH', weight: 45, description: 'Virtual fence polygon violation' }
        ],
        reason: 'Automated tripwire trip event emitted from edge perception pipeline.'
      }
    };

    alertsStore.unshift(newAlert);
    return NextResponse.json(newAlert, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Invalid alert payload' }, { status: 400 });
  }
}
