import { requireRole } from '@/lib/supabase/auth-helpers'; import { PageHeader } from '@/components/common/page-header';
export default async function Page(){await requireRole(['murid']);return <PageHeader title="Tugas Saya" description="Kumpulkan jawaban sendiri sebelum tenggat yang ditetapkan guru."/>}
