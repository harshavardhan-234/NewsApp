// /app/api/locations/add-city/route.js
import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Location from '@/models/Country';

export async function POST(req) {
  const { country, state, city } = await req.json();
  await connectDB();

  const location = await Location.findOne({ country });
  if (!location) return NextResponse.json({ success: false });

  const stateObj = location.states.find((s) => s.name === state);
  if (!stateObj) return NextResponse.json({ success: false });

  if (stateObj.cities.includes(city))
    return NextResponse.json({ success: false, message: 'City exists' });

  stateObj.cities.push(city);
  await location.save();

  return NextResponse.json({ success: true });
}
