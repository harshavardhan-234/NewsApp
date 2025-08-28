// app/api/admin/news-count/route.js
import clientPromise from "../../../../lib/clientPromise.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("test"); // 👈 your DB name
    const news = db.collection("news");

    const total = await news.countDocuments();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const today = await news.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    return NextResponse.json({ total, today });
  } catch (err) {
    console.error("❌ Error fetching news count:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
