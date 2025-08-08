import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const imageFile = formData.get('image');

  if (!imageFile) {
    return NextResponse.json({ message: 'No image provided' }, { status: 400 });
  }

  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const imagePath = path.join(process.cwd(), 'public/uploads/default.jpg');
  await writeFile(imagePath, buffer);

  return NextResponse.json({ message: 'Default image uploaded successfully' });
}
