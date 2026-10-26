import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { SectionCards, MetricCardItem } from '@/components/section-cards';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { ZebraDataTable, ZebraColumn } from '@/components/common/zebra-data-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, ShieldCheck, FileSpreadsheet, History, Settings2, ArrowRight } from 'lucide-react';

interface AuditLogItem {
  id: string;
  action: string;
  entity_type: string;
  created_at: string;
  actor_name?: string;
}

export default async function SuperAdminDashboardPage() {
  const { profile } = await requireRole(['super_admin']);
  const supabase = await createClient();

  // Query statistik
  const [
    { count: totalUsers },
    { count: totalGuru },
    { count: totalMurid },
    { count: totalWali },
    { data: recentLogs },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'guru'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'murid'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'wali_murid'),
    supabase
      .from('audit_logs')
      .select('id, action, entity_type, created_at, actor_id')
      .order('created_at', { ascending: false })
      .limit(6),
  ]);

  const cardsData: MetricCardItem[] = [
    {
      description: 'Total Akun Pengguna',
      title: `${totalUsers || 0} Akun`,
      badgeText: '5 Role Resmi',
      footerTitle: 'Semua entitas terautentikasi',
      footerSubtitle: 'Status aktif terverifikasi',
      icon: 'users',
    },
    {
      description: 'Tenaga Pendidik (Guru)',
      title: `${totalGuru || 0} Guru`,
      badgeText: 'Terdaftar',
      footerTitle: 'Pengampu mata pelajaran',
      footerSubtitle: '7 Jabatan struktural',
      icon: 'shield-check',
    },
    {
      description: 'Murid Terdaftar',
      title: `${totalMurid || 0} Siswa`,
      badgeText: 'Aktif',
      footerTitle: 'Rombel Kelas 1 - 6',
      footerSubtitle: 'NIS resmi terbit',
      icon: 'users',
    },
    {
      description: 'Wali Murid Terhubung',
      title: `${totalWali || 0} Wali`,
      badgeText: 'WhatsApp Auth',
      footerTitle: 'Akses invoice & raport anak',
      footerSubtitle: 'Relasi parent_students',
      icon: 'history',
    },
  ];

  const logColumns: ZebraColumn<AuditLogItem>[] = [
    {
      header: 'Waktu (WIB)',
      cell: (item) => (
        <span className="font-mono text-xs text-muted-foreground">
          {new Date(item.created_at).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      header: 'Aksi Sensitif',
      cell: (item) => (
        <Badge variant="outline" className="border-primary/30 text-primary font-mono text-[11px]">
          {item.action}
        </Badge>
      ),
    },
    {
      header: 'Entitas Target',
      cell: (item) => (
        <span className="font-mono text-xs text-foreground font-medium">
          {item.entity_type}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Sambutan */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Sistem Kontrol Super Administrator
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Selamat bertugas, <span className="font-medium text-foreground">{profile.name}</span>. Akses penuh terhadap integritas data, akun pengguna, dan konfigurasi master.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="default" className="text-xs">
            <Link href="/dashboard/super-admin/import" className="flex items-center gap-1.5">
              <FileSpreadsheet className="size-3.5" />
              <span>Import CSV Massal</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Section Cards */}
      <SectionCards cards={cardsData} />

      {/* Chart Tren & Pintasan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartAreaInteractive />
        </div>

        {/* Card Akses Cepat */}
        <div className="space-y-4">
          <Card className="border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Pintasan Super Admin</CardTitle>
              <CardDescription className="text-xs">
                Operasi sentral pemeliharaan sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-between text-xs h-9">
                <Link href="/dashboard/super-admin/users">
                  <span className="flex items-center gap-2">
                    <Users className="size-3.5 text-primary" />
                    Manajemen Pengguna
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-between text-xs h-9">
                <Link href="/dashboard/super-admin/roles">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="size-3.5 text-primary" />
                    Penugasan Jabatan Guru
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-between text-xs h-9">
                <Link href="/dashboard/super-admin/settings">
                  <span className="flex items-center gap-2">
                    <Settings2 className="size-3.5 text-primary" />
                    Identitas & Kontak Sekolah
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-between text-xs h-9">
                <Link href="/dashboard/super-admin/audit-logs">
                  <span className="flex items-center gap-2">
                    <History className="size-3.5 text-primary" />
                    Rekam Audit Log Lengkap
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card Status Keamanan */}
          <Card className="border-border/80 bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Status Keamanan Sesi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Row Level Security:</span>
                <span className="font-semibold text-emerald-600 font-mono">100% AKTIF</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Kunci Service Role:</span>
                <span className="font-semibold text-emerald-600 font-mono">Server-Only</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Midtrans Production:</span>
                <span className="font-semibold text-amber-600 font-mono">Terkunci (Fase 7)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabel Cuplikan Audit Log Terbaru */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Aktivitas Sensitif Terbaru (Audit Log)
            </h2>
            <p className="text-xs text-muted-foreground">
              Jejak rekam mutasi data penting dan pergantian status akun
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link href="/dashboard/super-admin/audit-logs" className="flex items-center gap-1">
              <span>Lihat Seluruh Log</span>
              <ArrowRight className="size-3" />
            </Link>
          </Button>
        </div>

        <ZebraDataTable
          data={recentLogs || []}
          columns={logColumns}
          emptyText="Belum ada aktivitas audit log yang tercatat."
        />
      </div>
    </div>
  );
}
