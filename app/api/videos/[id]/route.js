import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import { Video } from '../../../../models/Video.js';

// GET /api/videos/[id] - Get single video
export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const video = await Video.findById(params.id);
    
    if (!video) {
      return NextResponse.json(
        { success: false, message: 'Video not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await Video.findByIdAndUpdate(params.id, { $inc: { views: 1 } });

    return NextResponse.json({
      success: true,
      video
    });

  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}

// PUT /api/videos/[id] - Update video
export async function PUT(req, { params }) {
  try {
    await connectDB();
    
    const { title, description, videoUrl, thumbnail, category, duration, tags } = await req.json();

    // Validate required fields
    if (!title || !videoUrl || !category) {
      return NextResponse.json(
        { success: false, message: 'Title, video URL, and category are required' },
        { status: 400 }
      );
    }

    const video = await Video.findByIdAndUpdate(
      params.id,
      {
        title,
        description,
        videoUrl,
        thumbnail,
        category,
        duration,
        tags: Array.isArray(tags) ? tags : []
      },
      { new: true, runValidators: true }
    );

    if (!video) {
      return NextResponse.json(
        { success: false, message: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Video updated successfully',
      video
    });

  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update video' },
      { status: 500 }
    );
  }
}

// DELETE /api/videos/[id] - Delete video
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const video = await Video.findByIdAndDelete(params.id);

    if (!video) {
      return NextResponse.json(
        { success: false, message: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete video' },
      { status: 500 }
    );
  }
}
