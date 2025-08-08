// app/category/[slug]/page.js
import connectDB from '@/lib/mongoose';
import News from '@/models/News';
import PremiumUser from '@/models/PremiumUser';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }) {
  const { slug } = params;

  await connectDB();

  // ✅ Get the logged-in session
  const session = await getServerSession(authOptions);

  let isPremiumUser = null;

  if (session?.user?.email) {
    isPremiumUser = await PremiumUser.findOne({ email: session.user.email });
  }

  let newsList = [];
  try {
    newsList = await News.find({
      category: { $regex: new RegExp(slug, 'i') }
    }).sort({ createdAt: -1 });
  } catch (err) {
    console.error('Error fetching news:', err);
    return notFound();
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>News in: <span style={{ textTransform: 'capitalize' }}>{slug}</span></h1>

      {newsList.length === 0 ? (
        <p>No news found for <strong>{slug}</strong></p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {newsList.map((news) => {
            const createdAt = new Date(news.createdAt);
            const now = new Date();
            const diffMinutes = Math.floor((now - createdAt) / (1000 * 60));
            const isLocked = diffMinutes < 30 && !isPremiumUser;

            return (
              <div key={news._id} style={{
                border: '1px solid #ccc',
                padding: '15px',
                borderRadius: '8px'
              }}>
                <img
                  src={news.image || '/no-image.jpg'}
                  alt={news.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
                <h2>{news.title}</h2>
                <p>{createdAt.toLocaleString()}</p>

                {isLocked ? (
                  <>
                    <p style={{ color: 'red' }}>🔒 This news is for premium users only</p>
                    <a href="/subscribe" style={{
                      background: '#0070f3',
                      color: '#fff',
                      padding: '10px 15px',
                      borderRadius: '6px',
                      display: 'inline-block',
                      marginTop: '10px',
                      textDecoration: 'none'
                    }}>Subscribe to Read</a>
                  </>
                ) : (
                  <>
                    <p>{news.description?.substring(0, 100)}...</p>
                    <a href={`/news/${news.slug}`}>Read more</a>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
