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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { createClassroomAction, updateClassroomAction } from '@/actions/academic.actions';
import { School, Plus, CheckCircle2, XCircle, MoreHorizontal } from 'lucide-react';

export interface ClassroomItem {
  id: string;
  name: string;
  is_active: boolean;
  class_id: string;
  academic_year_id: string;
  homeroom_teacher_id: string | null;
  classes?: {
    name: string;
    grade_level: number;
  };
  academic_years?: {
    name: string;
  };
  teachers?: {
    nip: string | null;
    profiles?: {
      name: string;
    };
  } | null;
}

interface RombelClientProps {
  initialClassrooms: ClassroomItem[];
  classes: { id: string; name: string; grade_level: number }[];
  academicYears: { id: string; name: string }[];
  teachers: { id: string; nip: string | null; profiles?: { name: string } }[];
}

export function RombelClient({
  initialClassrooms,
  classes,
  academicYears,
  teachers,
}: RombelClientProps) {
  const [classrooms, setClassrooms] = React.useState<ClassroomItem[]>(initialClassrooms);
  const [isPending, startTransition] = React.useTransition();
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  // Form State
  const [name, setName] = React.useState('');
  const [classId, setClassId] = React.useState(classes[0]?.id || '');
  const [yearId, setYearId] = React.useState(academicYears[0]?.id || '');
  const [homeroomTeacherId, setHomeroomTeacherId] = React.useState('none');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createClassroomAction({
        name,
        class_id: classId,
        academic_year_id: yearId,
        homeroom_teacher_id: homeroomTeacherId === 'none' ? null : homeroomTeacherId,
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

  const handleToggleActive = (item: ClassroomItem) => {
    startTransition(async () => {
      const res = await updateClassroomAction(item.id, {
        is_active: !item.is_active,
      });

      if (res.success) {
        toast.success(res.message);
        setClassrooms((prev) =>
          prev.map((c) => (c.id === item.id ? { ...c, is_active: !item.is_active } : c))
        );
      } else {
        toast.error(res.error);
      }
    });
  };

  const columns: ZebraColumn<ClassroomItem>[] = [
    {
      header: 'Nama Rombel',
      cell: (item) => (
        <span className="font-semibold text-xs text-foreground font-mono">
          {item.name}
        </span>
      ),
    },
    {
      header: 'Tingkat Kelas',
      cell: (item) => (
        <Badge variant="outline" className="border-primary/30 text-primary font-mono text-[11px]">
          {item.classes?.name || `Kelas ${item.classes?.grade_level || '-'}`}
        </Badge>
      ),
    },
    {
      header: 'Wali Kelas (Pembina)',
      cell: (item) => (
        <div>
          <span className="text-xs font-medium text-foreground block">
            {item.teachers?.profiles?.name || (
              <span className="text-muted-foreground italic">Belum Ditetapkan</span>
            )}
          </span>
          {item.teachers?.nip && (
            <span className="text-[10px] text-muted-foreground font-mono">
              NIP: {item.teachers.nip}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Tahun Ajaran',
      cell: (item) => (
        <span className="text-xs text-muted-foreground font-mono">
          {item.academic_years?.name || '2026/2027'}
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
            <DropdownMenuLabel>Aksi Rombel</DropdownMenuLabel>
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => handleToggleActive(item)}
              className="cursor-pointer"
            >
              {item.is_active ? (
                <>
                  <XCircle className="size-3.5 mr-2 text-rose-600" />
                  Nonaktifkan Kelas
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5 mr-2 text-emerald-600" />
                  Aktifkan Kelas
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
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Total rombel terdaftar: <span className="font-semibold text-foreground">{classrooms.length}</span> kelas.
        </p>
        <Button size="sm" className="text-xs h-9" onClick={() => setIsAddOpen(true)}>
          <Plus className="size-3.5 mr-1.5" />
          Tambah Rombel Baru
        </Button>
      </div>

      <ZebraDataTable data={classrooms} columns={columns} emptyText="Belum ada data rombel." />

      {/* Modal Tambah Rombel */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <School className="size-4 text-primary" />
              Tambah Rombongan Belajar
            </DialogTitle>
            <DialogDescription className="text-xs">
              Buat rombel baru dan tetapkan guru pembina wali kelas.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label className="text-xs">Nama Rombel</Label>
              <Input
                required
                placeholder="Contoh: 1-A Abu Bakar Ash-Shiddiq"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Tingkat Kelas</Label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Tahun Ajaran</Label>
                <Select value={yearId} onValueChange={setYearId}>
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((y) => (
                      <SelectItem key={y.id} value={y.id}>
                        {y.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Wali Kelas (Guru Pembina)</Label>
              <Select value={homeroomTeacherId} onValueChange={setHomeroomTeacherId}>
                <SelectTrigger className="text-xs h-8">
                  <SelectValue placeholder="-- Pilih Guru Wali Kelas --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- Belum Ditetapkan --</SelectItem>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.profiles?.name || `Guru (${t.nip})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => setIsAddOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="text-xs" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Rombel'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
