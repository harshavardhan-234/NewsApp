import { NextResponse } from 'next/server';
import { otps } from '@/lib/globals';

export async function POST(req) {
  const { email, otp } = await req.json();

  const validOtp = otps[email];
  if (!validOtp || validOtp !== otp) {
    return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: 'OTP verified' });
}
