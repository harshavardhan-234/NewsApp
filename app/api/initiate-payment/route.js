import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const plans = {
  1: 99,
  2: 199,
  3: 299,
  4: 399,
  5: 499,
  6: 599,
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { plan } = body;

    const amount = plans[plan];

    if (!amount) {
      return NextResponse.json(
        { success: false, message: 'Invalid plan selected.' },
        { status: 400 }
      );
    }

    const options = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to initiate payment.' },
      { status: 500 }
    );
  }
}
