import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import News from '@/models/News';

export async function GET() {
  await connectDB();

  try {
    const total = await News.countDocuments();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const today = await News.countDocuments({
      createdAt: { $gte: startOfDay }
    });

    return NextResponse.json({ total, today });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch counts' }, { status: 500 });
  }
}
