import { PageHeader } from '@/components/common/page-header';
import { requireRole } from '@/lib/supabase/auth-helpers';
export const instant = false;
export default async function GuruPresensiPage(){ await requireRole(['guru']); return <div className="space-y-6"><PageHeader title="Presensi Guru" description="Check-in tersedia 06.30–07.30 WIB dan check-out mulai 14.30 WIB. Waktu server menjadi sumber kebenaran."/><div className="rounded-xl border border-border/80 bg-card p-5 text-sm text-muted-foreground">Gunakan aksi presensi yang terhubung ke <code className="font-mono">recordTeacherAttendanceAction</code>; server akan menolak jam di luar ketentuan serta presensi ganda.</div></div>; }
