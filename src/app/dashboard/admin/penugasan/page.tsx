import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { PenugasanClient, AssignmentItem } from './_components/penugasan-client';

export const instant = false;

export default async function AdminPenugasanPage() {
  await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const [
    { data: assignments },
    { data: teachers },
    { data: subjects },
    { data: classrooms },
    { data: semesters },
  ] = await Promise.all([
    supabase
      .from('teaching_assignments')
      .select(`
        id,
        created_at,
        teachers (
          id,
          nip,
          profiles (
            name
          )
        ),
        subjects (
          id,
          name,
          code
        ),
        classrooms (
          id,
          name
        ),
        semesters (
          id,
          name,
          academic_years (
            name
          )
        )
      `)
      .order('created_at', { ascending: false }),

    supabase.from('teachers').select('id, nip, profiles(name)').eq('is_active', true),
    supabase.from('subjects').select('id, name, code').eq('is_active', true),
    supabase.from('classrooms').select('id, name').eq('is_active', true),
    supabase.from('semesters').select('id, name, academic_years(name)').eq('is_active', true),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Penugasan Mengajar Guru (Teaching Assignments)
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Tentukan guru pengampu untuk setiap mata pelajaran dan rombongan belajar pada semester aktif.
        </p>
      </div>

      <PenugasanClient
        initialAssignments={(assignments as unknown as AssignmentItem[]) || []}
        teachers={(teachers as unknown as { id: string; nip: string | null; profiles?: { name: string } }[]) || []}
        subjects={subjects || []}
        classrooms={classrooms || []}
        semesters={(semesters as unknown as { id: string; name: string; academic_years?: { name: string } }[]) || []}
      />
    </div>
  );
}
