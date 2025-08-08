import connectDB from '@/lib/mongodb';
import Setting from '@/models/setting';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const setting = await Setting.findOne();
  return NextResponse.json(setting || {});
}
