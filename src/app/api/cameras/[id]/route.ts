import { NextResponse } from 'next/server';
import { INITIAL_CAMERAS } from '@/data/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const camera = INITIAL_CAMERAS.find(c => c.id.toLowerCase() === params.id.toLowerCase());
  if (!camera) {
    return NextResponse.json({ error: `Camera ${params.id} not found` }, { status: 404 });
  }
  return NextResponse.json(camera);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const camera = INITIAL_CAMERAS.find(c => c.id.toLowerCase() === params.id.toLowerCase());
    if (!camera) {
      return NextResponse.json({ error: `Camera ${params.id} not found` }, { status: 404 });
    }

    const updated = { ...camera, ...body };
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ success: true, message: `Camera ${params.id} removed from ingestion queue` });
}
