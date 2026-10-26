import { requireRole } from '@/lib/supabase/auth-helpers'; import { PageHeader } from '@/components/common/page-header';
export default async function Page(){await requireRole(['murid']);return <PageHeader title="Nilai Saya" description="Nilai tugas dan nilai akhir semester hanya dapat dilihat oleh Anda."/>}
