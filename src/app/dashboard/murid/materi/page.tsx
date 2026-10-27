import { requireRole } from '@/lib/supabase/auth-helpers'; import { PageHeader } from '@/components/common/page-header';
export const instant = false;
export default async function Page(){await requireRole(['murid']);return <PageHeader title="Materi Pembelajaran" description="Materi yang telah dipublikasikan untuk rombel Anda tampil di sini."/>}
