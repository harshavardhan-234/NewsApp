import { connectDB } from "@/lib/db";
import News from "@/models/News"; // Your Mongoose model

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return Response.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    await connectDB();

    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return Response.json({ success: false, message: "News not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "News deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
