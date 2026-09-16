import { NextResponse } from 'next/server';
import { INITIAL_CAMERAS } from '@/data/mockData';
import { Zone } from '@/types';

let zonesStore: Zone[] = INITIAL_CAMERAS.flatMap(c => c.activeZones);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cameraId = searchParams.get('cameraId');
  const type = searchParams.get('type');

  let result = zonesStore;
  if (cameraId) {
    result = result.filter(z => z.cameraId.toLowerCase() === cameraId.toLowerCase());
  }
  if (type) {
    result = result.filter(z => z.type.toLowerCase() === type.toLowerCase());
  }

  return NextResponse.json({
    total: result.length,
    zones: result
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newZone: Zone = {
      id: body.id || `zone-${Date.now().toString().slice(-4)}`,
      name: body.name || 'NEW VIRTUAL PERIMETER',
      type: body.type || 'RESTRICTED AREA',
      cameraId: body.cameraId || 'CAM-01',
      points: body.points || [{ x: 20, y: 20 }, { x: 80, y: 20 }, { x: 75, y: 75 }, { x: 25, y: 75 }],
      status: 'ACTIVE',
      sensitivity: body.sensitivity || 0.90,
      rule: body.rule || {
        allowedClasses: ['person'],
        dwellThresholdSeconds: 30,
        alertSeverity: 'HIGH'
      }
    };

    zonesStore.push(newZone);
    return NextResponse.json(newZone, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Invalid zone payload' }, { status: 400 });
  }
}
