import { NextRequest, NextResponse } from 'next/server';

// Define client routes that require authentication
const protectedClientRoutes = [
  '/client/dashboard',
  '/client/bookings',
  '/client/treatments',
  '/client/reports',
  '/client/profile',
];

// Define admin routes that require authentication
const protectedAdminRoutes = [
  '/manal',
  '/manal/services',
  '/manal/bookings',
  '/admin',
  '/admin/services',
  '/admin/bookings',
];

// Define public client routes (no authentication required)
const publicClientRoutes = [
  '/client/login',
  '/client/register',
];

// Define public admin routes (no authentication required)
const publicAdminRoutes = [
  '/manal/login',
  '/admin/login',
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
  
  // Check if the route is a protected admin route
  const isProtectedAdminRoute = protectedAdminRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Check if the route is a public admin route
  const isPublicAdminRoute = publicAdminRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Get the client session cookie
  const clientSession = request.cookies.get('client_session');
  
  // Get the admin session cookie
  const adminSession = request.cookies.get('admin_session');
  
  // If it's a protected client route and no client session exists, redirect to login
  if (isProtectedClientRoute && !clientSession) {
    const url = new URL('/client/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // If it's a public client route and client session exists, redirect to dashboard
  if (isPublicClientRoute && clientSession) {
    return NextResponse.redirect(new URL('/client/dashboard', request.url));
  }
  
  // If it's a protected admin route and no admin session exists, redirect to login
  if (isProtectedAdminRoute && !adminSession) {
    const url = new URL('/admin/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // If it's a public admin route and admin session exists, redirect to dashboard
  if (isPublicAdminRoute && adminSession) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  // For all other routes, continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/client/:path*',
    '/manal/:path*',
    '/admin/:path*',
  ],
}; 