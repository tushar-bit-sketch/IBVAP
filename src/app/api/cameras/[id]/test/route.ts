import { NextResponse } from 'next/server';
import { INITIAL_CAMERAS } from '@/data/mockData';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const camera = INITIAL_CAMERAS.find(c => c.id.toLowerCase() === params.id.toLowerCase());
  if (!camera) {
    return NextResponse.json({ error: `Camera ${params.id} not found` }, { status: 404 });
  }

  return NextResponse.json({
    cameraId: camera.id,
    testResult: 'STREAM_ONLINE',
    rtspHandshake: 'SUCCESS_200_OK',
    pingMs: 14.2,
    codec: 'H.264 / Baseline',
    dimensions: '1920x1080@30fps',
    edgeInferenceDaemon: 'ACTIVE',
    modelLoaded: camera.model,
    timestamp: new Date().toISOString()
  });
}
