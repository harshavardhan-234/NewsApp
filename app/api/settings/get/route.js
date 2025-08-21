import connectDB from '@/lib/db';
import Setting from '@/models/setting';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const setting = await Setting.findOne();
  return NextResponse.json(setting || {});
}
