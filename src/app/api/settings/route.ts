import { NextResponse } from 'next/server';

let currentSettings = {
  general: {
    systemName: 'IBVAP — INTELLIGENT BORDER VIDEO ANALYTICS PLATFORM',
    problemStatement: 'SIH26187',
    outpostCode: 'BOP-17',
    sector: 'NORTH SECTOR',
    timeZone: 'Asia/Kolkata (IST)',
    demoMode: true,
    telemetryRateHz: 1
  },
  inference: {
    objectDetectionModel: 'YOLOv8x-CustomBorder',
    confidenceThreshold: 0.50,
    trackingEngine: 'DeepSORT-v2.1',
    anprOcrModel: 'LPRNet-v3',
    anprThreshold: 0.75,
    faceModel: 'ArcFace-512D',
    faceMatchThreshold: 0.85,
    loiteringThresholdSeconds: 60
  },
  network: {
    mode: 'ONLINE',
    edgeSyncIntervalSec: 15,
    rtspBufferFrames: 90,
    maxConcurrentStreams: 8,
    centralSyncEndpoint: 'https://central-hq.ibvap.internal/sync'
  }
};

export async function GET() {
  return NextResponse.json(currentSettings);
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    currentSettings = { ...currentSettings, ...body };
    return NextResponse.json({
      success: true,
      settings: currentSettings,
      message: 'System settings successfully updated on edge node.'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
