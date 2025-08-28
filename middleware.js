import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request (e.g. /, /admin)
  const path = request.nextUrl.pathname;

  // Define paths that are considered admin routes
  const isAdminRoute = path.startsWith('/admin') && 
                      !path.startsWith('/admin/login') &&
                      !path.startsWith('/admin/logout');

  // Get the token from cookies
  const adminToken = request.cookies.get('admin_token')?.value;

  // If it's an admin route and there is no admin token, redirect to admin login
  if (isAdminRoute && !adminToken) {
    const url = new URL('/admin/login', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure the paths that should be matched by this middleware
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};