import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import PremiumUser from '../../../../models/PremiumUser';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    await connectDB();

    // Get request data
    const { currentPassword, newPassword } = await req.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Get admin ID from cookie
    const adminToken = cookies().get('admin_token')?.value;
    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please log in again' },
        { status: 401 }
      );
    }

    // Handle temporary admin token
    if (adminToken === 'temp-admin-token') {
      // For temporary admin, verify hardcoded credentials
      if (currentPassword !== 'Harsha@123') {
        return NextResponse.json(
          { success: false, message: 'Current password is incorrect' },
          { status: 401 }
        );
      }

      // For demo purposes, just return success (no actual password change for temp admin)
      return NextResponse.json(
        { success: true, message: 'Password changed successfully (demo mode)' },
        { status: 200 }
      );
    }

    // Find admin user for database-stored admins
    const admin = await PremiumUser.findById(adminToken);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin user not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    return NextResponse.json(
      { success: true, message: 'Password changed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin password change error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}