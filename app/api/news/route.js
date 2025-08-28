import { NextResponse } from "next/server";
import connectDB from '../../../lib/db';
import News from "../../../models/News.js";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let query = {};
    if (category) query.category = category;

    // Use .lean() to return plain JSON
    const newsList = await News.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json(newsList);
  } catch (err) {
    console.error("❌ Error fetching news:", err);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectDB();

  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const slug = formData.get("slug");
    const category = formData.get("category");
    const keywords = formData.get("keywords");
    const image = formData.get("image");

    let imagePath = null;
    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = `${Date.now()}_${image.name}`;
      const filepath = path.join(process.cwd(), "public/uploads", filename);
      await writeFile(filepath, buffer);
      imagePath = `/uploads/${filename}`;
    }

    const news = await News.create({
      title,
      description,
      slug,
      category,
      keywords,
      image: imagePath,
    });

    return NextResponse.json({ success: true, news });
  } catch (err) {
    console.error("❌ Error adding news:", err);
    console.error("Error details:", err.message);
    console.error("MONGODB_URI exists:", !!process.env.MONGODB_URI);
    return NextResponse.json({ 
      error: "Failed to add news", 
      details: err.message,
      success: false 
    }, { status: 500 });
  }
}
