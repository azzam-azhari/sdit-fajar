import { requireRole } from '@/lib/supabase/auth-helpers'; import { PageHeader } from '@/components/common/page-header';
export default async function Page(){await requireRole(['wali_murid']);return <PageHeader title="Nilai Anak" description="Nilai hanya tersedia untuk anak yang terhubung ke akun Anda."/>}
