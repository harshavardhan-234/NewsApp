// app/api/initiate-payment/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import Razorpay from 'razorpay';

// Initialize Stripe only if secret key is available
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req) {
  try {
    const { plan, paymentMethod = 'stripe', ...userData } = await req.json();

    // Map plans to amounts (in paise, since payment gateways expect smallest unit)
    const plans = {
      "1": { amount: 9900, name: "1 Month Plan" },   // ₹99 → 9900 paise
      "2": { amount: 19900, name: "2 Month Plan" },  // ₹199
      "3": { amount: 29900, name: "3 Month Plan" },  // ₹299
      "6": { amount: 59900, name: "6 Month Plan" },  // ₹599
    };

    if (!plans[plan]) {
      return NextResponse.json({ success: false, message: "Invalid plan" }, { status: 400 });
    }

    // Store user data in session for later use during payment verification
    const metadata = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      plan: plan
    };

    // Process payment based on selected payment method
    if (paymentMethod === 'stripe') {
      // Check if Stripe is configured
      if (!stripe) {
        return NextResponse.json({ 
          success: false, 
          message: 'Stripe configuration is missing. Please contact support.' 
        }, { status: 500 });
      }
      
      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: plans[plan].name,
              },
              unit_amount: plans[plan].amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscribe/form`,
        customer_email: userData.email,
        metadata: metadata,
      });

      return NextResponse.json({ 
        success: true, 
        provider: 'stripe',
        url: session.url,
        id: session.id
      }, { status: 200 });
    } 
    else if (paymentMethod === 'razorpay') {
      // Check if Razorpay keys are available
      const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
      const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
      
      if (!razorpayKeyId || !razorpayKeySecret) {
        console.error('Razorpay API keys missing:', { 
          key_id_exists: !!razorpayKeyId,
          key_secret_exists: !!razorpayKeySecret 
        });
        return NextResponse.json({ 
          success: false, 
          message: 'Razorpay configuration is incomplete. Please contact support.' 
        }, { status: 500 });
      }
      
      // Initialize Razorpay instance
      const razorpay = new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
      });

      // Create Razorpay order
      const order = await razorpay.orders.create({
        amount: plans[plan].amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          ...metadata,
          customer_email: userData.email,
          customer_name: userData.name,
          customer_phone: userData.phone
        },
      });

      return NextResponse.json({
        success: true,
        provider: 'razorpay',
        order_id: order.id,
        amount: plans[plan].amount,
        currency: "INR",
        key_id: process.env.RAZORPAY_KEY_ID,
      }, { status: 200 });
    } 
    else {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid payment method" 
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Payment initialization error:", error);
    
    // More detailed error logging
    if (error.stack) {
      console.error("Error stack:", error.stack);
    }
    
    // Check for specific Razorpay errors
    if (paymentMethod === 'razorpay') {
      console.error("Razorpay config:", {
        key_id_exists: !!process.env.RAZORPAY_KEY_ID,
        key_secret_exists: !!process.env.RAZORPAY_KEY_SECRET,
        key_id_length: process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.length : 0,
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Unknown error',
      error_type: error.name,
      error_code: error.code || 'unknown'
    }, { status: 500 });
  }
}