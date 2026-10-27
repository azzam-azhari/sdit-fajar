import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { UserManagementClient } from './_components/user-management-client';

export const instant = false;

export default async function SuperAdminUsersPage() {
  await requireRole(['super_admin']);
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, email, login_identifier, role, is_active, must_change_password, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Manajemen Seluruh Pengguna
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kontrol akses, status keaktifan, dan reset kredensial untuk seluruh akun 5 role resmi sekolah.
        </p>
      </div>

      <UserManagementClient initialUsers={profiles || []} />
    </div>
  );
}
