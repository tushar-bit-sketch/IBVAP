import { NextResponse } from 'next/server';
import { INITIAL_CAMERAS } from '@/data/mockData';
import { Detection } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cameraId = searchParams.get('cameraId');
  const targetClass = searchParams.get('class');

  const allDetections: Detection[] = INITIAL_CAMERAS.flatMap(c => c.currentDetections);
  let filtered = allDetections;

  if (cameraId) {
    filtered = filtered.filter(d => d.cameraId.toLowerCase() === cameraId.toLowerCase());
  }
  if (targetClass) {
    filtered = filtered.filter(d => d.class.toLowerCase() === targetClass.toLowerCase());
  }

  return NextResponse.json({
    count: filtered.length,
    detections: filtered
  });
}
