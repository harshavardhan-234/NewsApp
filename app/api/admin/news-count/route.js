import { connectDB } from "@/lib/db";
import News from "@/models/News";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    
    const total = await News.countDocuments();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const today = await News.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    return NextResponse.json({ total, today });
  } catch (err) {
    console.error("❌ Error fetching dashboard stats:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
