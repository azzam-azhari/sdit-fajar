import { requireRole } from '@/lib/supabase/auth-helpers';
import { LogoutButton } from '@/components/common/logout-button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpenCheck, CalendarCheck, Award } from 'lucide-react';

export const instant = false;

export default async function GuruDashboardPage() {
  const { profile } = await requireRole(['guru']);

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Dashboard Guru & Tenaga Pendidik
            </h1>
            <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[11px]">
              guru
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Ustadz / Ustadzah <span className="font-medium text-foreground">{profile.name}</span> ({profile.email})
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">LMS & Materi Ajar</CardTitle>
              <BookOpenCheck className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              Materi modul dan penugasan kelas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Tersimpan aman di bucket private <code className="font-mono text-primary">lms-files</code>
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Presensi Mengajar</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              Check-in 06.30–07.30, Check-out &gt;= 14.30
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Validasi ketat waktu server Senin–Jumat
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Halaqah Tahfidz</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              Pencatatan mutabaah hafalan Qur&apos;an santri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Predikat: Mumtaz, Jayyid Jiddan, Jayyid, Maqbul
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
