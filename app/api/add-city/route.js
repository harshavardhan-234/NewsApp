import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import City from '@/models/city';

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const { name, state_id } = body;

  if (!name || !state_id) {
    return NextResponse.json({ error: 'Missing name or state_id' }, { status: 400 });
  }

  const city = await City.create({ name, state_id });
  return NextResponse.json(city);
}
