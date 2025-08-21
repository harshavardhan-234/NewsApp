// app/api/verify-stripe-payment/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/lib/db';
import { sendEmail } from '@/lib/mailer';
import PremiumUser from '@/models/PremiumUser';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.json();
  const { session_id, password } = body;

  if (!session_id) {
    return NextResponse.json({ success: false, message: 'Missing session ID.' }, { status: 400 });
  }

  try {
    // Retrieve the session from Stripe to verify payment was successful
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ 
        success: false, 
        message: 'Payment not completed.' 
      }, { status: 400 });
    }

    // Get customer details from session metadata
    const { name, email, phone, plan } = session.metadata;
    
    // If password wasn't stored in metadata (for security), it should be provided in the request
    if (!password) {
      return NextResponse.json({ 
        success: false, 
        message: 'Password is required to complete registration.' 
      }, { status: 400 });
    }

    await connectDB();

    // Hash password and create new premium user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new PremiumUser({ 
      name, 
      email, 
      phone, 
      password: hashedPassword, 
      plan,
      stripeSessionId: session_id,
      stripeCustomerId: session.customer,
      paymentStatus: 'completed'
    });
    
    await newUser.save();

    // Send confirmation email
    const emailSent = await sendEmail({
      to: email,
      subject: '✅ Subscription Confirmed - Thank You for Your Payment!',
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for subscribing. Your payment for plan <strong>${plan} month(s)</strong> is successful.</p>
        <p>You can now access premium news instantly.</p>
        <br/>
        <p>Regards,<br/>News Portal Team</p>
      `,
    });
    
    // Log email status but continue with payment process
    if (!emailSent) {
      console.warn(`⚠️ Could not send confirmation email to ${email}, but payment was processed successfully`);
    }

    // Set cookie for auto-login
    cookies().set('subscriber_id', newUser._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ 
      success: true, 
      token: newUser._id,
      redirectUrl: '/payment-success'
    }, { status: 200 });
  } catch (err) {
    console.error('❌ Error verifying Stripe payment:', err);
    return NextResponse.json({ 
      success: false, 
      message: 'Server error during payment verification' 
    }, { status: 500 });
  }
}