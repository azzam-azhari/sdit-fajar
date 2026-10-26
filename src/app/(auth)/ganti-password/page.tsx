'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePasswordAction, logoutAction } from '@/actions/auth.actions';
import { toast } from 'sonner';
import {
  KeyRound,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
} from 'lucide-react';

export default function GantiPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage('Kata sandi baru minimal 8 karakter.');
      return;
    }

    if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setErrorMessage('Kata sandi baru wajib mengandung kombinasi huruf dan angka.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const result = await changePasswordAction({
        newPassword,
        confirmPassword,
      });

      if (!result.success) {
        setErrorMessage(result.error);
        toast.error('Gagal Memperbarui Kata Sandi', {
          description: result.error,
        });
        return;
      }

      toast.success('Pembaruan Berhasil', {
        description: 'Kata sandi berhasil disimpan. Mengarahkan ke dashboard...',
      });

      router.push(result.data.redirectTo);
      router.refresh();
    } catch {
      const msg = 'Terjadi kesalahan sistem saat memperbarui kata sandi.';
      setErrorMessage(msg);
      toast.error('Kesalahan', { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutAction();
    } catch {
      // Action redirects
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-4">
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="space-y-1.5 pb-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-warning/30 bg-warning/10 text-warning">
              <KeyRound className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
              Wajib Ganti Kata Sandi Perdana
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed text-muted-foreground">
              Demi keamanan akun dan kerahasiaan data sekolah, silakan buat kata sandi baru pribadi Anda sebelum melanjutkan ke dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border/80 bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <ShieldAlert className="h-4 w-4 text-primary" />
                <span>Ketentuan Kata Sandi Baru:</span>
              </div>
              <ul className="list-inside list-disc pl-1 space-y-0.5 text-[11px]">
                <li>Minimal 8 karakter</li>
                <li>Wajib memuat minimal 1 huruf dan 1 angka</li>
                <li>Jangan gunakan tanggal lahir atau kombinasi yang mudah ditebak</li>
              </ul>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs font-medium text-foreground">
                  Kata Sandi Baru
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 8 karakter huruf & angka"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className="pr-10 text-sm"
                    autoComplete="new-password"
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

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
                  Konfirmasi Kata Sandi Baru
                </Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ketik ulang kata sandi baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="text-sm"
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full text-xs font-medium tracking-wide shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan Kata Sandi...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                    Simpan Kata Sandi & Lanjut ke Dashboard
                  </>
                )}
              </Button>
            </form>

            <div className="border-t border-border/80 pt-3 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                {loggingOut ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LogOut className="mr-1.5 h-3.5 w-3.5" />
                )}
                Batalkan & Keluar Akun
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
