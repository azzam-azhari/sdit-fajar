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
  updateRegistrationStatusAction,
  promoteRegistrationToStudentAction,
} from '@/actions/ppdb.actions';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  UserCheck,
  FileText,
} from 'lucide-react';

export interface ApplicationItem {
  id: string;
  admission_wave_id: string;
  registration_number: string;
  student_name: string;
  nik: string | null;
  nisn: string | null;
  gender: string;
  birth_place: string;
  birth_date: string;
  address: string;
  parent_name: string;
  parent_phone: string;
  parent_email: string | null;
  father_name: string | null;
  father_occupation: string | null;
  mother_name: string | null;
  mother_occupation: string | null;
  status: string;
  observation_score: number | null;
  admin_notes: string | null;
  created_at: string;
  admission_waves?: {
    id: string;
    title: string;
    wave_number: number;
  };
}

interface PpdbVerificationClientProps {
  initialApplications: ApplicationItem[];
  waves: { id: string; title: string; wave_number: number }[];
  classrooms: { id: string; name: string }[];
}

export function PpdbVerificationClient({
  initialApplications,
  waves,
  classrooms,
}: PpdbVerificationClientProps) {
  const [applications, setApplications] = React.useState<ApplicationItem[]>(initialApplications);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [waveFilter, setWaveFilter] = React.useState<string>('all');
  const [isPending, startTransition] = React.useTransition();

  // State Detail & Promosi
  const [selectedApp, setSelectedApp] = React.useState<ApplicationItem | null>(null);
  const [promoteClassroomId, setPromoteClassroomId] = React.useState<string>(classrooms[0]?.id || '');
  const [customNis, setCustomNis] = React.useState('');
  const [adminNotes, setAdminNotes] = React.useState('');

  const filtered = React.useMemo(() => {
    return applications.filter((app) => {
      const matchSearch =
        app.student_name.toLowerCase().includes(search.toLowerCase()) ||
        app.registration_number.toLowerCase().includes(search.toLowerCase()) ||
        app.parent_name.toLowerCase().includes(search.toLowerCase()) ||
        app.parent_phone.includes(search);

      const matchStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchWave = waveFilter === 'all' || app.admission_wave_id === waveFilter;

      return matchSearch && matchStatus && matchWave;
    });
  }, [applications, search, statusFilter, waveFilter]);

  // Handler Ganti Status (misal: under_review atau rejected)
  const handleUpdateStatus = (newStatus: 'under_review' | 'rejected') => {
    if (!selectedApp) return;

    startTransition(async () => {
      const res = await updateRegistrationStatusAction({
        application_id: selectedApp.id,
        status: newStatus,
        admin_notes: adminNotes || null,
      });

      if (res.success) {
        toast.success(res.message);
        setApplications((prev) =>
          prev.map((a) => (a.id === selectedApp.id ? { ...a, status: newStatus, admin_notes: adminNotes } : a))
        );
        setSelectedApp(null);
      } else {
        toast.error(res.error);
      }
    });
  };

  // Handler Promosi Murid
  const handlePromote = () => {
    if (!selectedApp) return;

    startTransition(async () => {
      const res = await promoteRegistrationToStudentAction({
        application_id: selectedApp.id,
        classroom_id: promoteClassroomId || null,
        nis: customNis || null,
      });

      if (res.success) {
        toast.success(res.message);
        setApplications((prev) =>
          prev.map((a) => (a.id === selectedApp.id ? { ...a, status: 'approved' } : a))
        );
        setSelectedApp(null);
      } else {
        toast.error(res.error);
      }
    });
  };

  const columns: ZebraColumn<ApplicationItem>[] = [
    {
      header: 'No. Registrasi',
      isMono: true,
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-primary">
          {item.registration_number}
        </span>
      ),
    },
    {
      header: 'Nama Calon Murid',
      cell: (item) => (
        <div>
          <span className="font-medium text-foreground text-xs block">
            {item.student_name}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {item.gender === 'L' || item.gender === 'male' ? 'Laki-laki' : 'Perempuan'} • {item.birth_place},{' '}
            {item.birth_date}
          </span>
        </div>
      ),
    },
    {
      header: 'Orang Tua / Wali',
      cell: (item) => (
        <div>
          <span className="text-xs font-medium text-foreground block">
            {item.parent_name}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            WA: {item.parent_phone}
          </span>
        </div>
      ),
    },
    {
      header: 'Gelombang',
      cell: (item) => (
        <span className="text-xs text-muted-foreground">
          {item.admission_waves?.title || 'Gelombang 1'}
        </span>
      ),
    },
    {
      header: 'Status Berkas',
      cell: (item) => {
        const badges: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
          submitted: { label: 'Diajukan', color: 'border-blue-500/40 text-blue-600 bg-blue-500/5', icon: Clock },
          under_review: { label: 'Diverifikasi', color: 'border-amber-500/40 text-amber-600 bg-amber-500/5', icon: Clock },
          approved: { label: 'Diterima / Murid Aktif', color: 'border-emerald-500/40 text-emerald-600 bg-emerald-500/5', icon: CheckCircle2 },
          rejected: { label: 'Ditolak', color: 'border-rose-500/40 text-rose-600 bg-rose-500/5', icon: XCircle },
        };

        const currentBadge = badges[item.status] || badges.submitted;
        const Icon = currentBadge.icon;

        return (
          <Badge variant="outline" className={`font-mono text-[11px] gap-1 ${currentBadge.color}`}>
            <Icon className="size-3" />
            {currentBadge.label}
          </Badge>
        );
      },
    },
    {
      header: 'Aksi Tinjauan',
      align: 'right',
      cell: (item) => (
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-[11px] px-2.5"
          onClick={() => {
            setSelectedApp(item);
            setAdminNotes(item.admin_notes || '');
          }}
        >
          <Eye className="size-3 mr-1" />
          Detail Berkas
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama calon murid, no. registrasi, wali..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] text-xs h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="submitted">Diajukan</SelectItem>
              <SelectItem value="under_review">Diverifikasi</SelectItem>
              <SelectItem value="approved">Diterima (Aktif)</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
            </SelectContent>
          </Select>

          <Select value={waveFilter} onValueChange={setWaveFilter}>
            <SelectTrigger className="w-[150px] text-xs h-9">
              <SelectValue placeholder="Gelombang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Gelombang</SelectItem>
              {waves.map((w) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ZebraDataTable
        data={filtered}
        columns={columns}
        emptyText="Tidak ada formulir pendaftaran yang sesuai dengan kriteria filter."
      />

      {/* Modal Detail Pendaftar & Promosi */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              Detail Berkas Pendaftaran: {selectedApp?.registration_number}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tanggal pendaftaran: {selectedApp && new Date(selectedApp.created_at).toLocaleDateString('id-ID', { dateStyle: 'full' })}
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4 py-2 text-xs">
              {/* Biodata Anak */}
              <div className="rounded-lg border border-border p-3 space-y-2 bg-muted/20">
                <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">
                  Biodata Calon Murid
                </h4>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>Nama Lengkap: <span className="font-medium text-foreground">{selectedApp.student_name}</span></div>
                  <div>Jenis Kelamin: <span className="font-medium text-foreground">{selectedApp.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span></div>
                  <div>Tempat, Tanggal Lahir: <span className="font-medium text-foreground">{selectedApp.birth_place}, {selectedApp.birth_date}</span></div>
                  <div>NIK / NISN: <span className="font-mono text-foreground">{selectedApp.nik || '-'} / {selectedApp.nisn || '-'}</span></div>
                  <div className="col-span-2">Alamat Tinggal: <span className="font-medium text-foreground">{selectedApp.address}</span></div>
                </div>
              </div>

              {/* Biodata Orang Tua */}
              <div className="rounded-lg border border-border p-3 space-y-2 bg-muted/20">
                <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">
                  Data Orang Tua / Wali
                </h4>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>Nama Wali: <span className="font-medium text-foreground">{selectedApp.parent_name}</span></div>
                  <div>No. WhatsApp: <span className="font-mono text-foreground font-semibold text-emerald-600">{selectedApp.parent_phone}</span></div>
                  <div>Email: <span className="font-mono text-foreground">{selectedApp.parent_email || '-'}</span></div>
                  <div>Ayah / Ibu: <span className="font-medium text-foreground">{selectedApp.father_name || '-'} / {selectedApp.mother_name || '-'}</span></div>
                </div>
              </div>

              {/* Catatan Verifikator */}
              <div className="space-y-1">
                <Label className="text-xs">Catatan Administrator / Verifikator</Label>
                <Input
                  placeholder="Catatan kelengkapan dokumen atau alasan penolakan..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              {/* Form Promosi Murid Jika Belum Approved */}
              {selectedApp.status !== 'approved' && (
                <div className="rounded-lg border-2 border-primary/30 p-3 space-y-3 bg-primary/5">
                  <h4 className="font-semibold text-primary text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="size-4" />
                    Penerimaan & Promosi Menjadi Murid Aktif
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Sistem akan otomatis membuat akun Auth murid (NIS + password format tempatddmmyyyy) serta akun wali murid.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Tetapkan Rombel Awal</Label>
                      <Select value={promoteClassroomId} onValueChange={setPromoteClassroomId}>
                        <SelectTrigger className="text-xs h-8 bg-background">
                          <SelectValue placeholder="Pilih Rombel" />
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
                      <Label className="text-xs">Kustom NIS (Opsional)</Label>
                      <Input
                        placeholder="Otomatis jika kosong"
                        value={customNis}
                        onChange={(e) => setCustomNis(e.target.value)}
                        className="text-xs h-8 font-mono bg-background"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2 pt-2 border-t border-border">
            {selectedApp?.status !== 'approved' ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-amber-600 hover:text-amber-700"
                  disabled={isPending}
                  onClick={() => handleUpdateStatus('under_review')}
                >
                  Tandai Diverifikasi
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-rose-600 hover:text-rose-700"
                  disabled={isPending}
                  onClick={() => handleUpdateStatus('rejected')}
                >
                  Tolak Pendaftaran
                </Button>
              </div>
            ) : (
              <Badge variant="outline" className="text-emerald-600 border-emerald-400 font-mono text-xs">
                Murid Sudah Aktif Terdaftar
              </Badge>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setSelectedApp(null)}
              >
                Tutup
              </Button>
              {selectedApp?.status !== 'approved' && (
                <Button
                  size="sm"
                  className="text-xs bg-primary text-primary-foreground font-semibold"
                  disabled={isPending}
                  onClick={handlePromote}
                >
                  <UserCheck className="size-3.5 mr-1.5" />
                  {isPending ? 'Memproses...' : 'Setujui & Promosikan'}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
