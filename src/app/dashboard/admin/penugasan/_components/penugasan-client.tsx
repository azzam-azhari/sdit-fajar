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
import { toast } from 'sonner';
import { createTeachingAssignmentAction, deleteTeachingAssignmentAction } from '@/actions/academic.actions';
import { ShieldCheck, Plus, Trash2 } from 'lucide-react';

export interface AssignmentItem {
  id: string;
  created_at: string;
  teachers?: {
    id: string;
    nip: string | null;
    profiles?: {
      name: string;
    };
  };
  subjects?: {
    id: string;
    name: string;
    code: string | null;
  };
  classrooms?: {
    id: string;
    name: string;
  };
  semesters?: {
    id: string;
    name: string;
    academic_years?: {
      name: string;
    };
  };
}

interface PenugasanClientProps {
  initialAssignments: AssignmentItem[];
  teachers: { id: string; nip: string | null; profiles?: { name: string } }[];
  subjects: { id: string; name: string; code: string | null }[];
  classrooms: { id: string; name: string }[];
  semesters: { id: string; name: string; academic_years?: { name: string } }[];
}

export function PenugasanClient({
  initialAssignments,
  teachers,
  subjects,
  classrooms,
  semesters,
}: PenugasanClientProps) {
  const [assignments, setAssignments] = React.useState<AssignmentItem[]>(initialAssignments);
  const [isPending, startTransition] = React.useTransition();
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  // Form State
  const [teacherId, setTeacherId] = React.useState(teachers[0]?.id || '');
  const [subjectId, setSubjectId] = React.useState(subjects[0]?.id || '');
  const [classroomId, setClassroomId] = React.useState(classrooms[0]?.id || '');
  const [semesterId, setSemesterId] = React.useState(semesters[0]?.id || '');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId || !subjectId || !classroomId || !semesterId) {
      toast.error('Seluruh kolom wajib dipilih.');
      return;
    }

    startTransition(async () => {
      const res = await createTeachingAssignmentAction({
        teacher_id: teacherId,
        subject_id: subjectId,
        classroom_id: classroomId,
        semester_id: semesterId,
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

  const handleDelete = (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus penugasan mengajar ini?')) return;

    startTransition(async () => {
      const res = await deleteTeachingAssignmentAction(id);
      if (res.success) {
        toast.success(res.message);
        setAssignments((prev) => prev.filter((a) => a.id !== id));
      } else {
        toast.error(res.error);
      }
    });
  };

  const columns: ZebraColumn<AssignmentItem>[] = [
    {
      header: 'Guru Pengampu',
      cell: (item) => (
        <div>
          <span className="font-semibold text-xs text-foreground block">
            {item.teachers?.profiles?.name || 'Tanpa Nama'}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            NIP: {item.teachers?.nip || '-'}
          </span>
        </div>
      ),
    },
    {
      header: 'Mata Pelajaran',
      cell: (item) => (
        <span className="font-medium text-xs text-primary">
          {item.subjects?.name} {item.subjects?.code ? `(${item.subjects.code})` : ''}
        </span>
      ),
    },
    {
      header: 'Rombongan Belajar',
      cell: (item) => (
        <Badge variant="outline" className="border-border text-foreground font-mono text-[11px]">
          {item.classrooms?.name || '-'}
        </Badge>
      ),
    },
    {
      header: 'Semester & Tahun',
      cell: (item) => (
        <span className="text-xs text-muted-foreground font-mono">
          {item.semesters?.name} ({item.semesters?.academic_years?.name || '2026/2027'})
        </span>
      ),
    },
    {
      header: 'Aksi',
      align: 'right',
      cell: (item) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2"
          disabled={isPending}
          onClick={() => handleDelete(item.id)}
        >
          <Trash2 className="size-3 mr-1" />
          Hapus
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Total penugasan aktif: <span className="font-semibold text-foreground">{assignments.length}</span> penugasan.
        </p>
        <Button size="sm" className="text-xs h-9" onClick={() => setIsAddOpen(true)}>
          <Plus className="size-3.5 mr-1.5" />
          Tambah Penugasan Mengajar
        </Button>
      </div>

      <ZebraDataTable data={assignments} columns={columns} emptyText="Belum ada penugasan mengajar." />

      {/* Modal Tambah Penugasan */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Tetapkan Penugasan Mengajar Guru
            </DialogTitle>
            <DialogDescription className="text-xs">
              Hubungkan guru dengan mata pelajaran dan kelas yang diampu.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label className="text-xs">Pilih Guru</Label>
              <Select value={teacherId} onValueChange={setTeacherId}>
                <SelectTrigger className="text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.profiles?.name || `Guru (${t.nip})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Pilih Mata Pelajaran</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger className="text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.code || '-'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Rombel Kelas</Label>
                <Select value={classroomId} onValueChange={setClassroomId}>
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Semester</Label>
                <Select value={semesterId} onValueChange={setSemesterId}>
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem.id} value={sem.id}>
                        {sem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => setIsAddOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="text-xs" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Penugasan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
