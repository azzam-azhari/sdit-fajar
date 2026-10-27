import { requireRole } from '@/lib/supabase/auth-helpers'; import { PageHeader } from '@/components/common/page-header';
export const instant = false;
export default async function Page(){await requireRole(['wali_murid']);return <PageHeader title="Tugas Anak" description="Pantau tugas dan status pengumpulan anak yang terhubung."/>}
