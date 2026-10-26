'use client';

import * as React from 'react';
import { ZebraDataTable, ZebraColumn } from '@/components/common/zebra-data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
import { toast } from 'sonner';
import {
  createAcademicYearAction,
  createSemesterAction,
  updateSchoolPeriodSettingsAction,
} from '@/actions/academic.actions';
import { CalendarDays, Plus, CheckCircle2, Clock } from 'lucide-react';

interface AcademicYearItem {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface SemesterItem {
  id: string;
  academic_year_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  academic_years?: {
    name: string;
  };
}

interface PeriodSettingItem {
  id?: string;
  academic_year_id?: string;
  semester_id?: string | null;
  active_month?: number;
  active_year?: number;
  teacher_weekend_attendance_enabled?: boolean;
}

export function TahunAjaranClient({
  initialYears,
  initialSemesters,
  initialPeriod,
}: {
  initialYears: AcademicYearItem[];
  initialSemesters: SemesterItem[];
  initialPeriod?: PeriodSettingItem | null;
}) {
  const [years] = React.useState<AcademicYearItem[]>(initialYears);
  const [semesters] = React.useState<SemesterItem[]>(initialSemesters);
  const [isPending, startTransition] = React.useTransition();

  // Dialog Tahun Ajaran
  const [isAddYearOpen, setIsAddYearOpen] = React.useState(false);
  const [yearName, setYearName] = React.useState('');
  const [yearStartDate, setYearStartDate] = React.useState('2026-07-15');
  const [yearEndDate, setYearEndDate] = React.useState('2027-06-20');
  const [yearIsActive, setYearIsActive] = React.useState(false);

  // Dialog Semester
  const [isAddSemOpen, setIsAddSemOpen] = React.useState(false);
  const [semYearId, setSemYearId] = React.useState(initialYears[0]?.id || '');
  const [semName, setSemName] = React.useState('Semester Ganjil');
  const [semStartDate, setSemStartDate] = React.useState('2026-07-15');
  const [semEndDate, setSemEndDate] = React.useState('2026-12-20');
  const [semIsActive, setSemIsActive] = React.useState(false);

  // Pengaturan Periode Operasional
  const [periodYearId, setPeriodYearId] = React.useState(
    initialPeriod?.academic_year_id || initialYears[0]?.id || ''
  );
  const [periodSemId, setPeriodSemId] = React.useState(
    initialPeriod?.semester_id || initialSemesters[0]?.id || ''
  );
  const [periodMonth, setPeriodMonth] = React.useState(
    initialPeriod?.active_month?.toString() || '10'
  );
  const [periodYear, setPeriodYear] = React.useState(
    initialPeriod?.active_year?.toString() || '2026'
  );
  const [weekendAttendance, setWeekendAttendance] = React.useState(
    initialPeriod?.teacher_weekend_attendance_enabled || false
  );

  const handleCreateYear = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createAcademicYearAction({
        name: yearName,
        start_date: yearStartDate,
        end_date: yearEndDate,
        is_active: yearIsActive,
      });

      if (res.success) {
        toast.success(res.message);
        setIsAddYearOpen(false);
        window.location.reload();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleCreateSemester = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createSemesterAction({
        academic_year_id: semYearId,
        name: semName,
        start_date: semStartDate,
        end_date: semEndDate,
        is_active: semIsActive,
      });

      if (res.success) {
        toast.success(res.message);
        setIsAddSemOpen(false);
        window.location.reload();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleSavePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateSchoolPeriodSettingsAction({
        academic_year_id: periodYearId,
        semester_id: periodSemId || null,
        active_month: parseInt(periodMonth, 10),
        active_year: parseInt(periodYear, 10),
        teacher_weekend_attendance_enabled: weekendAttendance,
      });

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error);
      }
    });
  };

  const yearColumns: ZebraColumn<AcademicYearItem>[] = [
    {
      header: 'Tahun Ajaran',
      isMono: true,
      cell: (item) => (
        <span className="font-semibold text-xs text-foreground font-mono">
          {item.name}
        </span>
      ),
    },
    {
      header: 'Periode Mulai - Selesai',
      cell: (item) => (
        <span className="text-xs text-muted-foreground font-mono">
          {item.start_date} s.d. {item.end_date}
        </span>
      ),
    },
    {
      header: 'Status Aktif',
      cell: (item) =>
        item.is_active ? (
          <Badge variant="outline" className="text-emerald-600 border-emerald-400 font-mono text-[11px] gap-1">
            <CheckCircle2 className="size-3" />
            Aktif Berjalan
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">Arsip</span>
        ),
    },
  ];

  const semesterColumns: ZebraColumn<SemesterItem>[] = [
    {
      header: 'Tahun Ajaran',
      cell: (item) => (
        <span className="text-xs font-medium text-foreground">
          {item.academic_years?.name || '-'}
        </span>
      ),
    },
    {
      header: 'Nama Semester',
      cell: (item) => (
        <span className="font-semibold text-xs text-primary font-mono">
          {item.name}
        </span>
      ),
    },
    {
      header: 'Rentang Waktu',
      cell: (item) => (
        <span className="text-xs text-muted-foreground font-mono">
          {item.start_date} s.d. {item.end_date}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (item) =>
        item.is_active ? (
          <Badge variant="outline" className="text-emerald-600 border-emerald-400 font-mono text-[11px]">
            Aktif
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">Nonaktif</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Pengaturan Periode Operasional Aktif */}
      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            Konfigurasi Periode Operasional Berjalan
          </CardTitle>
          <CardDescription className="text-xs">
            Bulan dan tahun aktif ini menjadi acuan sistem untuk pencatatan presensi guru, absensi siswa, dan tagihan SPP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSavePeriod} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Tahun Ajaran Aktif</Label>
                <Select value={periodYearId} onValueChange={setPeriodYearId}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y.id} value={y.id}>
                        {y.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Semester Aktif</Label>
                <Select value={periodSemId} onValueChange={setPeriodSemId}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.academic_years?.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Bulan Berjalan (1-12)</Label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={periodMonth}
                  onChange={(e) => setPeriodMonth(e.target.value)}
                  className="text-xs h-9 font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Tahun Kalender</Label>
                <Input
                  type="number"
                  min={2020}
                  max={2050}
                  value={periodYear}
                  onChange={(e) => setPeriodYear(e.target.value)}
                  className="text-xs h-9 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="weekendAttendance"
                checked={weekendAttendance}
                onCheckedChange={(checked) => setWeekendAttendance(!!checked)}
              />
              <label
                htmlFor="weekendAttendance"
                className="text-xs text-muted-foreground font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Izinkan presensi guru di akhir pekan (Sabtu & Ahad untuk kegiatan ekstrakurikuler/rapat)
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" className="text-xs h-8" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Periode Aktif'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tabel Tahun Ajaran */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            Daftar Tahun Ajaran
          </h2>
          <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => setIsAddYearOpen(true)}>
            <Plus className="size-3.5 mr-1" />
            Tambah Tahun Ajaran
          </Button>
        </div>
        <ZebraDataTable data={years} columns={yearColumns} />
      </div>

      {/* Tabel Semester */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            Daftar Semester
          </h2>
          <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => setIsAddSemOpen(true)}>
            <Plus className="size-3.5 mr-1" />
            Tambah Semester
          </Button>
        </div>
        <ZebraDataTable data={semesters} columns={semesterColumns} />
      </div>

      {/* Modal Tambah Tahun Ajaran */}
      <Dialog open={isAddYearOpen} onOpenChange={setIsAddYearOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Tambah Tahun Ajaran Baru</DialogTitle>
            <DialogDescription className="text-xs">
              Masukkan nama tahun ajaran (contoh: 2027/2028) dan tanggal mulai operasional.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateYear} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label className="text-xs">Nama Tahun Ajaran</Label>
              <Input
                required
                placeholder="2027/2028"
                value={yearName}
                onChange={(e) => setYearName(e.target.value)}
                className="text-xs h-8 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Tanggal Mulai</Label>
                <Input
                  required
                  type="date"
                  value={yearStartDate}
                  onChange={(e) => setYearStartDate(e.target.value)}
                  className="text-xs h-8 font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Tanggal Selesai</Label>
                <Input
                  required
                  type="date"
                  value={yearEndDate}
                  onChange={(e) => setYearEndDate(e.target.value)}
                  className="text-xs h-8 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="yearActive"
                checked={yearIsActive}
                onCheckedChange={(checked) => setYearIsActive(!!checked)}
              />
              <label htmlFor="yearActive" className="text-xs text-muted-foreground">
                Jadikan sebagai Tahun Ajaran Aktif Saat Ini
              </label>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => setIsAddYearOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="text-xs" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Tambah Semester */}
      <Dialog open={isAddSemOpen} onOpenChange={setIsAddSemOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Tambah Semester Baru</DialogTitle>
            <DialogDescription className="text-xs">
              Kaitkan semester ke tahun ajaran yang bersangkutan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSemester} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label className="text-xs">Pilih Tahun Ajaran</Label>
              <Select value={semYearId} onValueChange={setSemYearId}>
                <SelectTrigger className="text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y.id} value={y.id}>
                      {y.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Nama Semester</Label>
              <Input
                required
                placeholder="Semester Ganjil / Semester Genap"
                value={semName}
                onChange={(e) => setSemName(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Tanggal Mulai</Label>
                <Input
                  required
                  type="date"
                  value={semStartDate}
                  onChange={(e) => setSemStartDate(e.target.value)}
                  className="text-xs h-8 font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Tanggal Selesai</Label>
                <Input
                  required
                  type="date"
                  value={semEndDate}
                  onChange={(e) => setSemEndDate(e.target.value)}
                  className="text-xs h-8 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="semActive"
                checked={semIsActive}
                onCheckedChange={(checked) => setSemIsActive(!!checked)}
              />
              <label htmlFor="semActive" className="text-xs text-muted-foreground">
                Jadikan sebagai Semester Aktif
              </label>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => setIsAddSemOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="text-xs" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
