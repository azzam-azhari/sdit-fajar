'use client';

import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAction } from '@/actions/auth.actions';
import { toast } from 'sonner';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const errorParam = searchParams.get('error');

  const [roleType, setRoleType] = React.useState<'murid' | 'wali_murid' | 'staf'>('murid');
  const [identifier, setIdentifier] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(
    errorParam === 'inactive'
      ? 'Akun Anda dinonaktifkan. Silakan hubungi administrator sekolah.'
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanIdentifier = identifier.trim();

    // 1. Validasi Client-Side Spesifik dengan Sonner
    if (!cleanIdentifier) {
      if (roleType === 'murid') {
        const msg = 'Nomor Induk Siswa (NIS) belum diisi.';
        setErrorMessage(msg);
        toast.error('NIS Belum Diisi', {
          description: 'Silakan masukkan Nomor Induk Siswa (NIS) Anda terlebih dahulu.',
          duration: 5000,
        });
      } else if (roleType === 'wali_murid') {
        const msg = 'Nomor WhatsApp / HP belum diisi.';
        setErrorMessage(msg);
        toast.error('Nomor WhatsApp Belum Diisi', {
          description: 'Silakan masukkan nomor WhatsApp yang didaftarkan saat pendaftaran PPDB.',
          duration: 5000,
        });
      } else {
        const msg = 'Email resmi dinas belum diisi.';
        setErrorMessage(msg);
        toast.error('Email Belum Diisi', {
          description: 'Silakan masukkan email resmi @sditfajar.sch.id Anda.',
          duration: 5000,
        });
      }
      return;
    }

    if (!password) {
      const msg = 'Kata sandi wajib diisi.';
      setErrorMessage(msg);
      toast.error('Kata Sandi Belum Diisi', {
        description: 'Silakan masukkan kata sandi akun Anda untuk melanjutkan.',
        duration: 5000,
      });
      return;
    }

    setLoading(true);

    try {
      const result = await loginAction({
        identifier: cleanIdentifier,
        password,
        roleType,
      });

      if (!result.success) {
        const title = result.title || 'Gagal Masuk';
        const displayDesc = result.hint
          ? `${result.error} ${result.hint}`
          : result.error;

        setErrorMessage(displayDesc);

        // Jika salah tab, sediakan tombol aksi langsung di toast Sonner
        if (result.code === 'ROLE_MISMATCH') {
          let targetTab: 'murid' | 'wali_murid' | 'staf' = 'staf';
          if (result.error.toLowerCase().includes('tab "murid"')) {
            targetTab = 'murid';
          } else if (result.error.toLowerCase().includes('tab "wali murid"')) {
            targetTab = 'wali_murid';
          }

          toast.error(title, {
            description: result.error,
            duration: 8000,
            action: {
              label: 'Pindah Tab',
              onClick: () => {
                setRoleType(targetTab);
                setErrorMessage(null);
              },
            },
          });
        } else {
          toast.error(title, {
            description: displayDesc,
            duration: result.code === 'WRONG_PASSWORD' ? 8000 : 6000,
          });
        }
        return;
      }

      toast.success('Berhasil Masuk', {
        description: 'Autentikasi terverifikasi. Mengarahkan ke sistem...',
        duration: 3000,
      });

      const destination = redirectTo || result.data.redirectTo;
      router.push(destination);
      router.refresh();
    } catch {
      const msg =
        typeof navigator !== 'undefined' && !navigator.onLine
          ? 'Perangkat Anda sedang offline. Periksa sambungan internet Anda.'
          : 'Gagal terhubung ke server sekolah. Periksa koneksi jaringan Anda atau coba beberapa saat lagi.';
      setErrorMessage(msg);
      toast.error('Koneksi Terputus', {
        description: msg,
        duration: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Link Kembali ke Beranda */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Kembali ke Beranda SDIT Fajar
          </Link>
        </div>

        {/* Card Login */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="space-y-1.5 pb-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-muted/40 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
              Portal Akademik Terpadu
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Masuk untuk mengakses materi, nilai, presensi, dan layanan sekolah
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Tab Selector Role Identifier */}
            <Tabs
              value={roleType}
              onValueChange={(val) => {
                setRoleType(val as 'murid' | 'wali_murid' | 'staf');
                setIdentifier('');
                setPassword('');
                setErrorMessage(null);
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="murid" className="text-xs">
                  <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
                  Murid
                </TabsTrigger>
                <TabsTrigger value="wali_murid" className="text-xs">
                  <Users className="mr-1.5 h-3.5 w-3.5" />
                  Wali Murid
                </TabsTrigger>
                <TabsTrigger value="staf" className="text-xs">
                  <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                  Staf / Guru
                </TabsTrigger>
              </TabsList>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* Alert Error */}
                {errorMessage && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <TabsContent value="murid" className="space-y-3 pt-1">
                  <div className="space-y-1.5">
                    <Label htmlFor="nis" className="text-xs font-medium text-foreground">
                      Nomor Induk Siswa (NIS)
                    </Label>
                    <Input
                      id="nis"
                      type="text"
                      placeholder="Contoh: 20261001"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      disabled={loading}
                      className="font-mono text-sm"
                      autoComplete="username"
                    />
                  </div>

                  <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">Petunjuk Password Awal Murid:</p>
                    <p className="mt-0.5 leading-relaxed">
                      Format: <code className="font-mono text-[11px] text-primary">tempatddmmyyyy</code> (tempat lahir huruf kecil tanpa spasi + 8 digit tanggal lahir).
                      Contoh: <code className="font-mono text-[11px]">jakartaselatan30122015</code>
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="wali_murid" className="space-y-3 pt-1">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-medium text-foreground">
                      Nomor WhatsApp / HP Aktif
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      disabled={loading}
                      className="font-mono text-sm"
                      autoComplete="username"
                    />
                  </div>

                  <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">Petunjuk Password Awal Wali:</p>
                    <p className="mt-0.5 leading-relaxed">
                      Password awal adalah nomor WhatsApp aktif yang didaftarkan saat pendaftaran PPDB.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="staf" className="space-y-3 pt-1">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium text-foreground">
                      Email Resmi Sekolah
                    </Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="nama@sditfajar.sch.id"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      disabled={loading}
                      className="text-sm"
                      autoComplete="email"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Gunakan email dinas yang telah diverifikasi oleh Super Admin.
                  </p>
                </TabsContent>

                {/* Password Input (Shared) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-medium text-foreground">
                      Kata Sandi
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="pr-10 text-sm"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Tombol Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-xs font-medium tracking-wide shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memverifikasi Akun...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-3.5 w-3.5" />
                      Masuk ke Sistem
                    </>
                  )}
                </Button>
              </form>
            </Tabs>

            {/* Bantuan */}
            <div className="border-t border-border/80 pt-3 text-center text-xs text-muted-foreground">
              Kendala masuk akun? Hubungi panitia PPDB atau{' '}
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Layanan Bantuan IT
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
