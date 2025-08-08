// lib/saveSubscriber.js
import bcrypt from 'bcrypt';
import connectDB from './mongoose';
import PremiumUser from '../models/PremiumUser';

export async function saveSubscriber({ name, email, phone, password, plan, paymentId }) {
  await connectDB();

  const hashedPassword = await bcrypt.hash(password, 10);

  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + plan); // Add plan months

  const newUser = new PremiumUser({
    name,
    email,
    phone,
    password: hashedPassword,
    plan,
    expiresAt,
  });

  await newUser.save();
}
