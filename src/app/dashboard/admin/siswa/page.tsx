import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { SiswaClient, StudentItem } from './_components/siswa-client';

export const instant = false;

export default async function AdminSiswaPage() {
  await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const [
    { data: students },
    { data: classrooms },
  ] = await Promise.all([
    supabase
      .from('students')
      .select(`
        id,
        nis,
        nisn,
        gender,
        birth_place,
        birth_date,
        address,
        is_active,
        created_at,
        profiles (
          name,
          email
        ),
        class_students (
          status,
          classrooms (
            id,
            name
          )
        )
      `)
      .order('nis'),

    supabase.from('classrooms').select('id, name').eq('is_active', true),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Data Pokok Peserta Didik (Murid)
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Daftar seluruh murid aktif sekolah, nomor induk siswa (NIS), biodata lahir, dan rombel binaan.
        </p>
      </div>

      <SiswaClient initialStudents={(students as unknown as StudentItem[]) || []} classrooms={classrooms || []} />
    </div>
  );
}
