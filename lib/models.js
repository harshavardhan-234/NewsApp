import connectDB from '@/lib/db';

let db;

export async function getDB() {
  if (!db) {
    const client = await connectDB();
    db = client.db('test'); // Your DB name
    db = client.db('test'); // ✅ Your DB name
  }
  return db;
}

export async function getSubscribersCollection() {
  const database = await getDB();
  return database.collection('subscribers');
}
