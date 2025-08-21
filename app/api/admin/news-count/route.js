import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;
let client;

export async function GET() {
  try {
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
    }

    const db = client.db('test'); // your DB name
    const news = db.collection('news');

    // Total news count
    const total = await news.countDocuments();

    // Today's start and end time
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Count today's news
    const today = await news.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd }
    });

    return NextResponse.json({ total, today });
  } catch (err) {
    console.error('❌ Error fetching dashboard stats:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
