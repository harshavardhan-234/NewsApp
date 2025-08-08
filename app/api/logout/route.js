import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect('/');

  // Clear login cookies
  response.cookies.set('token', '', { maxAge: 0 });
  response.cookies.set('subscriber_id', '', { maxAge: 0 });

  return response;
}
