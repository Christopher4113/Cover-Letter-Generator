import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

//logic
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail' || path ==='/forgot' || path === '/verifypassword'

    const token = request.cookies.get('token')?.value || ''

    if(isPublicPath && token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login',request.nextUrl))
    }
}

//matching
export const config = {
    matcher: [
        '/',
        '/profile',
        '/login',
        '/signup',
        '/verifyemail',
        '/forgot',
        '/verifypassword'
    ]
}