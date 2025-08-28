// scripts/create-admin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'news_portal',
}).then(() => {
  console.log('✅ Connected to MongoDB');
  createAdmin();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Define PremiumUser schema
const premiumUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  plan: Number,
  expiresAt: Date,
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

const PremiumUser = mongoose.models.PremiumUser || mongoose.model('PremiumUser', premiumUserSchema);

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await PremiumUser.findOne({ email: 'admin@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      // Update password if needed
      const hashedPassword = await bcrypt.hash('Harsha@123', 10);
      await PremiumUser.updateOne(
        { email: 'admin@gmail.com' },
        { 
          $set: { 
            password: hashedPassword,
            isAdmin: true 
          } 
        }
      );
      console.log('Admin password updated');
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('Harsha@123', 10);
      
      const admin = new PremiumUser({
        name: 'Admin',
        email: 'admin@gmail.com',
        phone: '1234567890',
        password: hashedPassword,
        plan: 12, // 12 months plan
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        isAdmin: true,
      });
      
      await admin.save();
      console.log('Admin user created successfully');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}