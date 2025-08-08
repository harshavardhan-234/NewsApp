import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import PremiumUser from '@/models/PremiumUser';

export async function POST(req) {
  try {
    await connectDB(); // Connect to MongoDB

    const { email, password } = await req.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    // Find user by email
    const user = await PremiumUser.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
    }

    // Success: Set cookie and return success
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      userId: user._id,
      email: user.email,
      plan: user.plan,
      expiresAt: user.expiresAt,
    });

    // Set token as cookie
    response.cookies.set('token', user._id.toString(), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
