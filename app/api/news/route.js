// app/api/news/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import News from '@/models/News';
import { writeFile } from 'fs/promises';
import path from 'path';
import { URL } from 'url';

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let query = {};
    if (category) {
      query.category = category;
    }

    const newsList = await News.find(query).sort({ createdAt: -1 });
    return NextResponse.json(newsList);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();

  const formData = await req.formData();
  const title = formData.get('title');
  const description = formData.get('description');
  const slug = formData.get('slug');
  const category = formData.get('category');
  const keywords = formData.get('keywords');
  const image = formData.get('image');

  const buffer = Buffer.from(await image.arrayBuffer());
  const filename = `${Date.now()}_${image.name}`;
  const filepath = path.join(process.cwd(), 'public/uploads', filename);

  await writeFile(filepath, buffer);

  try {
    const news = await News.create({
      title,
      description,
      slug,
      category,
      keywords,
      image: `/uploads/${filename}`,
    });

    return NextResponse.json({ success: true, news });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add news' }, { status: 500 });
  }
}
