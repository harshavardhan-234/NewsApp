import { NextResponse } from 'next/server';
import { categoriesStore } from '@/lib/categories-store';

// PUT - Update category
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category name is required' 
      }, { status: 400 });
    }

    // Check if category exists
    const existingCategory = categoriesStore.findById(id);
    if (!existingCategory) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category not found' 
      }, { status: 404 });
    }

    // Check if another category with same name exists
    if (categoriesStore.exists(name.trim(), id)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category with this name already exists' 
      }, { status: 400 });
    }

    // Update category
    const updatedCategory = categoriesStore.update(id, {
      name: name.trim()
    });

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory,
    });

  } catch (error) {
    console.error('Update Category API Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Server error' 
    }, { status: 500 });
  }
}

// DELETE - Delete category
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // Check if category exists
    const existingCategory = categoriesStore.findById(id);
    if (!existingCategory) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category not found' 
      }, { status: 404 });
    }

    // Remove category
    const deletedCategory = categoriesStore.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      category: deletedCategory,
    });

  } catch (error) {
    console.error('Delete Category API Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Server error' 
    }, { status: 500 });
  }
}
