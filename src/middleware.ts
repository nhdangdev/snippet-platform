import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard');
  const isOnProfile = req.nextUrl.pathname.startsWith('/profile');

  if ((isOnDashboard || isOnProfile) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  const isOnAuthPage = req.nextUrl.pathname.startsWith('/auth');
  if (isOnAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};