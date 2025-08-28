// app/api/news/[id]/route.js
import connectDB from '../../../../lib/db';
import News from '../../../../models/News.js';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  await connectDB();
  try {
    await News.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
