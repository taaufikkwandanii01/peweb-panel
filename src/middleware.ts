import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get current session
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith('/auth');
  const isAdminPage = pathname.startsWith('/admin');
  const isDeveloperPage = pathname.startsWith('/developer');
  const isProtectedPage = isAdminPage || isDeveloperPage;

  console.log('Middleware - Path:', pathname);
  console.log('Middleware - User:', user ? `${user.email} (${user.user_metadata?.role})` : 'None');

  // Jika tidak ada user dan mencoba akses protected pages
  if (!user && isProtectedPage) {
    console.log('Middleware - Redirecting to login: No user session');
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Jika ada user dan mencoba akses auth pages
  if (user && isAuthPage) {
    const userRole = user.user_metadata?.role as string | undefined;
    const userStatus = user.user_metadata?.status as string | undefined;

    console.log('Middleware - User status:', userStatus);

    // Jika status pending atau rejected, logout dan biarkan di auth page
    if (userStatus !== 'approved') {
      console.log('Middleware - User not approved, logging out');
      await supabase.auth.signOut();
      return response;
    }

    // Jika status approved, redirect ke dashboard
    console.log('Middleware - User approved, redirecting to dashboard');
    if (userRole === 'admin') {
      const dashboardUrl = new URL('/admin/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    } else if (userRole === 'developer') {
      const dashboardUrl = new URL('/developer/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Role-based access control untuk protected pages
  if (user && isProtectedPage) {
    const userRole = user.user_metadata?.role as string | undefined;
    const userStatus = user.user_metadata?.status as string | undefined;

    // Double check status
    if (userStatus !== 'approved') {
      console.log('Middleware - User not approved, redirecting to login');
      await supabase.auth.signOut();
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Admin trying to access developer pages
    if (isDeveloperPage && userRole === 'admin') {
      console.log('Middleware - Admin accessing developer page, redirecting');
      const adminDashboard = new URL('/admin/dashboard', request.url);
      return NextResponse.redirect(adminDashboard);
    }

    // Developer trying to access admin pages
    if (isAdminPage && userRole === 'developer') {
      console.log('Middleware - Developer accessing admin page, redirecting');
      const devDashboard = new URL('/developer/dashboard', request.url);
      return NextResponse.redirect(devDashboard);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/admin/:path*',
    '/developer/:path*',
  ],
};
