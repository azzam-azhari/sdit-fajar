import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { MapelClient } from './_components/mapel-client';

export const instant = false;

export default async function AdminMapelPage() {
  await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .order('name');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Master Mata Pelajaran Kurikulum Islam Terpadu
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kelola daftar mata pelajaran kurikulum nasional dan kekhasan Islam terpadu (Tahfidz, PAI, Bahasa Arab, Sains, dll).
        </p>
      </div>

      <MapelClient initialSubjects={subjects || []} />
    </div>
  );
}
