import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  throw new Error("❌ Please add MONGODB_URI to your .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In dev, reuse the client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In prod, create new connection
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("test"); // change if needed
    const news = db.collection("news");

    // Total news count
    const total = await news.countDocuments();

    // Today's range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const today = await news.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    return NextResponse.json({ total, today });
  } catch (err) {
    console.error("❌ Error fetching dashboard stats:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
