// create-admin-api.js - Create admin user via API endpoint
const bcrypt = require('bcryptjs');

async function createAdminViaAPI() {
  try {
    console.log('🔧 Creating admin user via direct database insertion...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('Harsha@123', 10);
    
    // Create admin user data
    const adminData = {
      name: 'Admin',
      email: 'admin@gmail.com',
      phone: '1234567890',
      password: hashedPassword,
      plan: 12,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isAdmin: true,
    };
    
    console.log('📝 Admin user data prepared:');
    console.log('   Email:', adminData.email);
    console.log('   Hashed Password:', hashedPassword);
    console.log('   Is Admin:', adminData.isAdmin);
    
    // Make API call to create user
    const response = await fetch('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Admin user created successfully via API');
      console.log('🔐 Login with: admin@gmail.com / Harsha@123');
    } else {
      console.log('⚠️ API not available. Manual database insertion required.');
      console.log('📋 Use this data to manually create the admin user:');
      console.log(JSON.stringify(adminData, null, 2));
    }
    
  } catch (error) {
    console.log('⚠️ API approach failed. Here\'s the admin user data for manual insertion:');
    
    const hashedPassword = await bcrypt.hash('Harsha@123', 10);
    const adminData = {
      name: 'Admin',
      email: 'admin@gmail.com',
      phone: '1234567890',
      password: hashedPassword,
      plan: 12,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isAdmin: true,
    };
    
    console.log('📋 Copy this data and insert it directly into your MongoDB PremiumUser collection:');
    console.log(JSON.stringify(adminData, null, 2));
  }
}

createAdminViaAPI();
