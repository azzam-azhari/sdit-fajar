'use client';

import * as React from 'react';
import { ZebraDataTable, ZebraColumn } from '@/components/common/zebra-data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
  assignTeacherPositionAction,
  toggleTeacherPositionAction,
} from '@/actions/super-admin.actions';
import { Plus, CheckCircle2, XCircle, MoreHorizontal } from 'lucide-react';

export interface TeacherPositionItem {
  id: string;
  is_active: boolean;
  created_at: string;
  teachers?: {
    id: string;
    nip: string | null;
    profiles?: {
      name: string;
      email: string | null;
    };
  };
  positions?: {
    id: string;
    name: string;
    code: string;
  };
  classrooms?: {
    id: string;
    name: string;
  } | null;
  academic_years?: {
    id: string;
    name: string;
  } | null;
}

interface TeacherPositionsClientProps {
  initialAssignments: TeacherPositionItem[];
  teachers: { id: string; nip: string | null; profiles?: { name: string } }[];
  positions: { id: string; name: string; code: string }[];
  classrooms: { id: string; name: string }[];
  academicYears: { id: string; name: string }[];
}

export function TeacherPositionsClient({
  initialAssignments,
  teachers,
  positions,
  classrooms,
  academicYears,
}: TeacherPositionsClientProps) {
  const [assignments, setAssignments] = React.useState<TeacherPositionItem[]>(initialAssignments);
  const [isPending, startTransition] = React.useTransition();
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  // Form State
  const [selectedTeacherId, setSelectedTeacherId] = React.useState('');
  const [selectedPositionId, setSelectedPositionId] = React.useState('');
  const [selectedClassroomId, setSelectedClassroomId] = React.useState('');
  const [selectedYearId, setSelectedYearId] = React.useState(
    academicYears[0]?.id || ''
  );

  const handleToggleActive = (item: TeacherPositionItem) => {
    startTransition(async () => {
      const res = await toggleTeacherPositionAction(item.id, !item.is_active);
      if (res.success) {
        toast.success(res.message);
        setAssignments((prev) =>
          prev.map((a) => (a.id === item.id ? { ...a, is_active: !item.is_active } : a))
        );
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId || !selectedPositionId) {
      toast.error('Guru dan jabatan wajib dipilih.');
      return;
    }

    startTransition(async () => {
      const res = await assignTeacherPositionAction({
        teacher_id: selectedTeacherId,
        position_id: selectedPositionId,
        classroom_id: selectedClassroomId || null,
        academic_year_id: selectedYearId || null,
      });

      if (res.success) {
        toast.success(res.message);
        setIsAddOpen(false);
        // Refresh halaman otomatis via router atau action
        window.location.reload();
      } else {
        toast.error(res.error);
      }
    });
  };

  const columns: ZebraColumn<TeacherPositionItem>[] = [
    {
      header: 'Nama Pendidik (Guru)',
      cell: (item) => (
        <div>
          <span className="font-medium text-foreground block">
            {item.teachers?.profiles?.name || 'Tanpa Nama'}
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">
            NIP: {item.teachers?.nip || '-'}
          </span>
        </div>
      ),
    },
    {
      header: 'Jabatan Struktural',
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[11px]">
            {item.positions?.name || item.positions?.code}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Tahun Ajaran / Rombel',
      cell: (item) => (
        <span className="text-xs text-muted-foreground">
          {item.academic_years?.name || '2026/2027'}
          {item.classrooms?.name ? ` • Rombel ${item.classrooms.name}` : ''}
        </span>
      ),
    },
    {
      header: 'Status Jabatan',
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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Aksi Jabatan Guru</DropdownMenuLabel>
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => handleToggleActive(item)}
              className="cursor-pointer"
            >
              {item.is_active ? (
                <>
                  <XCircle className="size-3.5 mr-2 text-rose-600" />
                  Nonaktifkan Jabatan
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5 mr-2 text-emerald-600" />
                  Aktifkan Jabatan
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
          Total penugasan aktif: <span className="font-semibold text-foreground">{assignments.filter((a) => a.is_active).length}</span> posisi.
        </p>
        <Button size="sm" className="text-xs h-9" onClick={() => setIsAddOpen(true)}>
          <Plus className="size-3.5 mr-1.5" />
          Tetapkan Jabatan Baru
        </Button>
      </div>

      <ZebraDataTable
        data={assignments}
        columns={columns}
        emptyText="Belum ada penugasan jabatan guru yang ditetapkan."
      />

      {/* Dialog Tetapkan Jabatan */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Tetapkan Jabatan Struktural Guru
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pilih tenaga pendidik dan amanah jabatan resmi yang diemban.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssign} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label className="text-xs">Pilih Guru</Label>
              <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                <SelectTrigger className="text-xs h-8">
                  <SelectValue placeholder="-- Pilih Guru Pengampu --" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.profiles?.name || `Guru (${t.nip || t.id.slice(0, 6)})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Jabatan Struktural</Label>
              <Select value={selectedPositionId} onValueChange={setSelectedPositionId}>
                <SelectTrigger className="text-xs h-8">
                  <SelectValue placeholder="-- Pilih Posisi Jabatan --" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Tahun Ajaran</Label>
              <Select value={selectedYearId} onValueChange={setSelectedYearId}>
                <SelectTrigger className="text-xs h-8">
                  <SelectValue placeholder="-- Pilih Tahun Ajaran --" />
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

            <div className="space-y-1">
              <Label className="text-xs">Rombel Terkait (Khusus Wali Kelas / Opsional)</Label>
              <Select value={selectedClassroomId} onValueChange={setSelectedClassroomId}>
                <SelectTrigger className="text-xs h-8">
                  <SelectValue placeholder="-- Bukan Wali Kelas / Tanpa Rombel --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- Tanpa Rombel --</SelectItem>
                  {classrooms.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
              <Button type="submit" size="sm" className="text-xs" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Tetapkan Jabatan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
