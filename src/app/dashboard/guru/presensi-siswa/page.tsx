import { PageHeader } from '@/components/common/page-header';
import { requireRole } from '@/lib/supabase/auth-helpers';
export const instant = false;
export default async function GuruPresensiSiswaPage(){ await requireRole(['guru']); return <div className="space-y-6"><PageHeader title="Presensi Murid" description="Catat Hadir, Izin, Sakit, atau Alpa per jadwal pelajaran aktif."/><div className="rounded-xl border border-border/80 bg-card p-5 text-sm text-muted-foreground">Server menolak presensi pada akhir pekan, jadwal yang tidak berlangsung, dan murid di luar rombel.</div></div>; }
