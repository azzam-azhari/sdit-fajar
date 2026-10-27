import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/common/page-header';
import { ZebraDataTable } from '@/components/common/zebra-data-table';

type MaterialRow = { id: string; title: string; status: string; created_at: string };
export const instant = false;
export default async function GuruMateriPage() {
  const { user } = await requireRole(['guru']); const supabase = await createClient();
  const { data: teacher } = await supabase.from('teachers').select('id').eq('profile_id', user.id).single();
  const { data } = teacher ? await supabase.from('materials').select('id,title,status,created_at').eq('teacher_id', teacher.id).order('created_at', { ascending: false }) : { data: [] as MaterialRow[] };
  return <div className="space-y-6"><PageHeader title="Materi Pembelajaran" description="Materi hanya dapat dipublikasikan untuk rombel dan mapel yang Anda ampu." /><ZebraDataTable<MaterialRow> data={data ?? []} columns={[{header:'Judul', accessorKey:'title'}, {header:'Status', accessorKey:'status'}, {header:'Dibuat', cell:(row) => new Intl.DateTimeFormat('id-ID').format(new Date(row.created_at))}]} keyExtractor={(row) => row.id} emptyText="Belum ada materi. Gunakan formulir materi untuk membuat materi baru." /></div>;
}
