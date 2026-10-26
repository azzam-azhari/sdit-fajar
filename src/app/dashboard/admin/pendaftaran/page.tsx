import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { PpdbVerificationClient, ApplicationItem } from './_components/ppdb-verification-client';

export default async function AdminPpdbVerificationPage() {
  await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const [
    { data: applications },
    { data: waves },
    { data: classrooms },
  ] = await Promise.all([
    supabase
      .from('student_registration_applications')
      .select(`
        id,
        admission_wave_id,
        registration_number,
        student_name,
        nik,
        nisn,
        gender,
        birth_place,
        birth_date,
        address,
        parent_name,
        parent_phone,
        parent_email,
        father_name,
        father_occupation,
        mother_name,
        mother_occupation,
        status,
        observation_score,
        admin_notes,
        created_at,
        admission_waves (
          id,
          title,
          wave_number
        )
      `)
      .order('created_at', { ascending: false }),

    supabase.from('admission_waves').select('id, title, wave_number').order('wave_number'),
    supabase.from('classrooms').select('id, name').eq('is_active', true),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Verifikasi Pendaftaran PPDB Online
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Tinjau berkas pendaftaran calon murid baru, periksa kelengkapan administrasi, dan promosikan siswa terpilih ke basis data akademik aktif.
        </p>
      </div>

      <PpdbVerificationClient
        initialApplications={(applications as unknown as ApplicationItem[]) || []}
        waves={waves || []}
        classrooms={classrooms || []}
      />
    </div>
  );
}
