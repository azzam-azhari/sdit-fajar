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
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { updateStudentBiodataAction } from '@/actions/academic.actions';
import { Search, Edit, CheckCircle2, XCircle, MoreHorizontal } from 'lucide-react';

export interface StudentItem {
  id: string;
  nis: string;
  nisn: string | null;
  gender: string | null;
  birth_place: string | null;
  birth_date: string | null;
  address: string | null;
  is_active: boolean;
  profiles?: {
    name: string;
    email: string | null;
  };
  class_students?: {
    status: string;
    classrooms?: {
      id: string;
      name: string;
    };
  }[];
}

interface SiswaClientProps {
  initialStudents: StudentItem[];
  classrooms: { id: string; name: string }[];
}

export function SiswaClient({ initialStudents, classrooms }: SiswaClientProps) {
  const [students, setStudents] = React.useState<StudentItem[]>(initialStudents);
  const [search, setSearch] = React.useState('');
  const [selectedClass, setSelectedClass] = React.useState<string>('all');
  const [isPending, startTransition] = React.useTransition();

  // Edit Modal State
  const [editStudent, setEditStudent] = React.useState<StudentItem | null>(null);
  const [nis, setNis] = React.useState('');
  const [nisn, setNisn] = React.useState('');
  const [gender, setGender] = React.useState<'L' | 'P'>('L');
  const [birthPlace, setBirthPlace] = React.useState('');
  const [birthDate, setBirthDate] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [isActive, setIsActive] = React.useState(true);

  const filtered = React.useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.nis.includes(search) ||
        (s.nisn && s.nisn.includes(search)) ||
        (s.profiles?.name && s.profiles.name.toLowerCase().includes(search.toLowerCase()));

      const matchClass =
        selectedClass === 'all' ||
        s.class_students?.some((cs) => cs.classrooms?.id === selectedClass);

      return matchSearch && matchClass;
    });
  }, [students, search, selectedClass]);

  const openEditModal = (student: StudentItem) => {
    setEditStudent(student);
    setNis(student.nis);
    setNisn(student.nisn || '');
    setGender(student.gender === 'P' ? 'P' : 'L');
    setBirthPlace(student.birth_place || '');
    setBirthDate(student.birth_date || '2019-01-01');
    setAddress(student.address || '');
    setIsActive(student.is_active);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;

    startTransition(async () => {
      const res = await updateStudentBiodataAction(editStudent.id, {
        nis,
        nisn: nisn || null,
        gender,
        birth_place: birthPlace,
        birth_date: birthDate,
        address: address || null,
        is_active: isActive,
      });

      if (res.success) {
        toast.success(res.message);
        setStudents((prev) =>
          prev.map((s) =>
            s.id === editStudent.id
              ? {
                  ...s,
                  nis,
                  nisn: nisn || null,
                  gender,
                  birth_place: birthPlace,
                  birth_date: birthDate,
                  address,
                  is_active: isActive,
                }
              : s
          )
        );
        setEditStudent(null);
      } else {
        toast.error(res.error);
      }
    });
  };

  const columns: ZebraColumn<StudentItem>[] = [
    {
      header: 'NIS / NISN',
      isMono: true,
      cell: (item) => (
        <div>
          <span className="font-mono text-xs font-bold text-primary block">
            {item.nis}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {item.nisn || 'NISN: -'}
          </span>
        </div>
      ),
    },
    {
      header: 'Nama Lengkap Murid',
      cell: (item) => (
        <div>
          <span className="font-medium text-xs text-foreground block">
            {item.profiles?.name || 'Tanpa Nama'}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {item.gender === 'L' ? 'Laki-laki' : 'Perempuan'} • {item.birth_place},{' '}
            {item.birth_date}
          </span>
        </div>
      ),
    },
    {
      header: 'Rombongan Belajar',
      cell: (item) => {
        const activeRoom = item.class_students?.[0]?.classrooms?.name;
        return activeRoom ? (
          <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[11px]">
            {activeRoom}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground italic">Belum Ada Rombel</span>
        );
      },
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
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Aksi Murid</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => openEditModal(item)} className="cursor-pointer">
              <Edit className="size-3.5 mr-2" />
              Edit Biodata
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari NIS, NISN, atau nama murid..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>

          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[150px] text-xs h-9">
              <SelectValue placeholder="Semua Rombel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Rombel</SelectItem>
              {classrooms.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ZebraDataTable data={filtered} columns={columns} emptyText="Tidak ada data murid yang sesuai." />

      {/* Modal Edit Biodata Murid */}
      <Dialog open={!!editStudent} onOpenChange={() => setEditStudent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Edit Biodata Pokok Murid
            </DialogTitle>
            <DialogDescription className="text-xs">
              Nama murid: <span className="font-semibold text-foreground">{editStudent?.profiles?.name}</span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">NIS (Nomor Induk)</Label>
                <Input
                  required
                  value={nis}
                  onChange={(e) => setNis(e.target.value)}
                  className="text-xs h-8 font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">NISN (Nasional)</Label>
                <Input
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  placeholder="0012345678"
                  className="text-xs h-8 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Jenis Kelamin</Label>
                <Select value={gender} onValueChange={(v: 'L' | 'P') => setGender(v)}>
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Laki-laki (L)</SelectItem>
                    <SelectItem value="P">Perempuan (P)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Tempat Lahir</Label>
                <Input
                  required
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Tanggal Lahir</Label>
              <Input
                required
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="text-xs h-8 font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Alamat Tinggal</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Margonda Raya..."
                className="text-xs h-8"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="studentActive"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(!!checked)}
              />
              <label htmlFor="studentActive" className="text-xs text-muted-foreground">
                Murid berstatus aktif belajar
              </label>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => setEditStudent(null)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="text-xs" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Biodata'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
