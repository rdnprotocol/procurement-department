import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "procurement-department";

// Эрх шалгах middleware
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Request headers-д pathname нэмэх (бүх route-д)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // Admin хуудас руу хандсан эсэхийг шалгах
  if (pathname.startsWith('/admin')) {
    console.log('Middleware: Checking admin access...');
    
    const token = request.cookies.get('token')?.value;
    console.log('Middleware: Token exists:', !!token);

    // Token байхгүй бол login хуудас руу чиглүүлэх
    if (!token) {
      console.log('Middleware: No token found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Token-г шалгах
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jose.jwtVerify(token, secret);
      console.log('Middleware: Token verified, payload:', payload);
      
      // Check if user has admin role
      if (payload && typeof payload === 'object' && 'role' in payload) {
        if (payload.role !== 'admin') {
          console.log('Middleware: User is not admin, redirecting to login');
          return NextResponse.redirect(new URL('/login', request.url));
        }
      }
      
      console.log('Middleware: Access granted');
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Token хүчингүй бол login хуудас руу чиглүүлэх
      console.error('Middleware: Token verification failed:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Бусад хуудсуудад headers дамжуулах
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Middleware бүх route дээр ажиллах (static files-аас бусад)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf)$).*)',
  ],
}