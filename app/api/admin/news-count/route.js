import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db('test'); // your DB name
    const news = db.collection('news');

    const total = await news.countDocuments();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const today = await news.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd }
    });

    return NextResponse.json({ total, today });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
