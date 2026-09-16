import { NextResponse } from 'next/server';
import { INITIAL_FACES } from '@/data/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('watchlistStatus');

  let result = INITIAL_FACES;
  if (status) {
    result = result.filter(f => f.watchlistStatus.toLowerCase() === status.toLowerCase());
  }

  return NextResponse.json({
    total: result.length,
    disclaimer: 'ALL BIOMETRIC PROFILES ARE SYNTHETIC TEST IDENTITIES GENERATED FOR SIH26187 SIMULATION PURPOSES.',
    faces: result
  });
}
