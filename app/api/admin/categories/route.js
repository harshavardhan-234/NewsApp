import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { categoriesStore } from '@/lib/categories-store';

// GET - Fetch all categories
export async function GET(req) {
  try {
    return NextResponse.json({
      success: true,
      categories: categoriesStore.getAll(),
    });
  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Server error' 
    }, { status: 500 });
  }
}

// POST - Create new category
export async function POST(req) {
  try {
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category name is required' 
      }, { status: 400 });
    }

    // Check if category already exists
    if (categoriesStore.exists(name.trim())) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category already exists' 
      }, { status: 400 });
    }

    // Create new category
    const newCategory = categoriesStore.create({
      name: name.trim()
    });

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category: newCategory,
    });

  } catch (error) {
    console.error('Create Category API Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Server error' 
    }, { status: 500 });
  }
}
