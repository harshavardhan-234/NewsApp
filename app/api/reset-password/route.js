import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PremiumUser from '@/models/PremiumUser';
import { otps } from '@/lib/globals';

export async function POST(req) {
  const { email, otp, newPassword } = await req.json();
  await connectDB();

  const validOtp = otps[email];
  if (!validOtp || validOtp !== otp) {
    return NextResponse.json({ success: false, message: 'Invalid OTP' });
  }

  const user = await PremiumUser.findOne({ email });
  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' });
  }

  user.password = newPassword;
  await user.save();

  delete otps[email];
  return NextResponse.json({ success: true, message: 'Password reset successful' });
}
