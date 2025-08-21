import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PremiumUser from '@/models/PremiumUser';
import { otps } from '@/lib/globals';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email } = await req.json();
    await connectDB();

    const user = await PremiumUser.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otps[email] = otp;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        // Do not fail on invalid certificates
        rejectUnauthorized: false
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Your OTP',
      text: `Your OTP is: ${otp}`,
    });

    return NextResponse.json({ success: true, message: 'OTP sent' });

  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to send OTP' }, { status: 500 });
  }
}
