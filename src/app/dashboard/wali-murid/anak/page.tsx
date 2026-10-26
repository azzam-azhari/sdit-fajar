import { requireRole } from '@/lib/supabase/auth-helpers'; import { PageHeader } from '@/components/common/page-header';
export default async function Page(){await requireRole(['wali_murid']);return <PageHeader title="Data Anak" description="Pilih anak pada dashboard untuk melihat perkembangan akademiknya."/>}
