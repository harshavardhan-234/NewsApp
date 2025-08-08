import connectDB from '@/lib/mongoose';
import News from '@/models/News';
import { notFound } from 'next/navigation';

export default async function NewsDetail({ params }) {
  const { slug } = params;

  await connectDB();

  const news = await News.findOne({ slug });
  if (!news) return notFound();

  const createdAt = new Date(news.createdAt);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{news.title}</h1>
      <p><strong>Date:</strong> {createdAt.toLocaleString()}</p>
      <img
        src={news.image || '/no-image.jpg'}
        alt={news.title}
        style={{
          width: '100%',
          height: '400px',
          objectFit: 'cover',
          borderRadius: '10px'
        }}
      />
      <p style={{ marginTop: '20px' }}>{news.description}</p>
    </div>
  );
}
