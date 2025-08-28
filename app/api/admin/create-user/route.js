import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import PremiumUser from '@/models/PremiumUser';

export async function POST(req) {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database configuration error. Please set MONGODB_URI environment variable.' 
      }, { status: 500 });
    }

    await connectDB();

    const { name, email, phone, password, plan, expiresAt, isAdmin } = await req.json();

    // Check if user already exists
    const existingUser = await PremiumUser.findOne({ email });
    
    if (existingUser) {
      // Update existing user to make them admin
      await PremiumUser.updateOne(
        { email },
        { 
          $set: { 
            password,
            isAdmin: true 
          } 
        }
      );
      return NextResponse.json({
        success: true,
        message: 'User updated to admin successfully',
        userId: existingUser._id,
      });
    } else {
      // Create new admin user
      const admin = new PremiumUser({
        name,
        email,
        phone,
        password,
        plan,
        expiresAt: new Date(expiresAt),
        isAdmin,
      });
      
      await admin.save();
      return NextResponse.json({
        success: true,
        message: 'Admin user created successfully',
        userId: admin._id,
      });
    }
    
  } catch (error) {
    console.error('Create Admin API Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    }, { status: 500 });
  }
}
