import connectDB from '@/lib/db';
import Admin from '@/models/admin';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectDB(); // ✅ this now works

    const { email, password } = await req.json();

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return new Response(JSON.stringify({ message: 'Admin not found' }), { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error) {
    console.error('Admin Login API Error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
