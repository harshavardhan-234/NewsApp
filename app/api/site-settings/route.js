import connectDB from '@/lib/db';
import Setting from '@/models/setting';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const setting = await Setting.findOne();
    return NextResponse.json(setting || {});
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 });
  }
}