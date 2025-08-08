// app/api/get-user-details/route.js

import { getToken } from "next-auth/jwt";
import connectDB from '@/lib/mongoose'; // ✅ correct path

import PremiumUser from "@/models/PremiumUser";

export async function GET(req) {
  try {
    // 1. Get token from cookies (via next-auth)
    const token = await getToken({ req });

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // 2. Connect to DB
    await connectDB();

    // 3. Find user by email from token
    const user = await PremiumUser.findOne({ email: token.email }).lean();

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // 4. Remove password before sending response
    delete user.password;

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("❌ get-user-details API error:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
