import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";   // ✅ fixed import
import { sendEmail } from "@/lib/mailer";
import PremiumUser from "@/models/PremiumUser";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      name,
      phone,
      password,
      plan,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing payment details." },
        { status: 400 }
      );
    }

    // ✅ Signature validation
    // Use RAZORPAY_KEY_SECRET for signature verification (same as API secret)
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpaySecret) {
      console.error('RAZORPAY_KEY_SECRET environment variable is not defined');
      return NextResponse.json({ error: 'Payment verification failed: Missing configuration' }, { status: 500 });
    }
    
    const hmac = crypto.createHmac("sha256", razorpaySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature." },
        { status: 400 }
      );
    }

    // ✅ Connect DB
    try {
      await connectDB();
    } catch (dbError) {
      console.error('❌ Database connection error:', dbError);
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection failed. Please try again later.' 
      }, { status: 500 });
    }

    // ✅ Prevent duplicate user
    const existingUser = await PremiumUser.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists. Please login." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new PremiumUser({
      name,
      email,
      phone,
      password: hashedPassword,
      plan,
      razorpay_payment_id, // ✅ Save payment reference
    });

    await newUser.save();

    // ✅ Try sending email
    try {
      await sendEmail({
        to: email,
        subject: "✅ Subscription Confirmed - Thank You for Your Payment!",
        html: `
          <h2>Hello ${name},</h2>
          <p>Thank you for subscribing. Your payment for the <strong>${plan} month(s)</strong> plan is successful.</p>
          <p><b>Payment ID:</b> ${razorpay_payment_id}</p>
          <p>You can now access premium news instantly 🎉</p>
          <br/>
          <p>Regards,<br/>News Portal Team</p>
        `,
      });
    } catch (mailErr) {
      console.warn(`⚠️ Could not send email to ${email}:`, mailErr.message);
    }

    // ✅ Set cookie
    cookies().set("subscriber_id", newUser._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });

    // Store user data in response for client-side storage
    return NextResponse.json(
      {
        success: true,
        token: newUser._id,
        redirectUrl: "/subscribe/email-confirmation",
        userData: {
          name,
          email,
          phone,
          plan,
          paymentMethod: "Razorpay",
          paymentId: razorpay_payment_id
        }
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error in verify-payment:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
