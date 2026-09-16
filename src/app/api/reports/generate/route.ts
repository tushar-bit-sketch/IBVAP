import { NextResponse } from 'next/server';
import { INITIAL_REPORTS } from '@/data/mockData';
import { ReportItem } from '@/types';

let reportsStore: ReportItem[] = [...INITIAL_REPORTS];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newReport: ReportItem = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      title: body.title || 'SECURITY INCIDENT & SURVEILLANCE REPORT',
      type: body.type || 'DAILY_SUMMARY',
      generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' IST',
      generatedBy: body.generatedBy || 'OP-ALPHA-07',
      sector: body.sector || 'NORTH SECTOR (BOP-17)',
      eventCount: body.eventCount || 12,
      integrityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      classification: 'RESTRICTED / DEMO SIMULATION'
    };

    reportsStore.unshift(newReport);
    return NextResponse.json(newReport, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    total: reportsStore.length,
    reports: reportsStore
  });
}
