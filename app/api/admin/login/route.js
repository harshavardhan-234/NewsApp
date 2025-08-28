import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '../../../../lib/db';
import PremiumUser from '../../../../models/PremiumUser';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      return NextResponse.json({ 
        success: false, 
        message: 'Database configuration error. Please set MONGODB_URI environment variable.' 
      }, { status: 500 });
    }

    await connectDB(); // Connect to MongoDB

    const { email, password } = await req.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }


    
    // Temporary hardcoded admin for testing (remove after database setup)
    if (email === 'admin@gmail.com' && password === 'Harsha@123') {
      const response = NextResponse.json({
        success: true,
        message: 'Admin login successful (temporary)',
        token: 'temp-admin-token',
        adminId: 'temp-admin-id',
        email: email,
      });

      cookies().set('admin_token', 'temp-admin-token', {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return response;
    }

    // Database lookup (requires MongoDB connection)
    try {
      await connectDB();
      
      // Find user by email
      const admin = await PremiumUser.findOne({ email });

      if (!admin) {
        return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 });
      }

      // Check if user is an admin
      if (!admin.isAdmin) {
        return NextResponse.json({ success: false, message: 'Not an admin account' }, { status: 403 });
      }

      // Compare password
      const isPasswordMatch = await bcrypt.compare(password, admin.password);

      if (!isPasswordMatch) {
        return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
      }

      // Success: Set cookie and return success with token for frontend
      const response = NextResponse.json({
        success: true,
        message: 'Admin login successful',
        token: admin._id.toString(), // Frontend expects this field
        adminId: admin._id,
        email: admin.email,
      });

      // Set admin_token cookie
      cookies().set('admin_token', admin._id.toString(), {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return response;
      
    } catch (dbError) {
      console.error('Database connection failed, using temporary admin only');
      return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Admin Login API Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}