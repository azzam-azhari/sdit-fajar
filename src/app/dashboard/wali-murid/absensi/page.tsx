import { requireRole } from '@/lib/supabase/auth-helpers'; import { PageHeader } from '@/components/common/page-header';
export default async function Page(){await requireRole(['wali_murid']);return <PageHeader title="Presensi Anak" description="Riwayat kehadiran pembelajaran anak yang terhubung."/>}
