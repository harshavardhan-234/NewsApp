// Script to fix all connectDB imports in the project
const fs = require('fs');
const path = require('path');

const filesToFix = [
  'app/api/add-city/route.js',
  'app/api/admin/change-password/route.js',
  'app/api/cities/route.js',
  'app/api/countries/route.js',
  'app/api/delete/route.js',
  'app/api/get-user-details/route.js',
  'app/api/locations/add-city/route.js',
  'app/api/locations/add-country/add-state/route.js',
  'app/api/locations/add-country/route.js',
  'app/api/news/add/route.js',
  'app/api/news/category/[slug]/route.js',
  'app/api/news/update/route.js',
  'app/api/news/[id]/route.js',
  'app/api/reset-password/route.js',
  'app/api/search/route.js',
  'app/api/send-otp/route.js',
  'app/api/settings/get/route.js',
  'app/api/settings/update/route.js',
  'app/api/site-settings/route.js',
  'app/api/states/route.js',
  'app/api/states-by-country/route.js',
  'app/api/subscribe/route.js',
  'app/api/verify-payment/route.js',
  'app/api/verify-stripe-payment/route.js'
];

console.log('🔧 Fixing connectDB imports...');

filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace the incorrect import
    const oldImport = "import { connectDB } from '@/lib/db';";
    const newImport = "import connectDB from '@/lib/db';";
    
    if (content.includes(oldImport)) {
      content = content.replace(oldImport, newImport);
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
    } else {
      console.log(`⏭️  Skipped: ${filePath} (already correct or not found)`);
    }
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

console.log('🎉 All imports fixed!');
