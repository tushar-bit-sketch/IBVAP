import { NextResponse } from 'next/server';
import { INITIAL_TRACKS } from '@/data/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const track = INITIAL_TRACKS.find(t => t.trackingId.toLowerCase() === params.id.toLowerCase());
  if (!track) {
    return NextResponse.json({ error: `Track ${params.id} not found` }, { status: 404 });
  }
  return NextResponse.json(track);
}
