import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { RombelClient, ClassroomItem } from './_components/rombel-client';

export const instant = false;

export default async function AdminRombelPage() {
  await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const [
    { data: classrooms },
    { data: classes },
    { data: academicYears },
    { data: teachers },
  ] = await Promise.all([
    supabase
      .from('classrooms')
      .select(`
        id,
        name,
        is_active,
        created_at,
        class_id,
        academic_year_id,
        homeroom_teacher_id,
        classes (
          id,
          name,
          grade_level
        ),
        academic_years (
          id,
          name
        ),
        teachers (
          id,
          nip,
          profiles (
            name
          )
        )
      `)
      .order('name'),

    supabase.from('classes').select('id, name, grade_level').order('grade_level'),
    supabase.from('academic_years').select('id, name').order('name', { ascending: false }),
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
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Rombongan Belajar (Rombel) & Wali Kelas
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kelola rombel kelas per tahun ajaran, kapasitas murid, dan penetapan guru pembina / wali kelas.
        </p>
      </div>

      <RombelClient
        initialClassrooms={(classrooms as unknown as ClassroomItem[]) || []}
        classes={classes || []}
        academicYears={academicYears || []}
        teachers={(teachers as unknown as { id: string; nip: string | null; profiles?: { name: string } }[]) || []}
      />
    </div>
  );
}
