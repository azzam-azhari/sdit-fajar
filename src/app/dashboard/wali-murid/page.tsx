import { requireRole } from '@/lib/supabase/auth-helpers';
import { LogoutButton } from '@/components/common/logout-button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, HeartHandshake, BookOpen } from 'lucide-react';

export const instant = false;

export default async function WaliMuridDashboardPage() {
  const { profile } = await requireRole(['wali_murid']);

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Portal Wali Murid
            </h1>
            <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[11px]">
              wali_murid
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Bapak/Ibu <span className="font-medium text-foreground">{profile.name}</span> | No WhatsApp:{' '}
            <span className="font-mono font-medium text-foreground">{profile.phone || profile.login_identifier}</span>
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Tagihan SPP & Pembayaran</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              Eksklusif: Pembayaran invoice via Midtrans Snap Popup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Akses bayar khusus akun wali murid untuk anak terdaftar
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Progres Akademik Anak</CardTitle>
              <HeartHandshake className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              Pemantauan nilai tugas, presensi, & raport
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Terhubung melalui relasi tabel parent_students
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Setoran Hafalan Qur&apos;an</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              Buku mutabaah harian tahfidz anak
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Laporan kelancaran dan setoran ayat realtime
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
