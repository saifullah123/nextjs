import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Handle admin routes specifically (bypass intl)
    if (pathname.startsWith('/admin')) {
        if (!pathname.startsWith('/admin/login')) {
            const token = request.cookies.get('auth-token');
            if (!token) {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }

            const payload = await verifyToken(token.value);
            if (!payload) {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }
        } else {
            const token = request.cookies.get('auth-token');
            if (token) {
                const payload = await verifyToken(token.value);
                if (payload) {
                    return NextResponse.redirect(new URL('/admin', request.url));
                }
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
