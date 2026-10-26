import { requireRole } from '@/lib/supabase/auth-helpers';
import { LogoutButton } from '@/components/common/logout-button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Key, Database } from 'lucide-react';

export default async function SuperAdminDashboardPage() {
  const { profile } = await requireRole(['super_admin']);

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Dashboard Super Admin
            </h1>
            <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[11px]">
              super_admin
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
              <CardTitle className="text-sm font-medium">Manajemen Pengguna</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              Kontrol penuh akun 5 role resmi sekolah
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Status akun: <span className="font-semibold text-emerald-600">Aktif Terverifikasi</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Isolasi Kunci Server</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              SUPABASE_SERVICE_ROLE_KEY
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs font-mono text-emerald-600">
              100% Server-Only (Zero Leakage)
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Storage Buckets</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              4 Bucket Resmi Terisolasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              images, lms-files, registration-files, marketplace-files
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
