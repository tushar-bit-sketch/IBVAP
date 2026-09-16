import { NextResponse } from 'next/server';
import { INITIAL_TRACKS } from '@/data/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const targetClass = searchParams.get('class');

  let result = INITIAL_TRACKS;
  if (status) {
    result = result.filter(t => t.status.toLowerCase() === status.toLowerCase());
  }
  if (targetClass) {
    result = result.filter(t => t.class.toLowerCase() === targetClass.toLowerCase());
  }

  return NextResponse.json({
    count: result.length,
    tracks: result
  });
}
