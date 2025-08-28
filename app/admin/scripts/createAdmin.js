import bcrypt from 'bcryptjs';
import connectDB from '../lib/db.js';   // adjust path to your db.js
import Admin from '../models/Admin.js';

async function createAdmin() {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log('✅ Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Harsha@123', 10);

    const admin = new Admin({
      email: 'admin@gmail.com',
      password: hashedPassword,
    });

    await admin.save();
    console.log('🎉 Admin created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
