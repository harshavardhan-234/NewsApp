// app/api/admin/logout/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Delete the admin_token cookie
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  
  // Redirect to login page
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'));
}