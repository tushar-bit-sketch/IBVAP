import { NextResponse } from 'next/server';
import { INITIAL_CAMERAS } from '@/data/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const allZones = INITIAL_CAMERAS.flatMap(c => c.activeZones);
  const zone = allZones.find(z => z.id.toLowerCase() === params.id.toLowerCase());
  if (!zone) {
    return NextResponse.json({ error: `Zone ${params.id} not found` }, { status: 404 });
  }
  return NextResponse.json(zone);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      id: params.id,
      updated: body,
      message: `Zone ${params.id} updated in edge memory.`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    success: true,
    message: `Zone ${params.id} deleted from camera perimeter pipeline.`
  });
}
