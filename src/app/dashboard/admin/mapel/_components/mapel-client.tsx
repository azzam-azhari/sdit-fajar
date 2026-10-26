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
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { createSubjectAction, toggleSubjectStatusAction } from '@/actions/academic.actions';
import { BookOpen, Plus, CheckCircle2, XCircle, Search, MoreHorizontal } from 'lucide-react';

interface SubjectItem {
  id: string;
  name: string;
  code: string | null;
  grade_level: number | null;
  is_active: boolean;
  created_at: string;
}

export function MapelClient({ initialSubjects }: { initialSubjects: SubjectItem[] }) {
  const [subjects, setSubjects] = React.useState<SubjectItem[]>(initialSubjects);
  const [search, setSearch] = React.useState('');
  const [isPending, startTransition] = React.useTransition();
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  // Form State
  const [name, setName] = React.useState('');
  const [code, setCode] = React.useState('');
  const [gradeLevel, setGradeLevel] = React.useState('');

  const filtered = React.useMemo(() => {
    return subjects.filter((s) => {
      const matchName = s.name.toLowerCase().includes(search.toLowerCase());
      const matchCode = s.code?.toLowerCase().includes(search.toLowerCase()) || false;
      return matchName || matchCode;
    });
  }, [subjects, search]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createSubjectAction({
        name,
        code: code || null,
        grade_level: gradeLevel ? parseInt(gradeLevel, 10) : null,
        is_active: true,
      });

      if (res.success) {
        toast.success(res.message);
        setIsAddOpen(false);
        window.location.reload();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleToggle = (item: SubjectItem) => {
    startTransition(async () => {
      const res = await toggleSubjectStatusAction(item.id, !item.is_active);
      if (res.success) {
        toast.success(res.message);
        setSubjects((prev) =>
          prev.map((s) => (s.id === item.id ? { ...s, is_active: !item.is_active } : s))
        );
      } else {
        toast.error(res.error);
      }
    });
  };

  const columns: ZebraColumn<SubjectItem>[] = [
    {
      header: 'Nama Mata Pelajaran',
      cell: (item) => (
        <span className="font-semibold text-xs text-foreground block">
          {item.name}
        </span>
      ),
    },
    {
      header: 'Kode Mapel',
      isMono: true,
      cell: (item) => (
        <Badge variant="outline" className="border-primary/30 text-primary font-mono text-[11px]">
          {item.code || '-'}
        </Badge>
      ),
    },
    {
      header: 'Tingkat Kelas',
      cell: (item) => (
        <span className="text-xs text-muted-foreground font-mono">
          {item.grade_level ? `Kelas ${item.grade_level}` : 'Semua Tingkat (1-6)'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          {item.is_active ? (
            <>
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span className="text-xs text-emerald-600 font-medium">Aktif</span>
            </>
          ) : (
            <>
              <XCircle className="size-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Nonaktif</span>
            </>
          )}
        </div>
      ),
    },
    {
      header: 'Aksi',
      align: 'right',
      cell: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 p-0 text-muted-foreground hover:text-foreground"
              aria-label="Buka menu aksi"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Aksi Mata Pelajaran</DropdownMenuLabel>
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => handleToggle(item)}
              className="cursor-pointer"
            >
              {item.is_active ? (
                <>
                  <XCircle className="size-3.5 mr-2 text-rose-600" />
                  Nonaktifkan Mapel
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5 mr-2 text-emerald-600" />
                  Aktifkan Mapel
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari mata pelajaran atau kode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-9"
          />
        </div>
        <Button size="sm" className="text-xs h-9" onClick={() => setIsAddOpen(true)}>
          <Plus className="size-3.5 mr-1.5" />
          Tambah Mata Pelajaran
        </Button>
      </div>

      <ZebraDataTable data={filtered} columns={columns} emptyText="Belum ada mata pelajaran." />

      {/* Modal Tambah Mapel */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              Tambah Mata Pelajaran Baru
            </DialogTitle>
            <DialogDescription className="text-xs">
              Mata pelajaran akan tersedia untuk jadwal dan materi pembelajaran.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label className="text-xs">Nama Mata Pelajaran</Label>
              <Input
                required
                placeholder="Contoh: Tahfidz & Tahsin Al-Qur'an"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Kode Mapel (Singkatan)</Label>
                <Input
                  placeholder="Contoh: TQ-01"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="text-xs h-8 font-mono uppercase"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Tingkat Kelas (1-6, Kosong = Semua)</Label>
                <Input
                  type="number"
                  min={1}
                  max={6}
                  placeholder="Semua"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="text-xs h-8 font-mono"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => setIsAddOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="text-xs" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Mapel'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
