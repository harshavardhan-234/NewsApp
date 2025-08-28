// /app/api/locations/add-country/route.js
import connectDB from '@/lib/db';
import { NextResponse } from 'next/server';
import Location from '@/models/Country';

export async function POST(req) {
  const { country } = await req.json();
  await connectDB();

  const exists = await Location.findOne({ country });
  if (exists) return NextResponse.json({ success: false, message: 'Country exists' });

  const newCountry = new Location({ country, states: [] });
  await newCountry.save();

  return NextResponse.json({ success: true });
}
