import { NextRequest, NextResponse } from 'next/server';

// Define client routes that require authentication
const protectedClientRoutes = [
  '/client/dashboard',
  '/client/bookings',
  '/client/treatments',
  '/client/reports',
  '/client/profile',
];

// Define public client routes (no authentication required)
const publicClientRoutes = [
  '/client/login',
  '/client/register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is a protected client route
  const isProtectedClientRoute = protectedClientRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Check if the route is a public client route
  const isPublicClientRoute = publicClientRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Get the client session cookie
  const clientSession = request.cookies.get('client_session');
  
  // If it's a protected route and no session exists, redirect to login
  if (isProtectedClientRoute && !clientSession) {
    const url = new URL('/client/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // If it's a public route (login/register) and session exists, redirect to dashboard
  if (isPublicClientRoute && clientSession) {
    return NextResponse.redirect(new URL('/client/dashboard', request.url));
  }
  
  // For all other routes, continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/client/:path*',
  ],
}; 