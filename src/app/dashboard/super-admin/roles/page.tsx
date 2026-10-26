import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { TeacherPositionsClient, TeacherPositionItem } from './_components/teacher-positions-client';

export default async function SuperAdminRolesPage() {
  await requireRole(['super_admin']);
  const supabase = await createClient();

  const [
    { data: assignments },
    { data: teachers },
    { data: positions },
    { data: classrooms },
    { data: academicYears },
  ] = await Promise.all([
    supabase
      .from('teacher_positions')
      .select(`
        id,
        is_active,
        created_at,
        teachers (
          id,
          nip,
          profiles (
            name,
            email
          )
        ),
        positions (
          id,
          name,
          code
        ),
        classrooms (
          id,
          name
        ),
        academic_years (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false }),

    supabase
      .from('teachers')
      .select(`
        id,
        nip,
        profiles (
          name
        )
      `)
      .eq('is_active', true),

    supabase.from('positions').select('id, name, code').eq('is_active', true),
    supabase.from('classrooms').select('id, name').eq('is_active', true),
    supabase.from('academic_years').select('id, name').eq('is_active', true),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Penugasan Jabatan Struktural Guru
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kelola penugasan 7 jabatan resmi di bawah role guru (Kepala Sekolah, Wali Kelas, Koordinator Tahfidz, Bendahara, dll).
        </p>
      </div>

      <TeacherPositionsClient
        initialAssignments={(assignments as unknown as TeacherPositionItem[]) || []}
        teachers={(teachers as unknown as { id: string; nip: string | null; profiles?: { name: string } }[]) || []}
        positions={positions || []}
        classrooms={classrooms || []}
        academicYears={academicYears || []}
      />
    </div>
  );
}
