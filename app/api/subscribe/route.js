import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Subscriber from '@/models/Subscriber';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    // Connect to database
    await connectDB();

    // Get form data
    const { name, email, phone, password, plan, country, state, city } = await req.json();

    // Validate required fields
    if (!name || !email || !phone || !password || !plan) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await Subscriber.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new subscriber
    const subscriber = new Subscriber({
      name,
      email,
      phone,
      password: hashedPassword,
      plan,
      country,
      state,
      city,
      subscriptionDate: new Date(),
    });

    // Save to database
    await subscriber.save();

    return NextResponse.json(
      { success: true, message: 'Subscription successful' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}