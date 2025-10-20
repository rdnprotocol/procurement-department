import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "procurement-department";

// Эрх шалгах middleware
export async function middleware(request: NextRequest) {
  // Admin хуудас руу хандсан эсэхийг шалгах
  if (request.nextUrl.pathname.startsWith('/admin')) {
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
      return NextResponse.next();
    } catch (error) {
      // Token хүчингүй бол login хуудас руу чиглүүлэх
      console.error('Middleware: Token verification failed:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Middleware ажиллах route-уудыг тодорхойлох
export const config = {
  matcher: ['/admin/:path*']
}