import { NextResponse } from 'next/server';
import { INITIAL_CAMERAS } from '@/data/mockData';
import { Camera } from '@/types';

// In-memory store initialized with mock data
let camerasStore: Camera[] = [...INITIAL_CAMERAS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sector = searchParams.get('sector');
  const status = searchParams.get('status');

  let result = camerasStore;
  if (sector) {
    result = result.filter(c => c.sector.toLowerCase().includes(sector.toLowerCase()));
  }
  if (status) {
    result = result.filter(c => c.status.toLowerCase() === status.toLowerCase());
  }

  return NextResponse.json({
    total: result.length,
    cameras: result
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCamera: Camera = {
      id: body.id || `CAM-0${camerasStore.length + 1}`,
      name: body.name || 'NEW PERIMETER SENSOR',
      sector: body.sector || 'NORTH SECTOR',
      rtspUrl: body.rtspUrl || 'rtsp://edge-node-01.bop17.internal:554/live/stream',
      resolution: body.resolution || '1920x1080',
      fps: 29.0,
      targetFps: 30,
      status: 'ONLINE',
      aiStatus: 'OPTIMAL',
      feedType: body.feedType || 'OPTICAL',
      feedUrl: body.feedUrl || 'https://images.unsplash.com/photo-1566847936715-5e147ef9caec?auto=format&fit=crop&w=1200&q=80',
      model: 'YOLOv8x + DeepSORT',
      currentDetections: [],
      activeZones: [],
      ptzSupport: !!body.ptzSupport,
      edgeNodeId: 'edge-node-01',
      streamHealth: {
        fps: 29.0,
        targetFps: 30,
        latencyMs: 92,
        jitterMs: 4.0,
        packetLossPercent: 0.05,
        bitrateKbps: 4000,
        gpuUtilization: 60,
        cpuUtilization: 40,
        temperatureC: 60,
        queueDepth: 1,
        decoderState: 'HARDWARE'
      }
    };

    camerasStore.push(newCamera);
    return NextResponse.json(newCamera, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Invalid camera payload' }, { status: 400 });
  }
}
