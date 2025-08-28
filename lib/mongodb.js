// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI in .env.local');
}

client = new MongoClient(uri, options);
clientPromise = client.connect();

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db('news_portal'); // Use your database name
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw new Error('Failed to connect to the database');
  }
}

export default clientPromise;