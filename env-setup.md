# Environment Setup for Admin Login

To fix the server error, you need to create a `.env.local` file in the root directory with your MongoDB connection string.

## Steps:

1. Create a file named `.env.local` in the `gnews-app` directory
2. Add the following content:

```
MONGODB_URI=mongodb://localhost:27017/news_portal
```

Or if you're using MongoDB Atlas:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/news_portal?retryWrites=true&w=majority
```

## Alternative: Quick Setup Script

Run the setup script to create the admin user:

```bash
node setup-admin.js
```

This will:
- Connect to MongoDB (update the MONGODB_URI in the script if needed)
- Create admin user with email: admin@gmail.com
- Set password: Harsha@123
- Mark user as admin

## Admin Login URL

After setup, access admin login at: `http://localhost:3000/admin/login`
