import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Profile } from '@/types/auth.types';
import { UserRole, ROLE_DASHBOARD_PATH } from '@/constants/auth';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export async function getCurrentUser(): Promise<User | null> {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    return null;
  }

  return profile as Profile;
}

export async function requireUser(): Promise<{ user: User; profile: Profile }> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    redirect('/login');
  }

  if (!profile.is_active) {
    redirect('/login?error=inactive');
  }

  if (profile.must_change_password) {
    redirect('/ganti-password');
  }

  return { user, profile };
}

export async function requireRole(
  allowedRoles: UserRole[]
): Promise<{ user: User; profile: Profile }> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    redirect('/login');
  }

  if (!profile.is_active) {
    redirect('/login?error=inactive');
  }

  if (profile.must_change_password) {
    redirect('/ganti-password');
  }

  if (!allowedRoles.includes(profile.role)) {
    redirect(ROLE_DASHBOARD_PATH[profile.role] || '/login');
  }

  return { user, profile };
}
