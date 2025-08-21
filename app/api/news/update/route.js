import connectDB from '@/lib/db';
import News from '@/models/News';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  await connectDB();

  try {
    const formData = await req.formData();
    const id = formData.get('id');
    const title = formData.get('title');
    const description = formData.get('description');
    const slug = formData.get('slug');
    const category = formData.get('category');
    const imageFile = formData.get('image'); // File or null

    if (!id || !title || !slug || !category) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const updateData = { title, description, slug, category };

    // Handle image upload (optional)
    if (imageFile && imageFile.size > 0 && typeof imageFile.name === 'string') {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const imageName = uuidv4() + '_' + imageFile.name;
      const imagePath = path.join(process.cwd(), 'public/uploads', imageName);
      await writeFile(imagePath, buffer);
      updateData.image = '/uploads/' + imageName;
    }

    const updatedNews = await News.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedNews) {
      return NextResponse.json({ success: false, message: 'News not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, news: updatedNews });
  } catch (error) {
    console.error('❌ Error updating news:', error);
    return NextResponse.json({ success: false, message: 'Failed to update news' }, { status: 500 });
  }
}
