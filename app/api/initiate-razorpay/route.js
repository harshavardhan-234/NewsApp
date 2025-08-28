// app/api/initiate-razorpay/route.js
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req) {
  try {
    const { plan } = await req.json();

    // Map plans to amounts (in paise, since Razorpay expects smallest unit)
    const plans = {
      "1": { amount: 9900, name: "1 Month Plan" },   // ₹99 → 9900 paise
      "2": { amount: 19900, name: "2 Month Plan" },  // ₹199
      "3": { amount: 29900, name: "3 Month Plan" },  // ₹299
      "6": { amount: 59900, name: "6 Month Plan" },  // ₹599
    };

    if (!plans[plan]) {
      return NextResponse.json({ success: false, message: "Invalid plan" }, { status: 400 });
    }

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: plans[plan].amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan: plan,
        planName: plans[plan].name,
      },
    });

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: plans[plan].amount / 100, // Convert back to rupees for display
      currency: "INR",
      key_id: process.env.RAZORPAY_KEY_ID,
    }, { status: 200 });
  } catch (error) {
    console.error("Razorpay error:", error);
    return NextResponse.json({ success: false, message: error.message }, {
      status: 500,
    });
  }
}