import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import News from "@/models/News";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const slug = formData.get("slug");
    const category = formData.get("category");
    const imageFile = formData.get("image");

    // Default image path
    let imagePathInDB = "/uploads/default.jpg";

    // If image is uploaded, process and save
    if (imageFile && typeof imageFile.name === "string" && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const imageName = uuidv4() + "_" + imageFile.name;
      const savePath = path.join(process.cwd(), "public/uploads", imageName);
      await writeFile(savePath, buffer);
      imagePathInDB = "/uploads/" + imageName;
    }

    // Create new news document
    const newNews = new News({
      title,
      description,
      slug,
      category,
      image: imagePathInDB,
      createdAt: new Date(),
    });

    await newNews.save();

    return NextResponse.json({ success: true, message: "News added successfully" });
  } catch (error) {
    console.error("❌ Error adding news:", error);
    return NextResponse.json({ success: false, message: "Failed to add news" }, { status: 500 });
  }
}
