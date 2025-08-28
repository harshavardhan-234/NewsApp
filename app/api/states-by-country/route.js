import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import State from '@/models/state';

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const countryId = searchParams.get('countryId');

  if (!countryId) {
    return NextResponse.json({ error: 'countryId missing' }, { status: 400 });
  }

  const states = await State.find({ country_id: countryId });
  return NextResponse.json(states);
}
