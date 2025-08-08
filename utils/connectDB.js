// utils/connectDB.js
import { MongoClient } from 'mongodb';

let client;
let clientPromise;

export async function connectDB() {
  if (!clientPromise) {
    client = new MongoClient(process.env.MONGODB_URI);
    clientPromise = client.connect();
  }
  return clientPromise;
}
