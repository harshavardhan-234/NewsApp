// setup-admin.js - Simple admin user creation script
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string - update this with your actual MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news_portal';

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
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      dbName: 'news_portal',
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await PremiumUser.findOne({ email: 'admin@gmail.com' });
    
    if (existingAdmin) {
      console.log('📝 Admin user already exists, updating...');
      // Update password and ensure admin flag is set
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
      console.log('✅ Admin user updated successfully');
    } else {
      // Create new admin user
      console.log('👤 Creating new admin user...');
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
      console.log('✅ Admin user created successfully');
    }
    
    console.log('🔐 Admin Login Credentials:');
    console.log('   Email: admin@gmail.com');
    console.log('   Password: Harsha@123');
    console.log('🌐 Login URL: http://localhost:3000/admin/login');
    
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script
createAdmin();
