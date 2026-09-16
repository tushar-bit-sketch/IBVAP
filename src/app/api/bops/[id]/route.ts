import { NextResponse } from 'next/server';
import { INITIAL_BOP_NODES } from '@/data/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const bop = INITIAL_BOP_NODES.find(b => b.id.toLowerCase() === params.id.toLowerCase() || b.code.toLowerCase() === params.id.toLowerCase());
  if (!bop) {
    return NextResponse.json({ error: `BOP outpost ${params.id} not found` }, { status: 404 });
  }
  return NextResponse.json(bop);
}
