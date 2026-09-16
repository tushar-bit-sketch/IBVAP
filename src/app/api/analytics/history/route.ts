import { NextResponse } from 'next/server';
import { ANALYTICS_SERIES_24H } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    interval: '24H',
    dataPoints: ANALYTICS_SERIES_24H,
    summary: {
      totalDetections: 468,
      totalAlerts: 29,
      falsePositiveRatePercent: 6.8,
      meanInferenceLatencyMs: 91.2,
      meanAlertResponseSec: 28.4
    }
  });
}
