import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { ROLE_DASHBOARD_PATH, UserRole } from '@/constants/auth';

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const isGuestRoute = pathname === '/login';
  const isChangePasswordRoute = pathname === '/ganti-password';
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Jika bukan rute yang perlu diproteksi atau diarahkan khusus, teruskan
  if (!isGuestRoute && !isChangePasswordRoute && !isDashboardRoute) {
    return supabaseResponse;
  }

  // 1. Kasus Pengguna Belum Login (Guest)
  if (!user) {
    if (isDashboardRoute || isChangePasswordRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  // 2. Kasus Pengguna Sudah Memiliki Sesi (Authenticated)
  // Ambil profil ringkas untuk memeriksa status aktif, kewajiban ganti password, dan role
  let role: UserRole | null = null;
  let isActive = true;
  let mustChangePassword = false;

  if (supabase) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active, must_change_password')
      .eq('id', user.id)
      .single();

    if (profile) {
      role = profile.role as UserRole;
      isActive = profile.is_active;
      mustChangePassword = profile.must_change_password;
    }
  }

  // A. Jika akun dinonaktifkan
  if (!isActive) {
    if (supabase) {
      await supabase.auth.signOut();
    }
    const inactiveUrl = new URL('/login', request.url);
    inactiveUrl.searchParams.set('error', 'inactive');
    return NextResponse.redirect(inactiveUrl);
  }

  // B. Jika pengguna wajib mengganti password perdana
  if (mustChangePassword) {
    if (!isChangePasswordRoute) {
      return NextResponse.redirect(new URL('/ganti-password', request.url));
    }
    return supabaseResponse;
  }

  // Jika sudah tidak perlu ganti password tapi membuka /ganti-password
  if (isChangePasswordRoute && !mustChangePassword && role) {
    const targetDashboard = ROLE_DASHBOARD_PATH[role] || '/dashboard';
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  // C. Jika user aktif membuka halaman guest (/login)
  if (isGuestRoute) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo');
    if (redirectTo && redirectTo.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    const defaultDashboard = role ? ROLE_DASHBOARD_PATH[role] : '/dashboard';
    return NextResponse.redirect(new URL(defaultDashboard, request.url));
  }

  // D. Role-based Guard pada /dashboard
  if (isDashboardRoute && role) {
    const roleDashboard = ROLE_DASHBOARD_PATH[role];

    // Jika membuka root /dashboard, redirect ke dashboard spesifik rolenya
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      return NextResponse.redirect(new URL(roleDashboard, request.url));
    }

    // Role-specific boundaries
    if (pathname.startsWith('/dashboard/super-admin') && role !== 'super_admin') {
      return NextResponse.redirect(new URL(roleDashboard, request.url));
    }

    if (
      pathname.startsWith('/dashboard/admin') &&
      role !== 'admin' &&
      role !== 'super_admin'
    ) {
      return NextResponse.redirect(new URL(roleDashboard, request.url));
    }

    if (pathname.startsWith('/dashboard/guru') && role !== 'guru') {
      return NextResponse.redirect(new URL(roleDashboard, request.url));
    }

    if (pathname.startsWith('/dashboard/murid') && role !== 'murid') {
      return NextResponse.redirect(new URL(roleDashboard, request.url));
    }

    if (pathname.startsWith('/dashboard/wali-murid') && role !== 'wali_murid') {
      return NextResponse.redirect(new URL(roleDashboard, request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml
     * - images, public files, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
