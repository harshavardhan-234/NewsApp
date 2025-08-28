// app/api/search/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import News from '@/models/News';

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([], { status: 200 });
    }

    const regex = new RegExp(query, 'i'); // case-insensitive search
    const results = await News.find({
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { category: { $regex: regex } }
      ]
    });

    return NextResponse.json(results);
  } catch (err) {
    console.error('Search API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
