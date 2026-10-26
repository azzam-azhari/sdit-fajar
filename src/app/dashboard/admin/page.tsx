import { requireRole } from '@/lib/supabase/auth-helpers';
import { LogoutButton } from '@/components/common/logout-button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { School, UserCheck, BookOpen } from 'lucide-react';

export default async function AdminDashboardPage() {
  const { profile } = await requireRole(['admin', 'super_admin']);

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Dashboard Administrator Sekolah
            </h1>
            <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[11px]">
              {profile.role}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Selamat datang, <span className="font-medium text-foreground">{profile.name}</span> ({profile.email})
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Verifikasi PPDB</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              Staging pendaftar & dokumen calon murid
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Akses berkas via Signed URL privat
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Data Akademik</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              Tahun ajaran, rombel, dan penugasan guru
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Tahun Ajaran Aktif 2026/2027
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Pengumuman & Konten</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              Publikasi berita & pengumuman resmi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Broadcast terarah per kelas dan role
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
