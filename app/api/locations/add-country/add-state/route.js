// /app/api/locations/add-state/route.js
import connectDB from '@/lib/db';
import { NextResponse } from 'next/server';
import Location from '@/models/Country';

export async function POST(req) {
  const { country, state } = await req.json();
  await connectDB();

  const location = await Location.findOne({ country });
  if (!location) return NextResponse.json({ success: false, message: 'Country not found' });

  const stateExists = location.states.find((s) => s.name === state);
  if (stateExists) return NextResponse.json({ success: false, message: 'State exists' });

  location.states.push({ name: state, cities: [] });
  await location.save();

  return NextResponse.json({ success: true });
}
