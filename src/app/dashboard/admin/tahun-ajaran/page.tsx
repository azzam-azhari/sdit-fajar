import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { TahunAjaranClient, SemesterItem } from './_components/tahun-ajaran-client';

export const instant = false;

export default async function AdminTahunAjaranPage() {
  await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const [
    { data: years },
    { data: semesters },
    { data: periodSettings },
  ] = await Promise.all([
    supabase.from('academic_years').select('*').order('start_date', { ascending: false }),
    supabase.from('semesters').select('*, academic_years(name)').order('start_date', { ascending: false }),
    supabase.from('school_period_settings').select('*').limit(1).maybeSingle(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Tahun Ajaran, Semester & Periode Operasional
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Atur kalender akademik sekolah, penetapan tahun ajaran aktif, dan periode bulan berjalan untuk presensi serta rapor.
        </p>
      </div>

      <TahunAjaranClient
        initialYears={years || []}
        initialSemesters={(semesters as unknown as SemesterItem[]) || []}
        initialPeriod={periodSettings}
      />
    </div>
  );
}
