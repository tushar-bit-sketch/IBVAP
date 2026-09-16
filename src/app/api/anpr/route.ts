import { NextResponse } from 'next/server';
import { INITIAL_PLATES } from '@/data/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const query = searchParams.get('query');

  let result = INITIAL_PLATES;
  if (status) {
    result = result.filter(p => p.status.toLowerCase() === status.toLowerCase());
  }
  if (query) {
    result = result.filter(p => p.plateNumber.toLowerCase().includes(query.toLowerCase()));
  }

  return NextResponse.json({
    total: result.length,
    plates: result
  });
}
