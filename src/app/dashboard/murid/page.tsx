import { requireRole } from '@/lib/supabase/auth-helpers';
import { LogoutButton } from '@/components/common/logout-button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookMarked, Calendar, Award } from 'lucide-react';

export const instant = false;

export default async function MuridDashboardPage() {
  const { profile } = await requireRole(['murid']);

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Dashboard Santri / Murid
            </h1>
            <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[11px]">
              murid
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Santri: <span className="font-medium text-foreground">{profile.name}</span> | NIS:{' '}
            <span className="font-mono font-medium text-foreground">{profile.login_identifier}</span>
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Materi & Tugas Saya</CardTitle>
              <BookMarked className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              Materi kelas aktif & tenggat pengumpulan tugas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Pengumpulan tugas terisolasi hanya untuk submission sendiri
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Jadwal & Kehadiran</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              Jadwal pelajaran harian & riwayat presensi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Presensi dicatat guru pengampu (read-only santri)
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Mutabaah Tahfidz</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              Capaian juz dan riwayat setoran ayat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Pemantauan hafalan mandiri
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
