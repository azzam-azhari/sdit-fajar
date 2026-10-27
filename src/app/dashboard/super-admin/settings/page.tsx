import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { SchoolSettingsForm } from './_components/school-settings-form';

export const instant = false;

export default async function SuperAdminSettingsPage() {
  await requireRole(['super_admin']);
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from('school_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Identitas & Narahubung Resmi Sekolah
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Konfigurasi nama sekolah, alamat, kontak WhatsApp, email, dan peta lokasi yang ditampilkan pada portal publik.
        </p>
      </div>

      <SchoolSettingsForm initialSettings={settings} />
    </div>
  );
}
