// app/api/verify-payment/route.js
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import { sendEmail } from '@/lib/mailer';
import PremiumUser from '@/models/PremiumUser';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(req) {
  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, name, phone, password, plan } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ success: false, message: 'Missing payment details.' }, { status: 400 });
  }

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return NextResponse.json({ success: false, message: 'Invalid signature.' }, { status: 400 });
  }

  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new PremiumUser({ name, email, phone, password: hashedPassword, plan });
    await newUser.save();

    // Send email
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

    // Optional: Auto-login by setting cookie
    cookies().set('subscriber_id', newUser._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ 
      success: true, 
      token: newUser._id,
      redirectUrl: '/payment-success'
    }, { status: 200 });
  } catch (err) {
    console.error('❌ Error saving user or sending mail:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
