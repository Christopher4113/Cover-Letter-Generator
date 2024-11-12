import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Middleware logic
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail' || path === '/forgot' || path === '/verifypassword' || path === '/start';
    const token = request.cookies.get('token')?.value || '';

    // Case 1: If you're on a public path and have a token, redirect to /profile
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/profile', request.nextUrl));
    }

    // Case 2: If you're on the root path ("/") and have a token, redirect to /profile
    if (path === '/' && token) {
        return NextResponse.redirect(new URL('/profile', request.nextUrl));
    }

    // Case 3: If you're on a private path and don't have a token, redirect to /start
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/start', request.nextUrl));
    }

    // No action needed if none of the above conditions match
}

// Matching paths for middleware
export const config = {
    matcher: [
        '/',           // Root path
        '/profile',     // Profile path
        '/login',       // Public login path
        '/signup',      // Public signup path
        '/verifyemail', // Public verify email path
        '/forgot',      // Public forgot password path
        '/verifypassword', // Public password verification path
        '/start',       // Start path
        '/resume',      // Resume path (private)
        '/coverletter'  // Cover letter path (private)
    ]
};