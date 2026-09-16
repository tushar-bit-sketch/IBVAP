import { NextResponse } from 'next/server';
import { INITIAL_METRICS } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    fps: INITIAL_METRICS.fpsAverage,
    latencyMs: INITIAL_METRICS.inferenceLatencyMs,
    alertLatencyMs: INITIAL_METRICS.alertLatencyMs,
    activeDetections: {
      persons: INITIAL_METRICS.activePersons,
      vehicles: INITIAL_METRICS.activeVehicles,
      faces: INITIAL_METRICS.activeFaces
    },
    alertsActive: INITIAL_METRICS.activeAlerts,
    threatLevel: INITIAL_METRICS.systemHealth
  });
}
