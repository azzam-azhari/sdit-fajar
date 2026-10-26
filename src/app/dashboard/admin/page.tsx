import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { SectionCards, MetricCardItem } from '@/components/section-cards';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  School,
  UserCheck,
  CalendarDays,
  BookOpen,
  Newspaper,
  ArrowRight,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const { profile } = await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const [
    { count: totalStudents },
    { count: totalTeachers },
    { count: totalClassrooms },
    { count: pendingPpdb },
    { data: activePeriod },
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('teachers').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('classrooms').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase
      .from('student_registration_applications')
      .select('*', { count: 'exact', head: true })
      .in('status', ['submitted', 'under_review']),
    supabase
      .from('school_period_settings')
      .select(`
        active_month,
        active_year,
        academic_years (
          name
        ),
        semesters (
          name
        )
      `)
      .limit(1)
      .maybeSingle(),
  ]);

  const yearObj = activePeriod?.academic_years as unknown;
  const yearName = (Array.isArray(yearObj)
    ? (yearObj[0] as { name?: string })?.name
    : (yearObj as { name?: string })?.name) || '2026/2027';

  const semObj = activePeriod?.semesters as unknown;
  const semName = (Array.isArray(semObj)
    ? (semObj[0] as { name?: string })?.name
    : (semObj as { name?: string })?.name) || 'Semester Ganjil';

  const cardsData: MetricCardItem[] = [
    {
      description: 'Murid Aktif Terdaftar',
      title: `${totalStudents || 0} Siswa`,
      badgeText: yearName,
      footerTitle: 'Data pokok kependidikan',
      footerSubtitle: 'Tercatat dalam rombel aktif',
      icon: 'graduation-cap',
    },
    {
      description: 'Pendidik & Tenaga Guru',
      title: `${totalTeachers || 0} Guru`,
      badgeText: 'Aktif',
      footerTitle: 'Penugasan mengajar & wali kelas',
      footerSubtitle: 'Kurikulum Islam Terpadu',
      icon: 'users',
    },
    {
      description: 'Rombongan Belajar (Rombel)',
      title: `${totalClassrooms || 0} Kelas`,
      badgeText: 'Aktif',
      footerTitle: 'Kapasitas terdistribusi',
      footerSubtitle: 'Tingkat 1 sampai 6',
      icon: 'school',
    },
    {
      description: 'Verifikasi PPDB Baru',
      title: `${pendingPpdb || 0} Calon`,
      badgeText: 'Perlu Tinjauan',
      footerTitle: 'Pendaftaran daring calon murid',
      footerSubtitle: 'Pemeriksaan berkas & promosi',
      icon: 'user-check',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Dashboard Administrator Akademik
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Selamat datang, <span className="font-medium text-foreground">{profile.name}</span>. Periode aktif operasional:{' '}
            <span className="font-semibold text-primary">{yearName} ({semName})</span>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="default" className="text-xs">
            <Link href="/dashboard/admin/pendaftaran" className="flex items-center gap-1.5">
              <UserCheck className="size-3.5" />
              <span>Verifikasi PPDB</span>
            </Link>
          </Button>
        </div>
      </div>

      <SectionCards cards={cardsData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartAreaInteractive />
        </div>

        <div className="space-y-4">
          <Card className="border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Manajemen Master Akademik</CardTitle>
              <CardDescription className="text-xs">
                Akses cepat pengaturan data operasional sekolah
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-between text-xs h-9">
                <Link href="/dashboard/admin/tahun-ajaran">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="size-3.5 text-primary" />
                    Tahun Ajaran & Periode
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-between text-xs h-9">
                <Link href="/dashboard/admin/rombel">
                  <span className="flex items-center gap-2">
                    <School className="size-3.5 text-primary" />
                    Rombel & Wali Kelas
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-between text-xs h-9">
                <Link href="/dashboard/admin/mapel">
                  <span className="flex items-center gap-2">
                    <BookOpen className="size-3.5 text-primary" />
                    Master Mata Pelajaran
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-between text-xs h-9">
                <Link href="/dashboard/admin/berita">
                  <span className="flex items-center gap-2">
                    <Newspaper className="size-3.5 text-primary" />
                    Publikasi Berita Sekolah
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
