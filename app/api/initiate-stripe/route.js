import Stripe from "stripe";
import dbConnect from "@/lib/db";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { plan } = await req.json();

    // Map plans to amounts (in paise, since Stripe expects smallest unit)
    const plans = {
      "1": { amount: 9900, name: "1 Month Plan" },   // ₹99 → 9900 paise
      "2": { amount: 19900, name: "2 Month Plan" },  // ₹199
      "3": { amount: 29900, name: "3 Month Plan" },  // ₹299
      "6": { amount: 59900, name: "6 Month Plan" },  // ₹599
    };

    if (!plans[plan]) {
      return new Response(JSON.stringify({ success: false, message: "Invalid plan" }), { status: 400 });
    }

    // ✅ Create Stripe Checkout Session
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
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    return new Response(JSON.stringify({ success: true, url: session.url }), {
      status: 200,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
    });
  }
}
