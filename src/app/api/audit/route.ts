import { NextResponse } from 'next/server';
import { INITIAL_AUDIT_LOG } from '@/data/mockData';
import { AuditLogEntry } from '@/types';

let auditStore: AuditLogEntry[] = [...INITIAL_AUDIT_LOG];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const actor = searchParams.get('actor');
  const action = searchParams.get('action');

  let result = auditStore;
  if (actor) {
    result = result.filter(a => a.actor.toLowerCase().includes(actor.toLowerCase()));
  }
  if (action) {
    result = result.filter(a => a.action.toLowerCase().includes(action.toLowerCase()));
  }

  return NextResponse.json({
    total: result.length,
    ledgerTamperStatus: 'SEAL_VALID_SHA256',
    entries: result
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEntry: AuditLogEntry = {
      id: `AUD-${Math.floor(900 + Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: body.actor || 'OP-ALPHA-07',
      role: body.role || 'OPERATOR',
      action: body.action || 'GENERIC_ACTION',
      resource: body.resource || 'SYSTEM',
      result: body.result || 'SUCCESS',
      details: body.details || 'Action logged by client.',
      ipAddress: '10.14.0.12'
    };

    auditStore.unshift(newEntry);
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
