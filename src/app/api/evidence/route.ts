import { NextResponse } from 'next/server';
import { INITIAL_EVIDENCE } from '@/data/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const severity = searchParams.get('severity');
  const alertType = searchParams.get('alertType');

  let result = INITIAL_EVIDENCE;
  if (severity) {
    result = result.filter(e => e.severity.toLowerCase() === severity.toLowerCase());
  }
  if (alertType) {
    result = result.filter(e => e.alertType.toLowerCase() === alertType.toLowerCase());
  }

  return NextResponse.json({
    total: result.length,
    evidence: result
  });
}
