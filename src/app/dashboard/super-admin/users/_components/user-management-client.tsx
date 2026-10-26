'use client';

import * as React from 'react';
import { ZebraDataTable, ZebraColumn } from '@/components/common/zebra-data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  toggleUserActiveStatusAction,
  resetUserPasswordAction,
  createStaffUserAction,
} from '@/actions/super-admin.actions';
import { Search, UserPlus, KeyRound, CheckCircle2, XCircle } from 'lucide-react';

interface UserProfileItem {
  id: string;
  name: string;
  email: string | null;
  login_identifier: string;
  role: string;
  is_active: boolean;
  must_change_password: boolean;
  created_at: string;
}

export function UserManagementClient({
  initialUsers,
}: {
  initialUsers: UserProfileItem[];
}) {
  const [users, setUsers] = React.useState<UserProfileItem[]>(initialUsers);
  const [search, setSearch] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState<string>('all');
  const [isPending, startTransition] = React.useTransition();

  // State Dialog Tambah Staf
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [stafName, setStafName] = React.useState('');
  const [stafEmail, setStafEmail] = React.useState('');
  const [stafPhone, setStafPhone] = React.useState('');
  const [stafRole, setStafRole] = React.useState<'admin' | 'guru'>('guru');
  const [stafNip, setStafNip] = React.useState('');

  // State Modal Hasil Reset Password
  const [resetResult, setResetResult] = React.useState<{ name: string; password: string } | null>(null);

  // Filter users
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.login_identifier.toLowerCase().includes(search.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(search.toLowerCase()));

      const matchRole = selectedRole === 'all' || u.role === selectedRole;
      return matchSearch && matchRole;
    });
  }, [users, search, selectedRole]);

  // Handler Toggle Status Aktif
  const handleToggleStatus = (target: UserProfileItem) => {
    if (target.role === 'super_admin') {
      toast.error('Akun Super Admin tidak dapat diubah status keaktifannya.');
      return;
    }

    startTransition(async () => {
      const res = await toggleUserActiveStatusAction(target.id, !target.is_active);
      if (res.success) {
        toast.success(res.message);
        setUsers((prev) =>
          prev.map((u) => (u.id === target.id ? { ...u, is_active: !target.is_active } : u))
        );
      } else {
        toast.error(res.error);
      }
    });
  };

  // Handler Reset Password
  const handleResetPassword = (target: UserProfileItem) => {
    startTransition(async () => {
      const res = await resetUserPasswordAction(target.id);
      if (res.success) {
        setResetResult({
          name: target.name,
          password: res.data.temporaryPassword,
        });
        toast.success(res.message);
      } else {
        toast.error(res.error);
      }
    });
  };

  // Handler Tambah Staf Baru
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createStaffUserAction({
        name: stafName,
        email: stafEmail,
        phone: stafPhone || null,
        role: stafRole,
        nip: stafNip || null,
      });

      if (res.success) {
        toast.success(res.message);
        setIsAddOpen(false);
        setResetResult({
          name: stafName,
          password: res.data.defaultPassword,
        });
        setStafName('');
        setStafEmail('');
        setStafPhone('');
        setStafNip('');
      } else {
        toast.error(res.error);
      }
    });
  };

  const columns: ZebraColumn<UserProfileItem>[] = [
    {
      header: 'Nama Pengguna',
      cell: (item) => (
        <div>
          <span className="font-medium text-foreground block">{item.name}</span>
          <span className="text-[11px] text-muted-foreground font-mono">
            {item.email || item.login_identifier}
          </span>
        </div>
      ),
    },
    {
      header: 'Login ID',
      isMono: true,
      accessorKey: 'login_identifier',
    },
    {
      header: 'Role Resmi',
      cell: (item) => {
        const roleColors: Record<string, string> = {
          super_admin: 'border-purple-500/40 text-purple-600 bg-purple-500/5',
          admin: 'border-blue-500/40 text-blue-600 bg-blue-500/5',
          guru: 'border-emerald-500/40 text-emerald-600 bg-emerald-500/5',
          murid: 'border-amber-500/40 text-amber-600 bg-amber-500/5',
          wali_murid: 'border-rose-500/40 text-rose-600 bg-rose-500/5',
        };

        return (
          <Badge
            variant="outline"
            className={`font-mono text-[11px] ${roleColors[item.role] || ''}`}
          >
            {item.role}
          </Badge>
        );
      },
    },
    {
      header: 'Status Akun',
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          {item.is_active ? (
            <>
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span className="text-xs text-emerald-600 font-medium">Aktif</span>
            </>
          ) : (
            <>
              <XCircle className="size-3.5 text-rose-500" />
              <span className="text-xs text-rose-500 font-medium">Nonaktif</span>
            </>
          )}
        </div>
      ),
    },
    {
      header: 'Aksi Super Admin',
      align: 'right',
      cell: (item) => {
        const isSuperAdmin = item.role === 'super_admin';

        return (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] px-2"
              disabled={isPending || isSuperAdmin}
              onClick={() => handleResetPassword(item)}
              title="Reset password aman"
            >
              <KeyRound className="size-3 mr-1" />
              Reset Pass
            </Button>

            <Button
              variant={item.is_active ? 'outline' : 'default'}
              size="sm"
              className={`h-7 text-[11px] px-2 ${
                item.is_active ? 'text-rose-600 hover:text-rose-700 hover:bg-rose-50' : ''
              }`}
              disabled={isPending || isSuperAdmin}
              onClick={() => handleToggleStatus(item)}
            >
              {item.is_active ? 'Nonaktifkan' : 'Aktifkan'}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Bar Pencarian & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama, login ID, atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[140px] text-xs h-9">
              <SelectValue placeholder="Semua Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Role</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="guru">Guru</SelectItem>
              <SelectItem value="murid">Murid</SelectItem>
              <SelectItem value="wali_murid">Wali Murid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          size="sm"
          className="text-xs h-9"
          onClick={() => setIsAddOpen(true)}
        >
          <UserPlus className="size-3.5 mr-1.5" />
          Tambah Akun Staf
        </Button>
      </div>

      {/* Tabel Data Pengguna */}
      <ZebraDataTable
        data={filteredUsers}
        columns={columns}
        emptyText="Tidak ada data pengguna yang sesuai dengan filter pencarian."
      />

      {/* Dialog Tambah Staf Baru */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Tambah Pengguna Staf Baru
            </DialogTitle>
            <DialogDescription className="text-xs">
              Buat akun staf (Admin Sekolah atau Tenaga Pendidik / Guru) secara aman.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateStaff} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label className="text-xs">Nama Lengkap & Gelar</Label>
              <Input
                required
                placeholder="Contoh: Ustadz Rahmat Hidayat M.Pd"
                value={stafName}
                onChange={(e) => setStafName(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Alamat Email Resmi</Label>
              <Input
                required
                type="email"
                placeholder="nama@sdit-fajar.sch.id"
                value={stafEmail}
                onChange={(e) => setStafEmail(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Role Penugasan</Label>
                <Select
                  value={stafRole}
                  onValueChange={(v: 'admin' | 'guru') => setStafRole(v)}
                >
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guru">Tenaga Pendidik (Guru)</SelectItem>
                    <SelectItem value="admin">Administrator Sekolah</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">No. WhatsApp / HP</Label>
                <Input
                  placeholder="0812xxxxxxxx"
                  value={stafPhone}
                  onChange={(e) => setStafPhone(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </div>

            {stafRole === 'guru' && (
              <div className="space-y-1">
                <Label className="text-xs">NIP / NUPTK (Opsional)</Label>
                <Input
                  placeholder="1985xxxxxx"
                  value={stafNip}
                  onChange={(e) => setStafNip(e.target.value)}
                  className="text-xs h-8 font-mono"
                />
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setIsAddOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs"
                disabled={isPending}
              >
                {isPending ? 'Menyimpan...' : 'Simpan Akun Staf'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Hasil Reset Password */}
      <Dialog open={!!resetResult} onOpenChange={() => setResetResult(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-emerald-600 flex items-center gap-2">
              <CheckCircle2 className="size-5" />
              Kredensial Password Berhasil Dibuat
            </DialogTitle>
            <DialogDescription className="text-xs">
              Salin password sementara berikut dan serahkan kepada pengguna terkait.
            </DialogDescription>
          </DialogHeader>

          {resetResult && (
            <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-2 text-xs">
              <div>
                <span className="text-muted-foreground">Nama Pengguna: </span>
                <span className="font-semibold text-foreground">{resetResult.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Password Sementara: </span>
                <span className="font-mono font-bold text-primary select-all text-sm block mt-0.5 bg-background p-1.5 rounded border border-border">
                  {resetResult.password}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground italic">
                * Pengguna wajib mengganti password ini saat login perdana.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              size="sm"
              className="text-xs"
              onClick={() => setResetResult(null)}
            >
              Tutup & Selesai
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
