// app/api/news/category/[slug]/route.js
import connectDB from '../../../../../lib/db';
import News from '../../../../../models/News.js';
import { cookies } from 'next/headers';
import PremiumUser from '../../../../../models/PremiumUser.js';

export async function GET(req, { params }) {
  await connectDB();
  const { slug } = params;

  // Check token from cookies
  const token = cookies().get('token')?.value || null;
  const user = token ? await PremiumUser.findOne({ token }) : null;
  const isPremium = !!user;

  const newsList = await News.find({ category: slug }).sort({ createdAt: -1 });

  const now = new Date();

  const data = newsList.map(news => {
    const createdAt = new Date(news.createdAt);
    const diffMinutes = Math.floor((now - createdAt) / (1000 * 60));
    const locked = diffMinutes < 30 && !isPremium;

    return {
      _id: news._id,
      title: news.title,
      slug: news.slug,
      category: news.category,
      description: locked ? null : news.description,
      image: news.image,
      createdAt: news.createdAt,
      locked,
    };
  });

  return Response.json({ news: data });
}
