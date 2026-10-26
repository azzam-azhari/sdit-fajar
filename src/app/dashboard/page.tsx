import { requireUser } from '@/lib/supabase/auth-helpers';
import { ROLE_DASHBOARD_PATH } from '@/constants/auth';
import { redirect } from 'next/navigation';

export default async function DashboardRootPage() {
  const { profile } = await requireUser();
  const targetPath = ROLE_DASHBOARD_PATH[profile.role] || '/dashboard/murid';
  redirect(targetPath);
}
