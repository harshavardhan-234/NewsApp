import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import { Video } from '../../../models/Video.js';

// GET /api/videos - Fetch all videos
export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;

    console.log('API Request - Category:', category, 'Page:', page, 'Limit:', limit);

    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    
    console.log('Database Query:', query);

    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Video.countDocuments(query);

    return NextResponse.json({
      success: true,
      videos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching videos:', error);
    console.error('Error details:', error.message);
    console.error('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    return NextResponse.json(
      { success: false, message: `Failed to fetch videos: ${error.message}` },
      { status: 500 }
    );
  }
}

// POST /api/videos - Create new video (admin only)
export async function POST(req) {
  try {
    await connectDB();
    
    const { title, description, videoUrl, thumbnail, category, duration } = await req.json();

    // Validate required fields
    if (!title || !videoUrl || !category) {
      return NextResponse.json(
        { success: false, message: 'Title, video URL, and category are required' },
        { status: 400 }
      );
    }

    const video = new Video({
      title,
      description,
      videoUrl,
      thumbnail,
      category,
      duration,
      views: 0,
      publishedAt: new Date()
    });

    await video.save();

    return NextResponse.json({
      success: true,
      message: 'Video created successfully',
      video
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating video:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, message: `Failed to create video: ${error.message}` },
      { status: 500 }
    );
  }
}
