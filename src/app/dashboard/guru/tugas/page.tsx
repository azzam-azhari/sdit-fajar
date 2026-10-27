import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/common/page-header';
import { ZebraDataTable } from '@/components/common/zebra-data-table';
type AssignmentRow = { id: string; title: string; status: string; due_at: string };
export const instant = false;
export default async function GuruTugasPage() {
  const { user } = await requireRole(['guru']); const supabase = await createClient(); const { data: teacher } = await supabase.from('teachers').select('id').eq('profile_id', user.id).single();
  const { data } = teacher ? await supabase.from('assignments').select('id,title,status,due_at').eq('teacher_id', teacher.id).order('due_at') : { data: [] as AssignmentRow[] };
  return <div className="space-y-6"><PageHeader title="Tugas & Penilaian" description="Kelola tugas, tenggat, dan pengumpulan untuk kelas yang Anda ampu." /><ZebraDataTable<AssignmentRow> data={data ?? []} columns={[{header:'Tugas',accessorKey:'title'},{header:'Status',accessorKey:'status'},{header:'Tenggat',cell:(row)=>new Intl.DateTimeFormat('id-ID',{dateStyle:'medium',timeStyle:'short'}).format(new Date(row.due_at))}]} keyExtractor={(row)=>row.id} emptyText="Belum ada tugas." /></div>;
}
