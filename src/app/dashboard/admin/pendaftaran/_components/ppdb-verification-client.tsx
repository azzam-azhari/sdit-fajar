'use client';

import * as React from 'react';
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
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
  getRegistrationDocumentSignedUrlAction,
} from '@/actions/ppdb.actions';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  UserCheck,
  FileText,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  X,
  Phone,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  Download,
  Loader2,
} from 'lucide-react';

export interface ApplicationDocumentItem {
  id: string;
  document_type: string;
  file_path: string;
  original_filename: string | null;
}

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
  student_registration_documents?: ApplicationDocumentItem[];
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  submitted: { label: 'Diajukan', color: 'border-blue-500/40 text-blue-600 bg-blue-500/5', icon: Clock },
  under_review: { label: 'Diverifikasi', color: 'border-amber-500/40 text-amber-600 bg-amber-500/5', icon: Clock },
  approved: { label: 'Diterima / Murid Aktif', color: 'border-emerald-500/40 text-emerald-600 bg-emerald-500/5', icon: CheckCircle2 },
  rejected: { label: 'Ditolak', color: 'border-rose-500/40 text-rose-600 bg-rose-500/5', icon: XCircle },
};

function renderStatusBadge(status: string) {
  const current = statusConfig[status] || statusConfig.submitted;
  const Icon = current.icon;
  return (
    <Badge variant="outline" className={`font-mono text-[11px] gap-1 ${current.color}`}>
      <Icon className="size-3" />
      {current.label}
    </Badge>
  );
}

interface PpdbVerificationClientProps {
  applications: ApplicationItem[];
  waves: { id: string; title: string; wave_number: number }[];
  classrooms: { id: string; name: string }[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

/**
 * Sensor NIK di tabel untuk perlindungan privasi (e.g. 3276********1234)
 */
function maskNik(nik: string | null): string {
  if (!nik) return '-';
  const clean = nik.trim();
  if (clean.length < 8) return '****';
  const prefix = clean.slice(0, 4);
  const suffix = clean.slice(-4);
  const maskedLength = Math.max(0, clean.length - 8);
  return `${prefix}${'*'.repeat(maskedLength)}${suffix}`;
}

export function PpdbVerificationClient({
  applications,
  waves,
  classrooms,
  totalCount,
  currentPage: _currentPage,
  pageSize,
}: PpdbVerificationClientProps) {
  // 1. URL State via nuqs (shallow: false untuk memicu fetch RSC)
  const [searchQuery, setSearchQuery] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({ shallow: false })
  );

  const [statusFilter, setStatusFilter] = useQueryState(
    'status',
    parseAsString.withDefault('all').withOptions({ shallow: false })
  );

  const [waveFilter, setWaveFilter] = useQueryState(
    'wave',
    parseAsString.withDefault('all').withOptions({ shallow: false })
  );

  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ shallow: false })
  );

  // 2. Local State untuk Debounced Search
  const [localSearch, setLocalSearch] = React.useState(searchQuery);
  const [isPending, startTransition] = React.useTransition();

  // Sinkronisasi debounce pencarian
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery(localSearch ? localSearch : null);
        setPage(1);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [localSearch, searchQuery, setSearchQuery, setPage]);

  // State Detail & Promosi
  const [selectedApp, setSelectedApp] = React.useState<ApplicationItem | null>(null);
  const [promoteClassroomId, setPromoteClassroomId] = React.useState<string>(classrooms[0]?.id || '');
  const [customNis, setCustomNis] = React.useState('');
  const [adminNotes, setAdminNotes] = React.useState('');
  const [documentLoading, setDocumentLoading] = React.useState(false);

  // Hitung total halaman
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Deteksi filter aktif & handler reset filter
  const hasActiveFilters = Boolean(
    localSearch.trim() ||
    (statusFilter && statusFilter !== 'all') ||
    (waveFilter && waveFilter !== 'all')
  );

  const handleResetFilters = () => {
    setLocalSearch('');
    setSearchQuery(null);
    setStatusFilter('all');
    setWaveFilter('all');
    setPage(1);
  };

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
        setSelectedApp(null);
      } else {
        toast.error(res.error);
      }
    });
  };

  // Handler Promosi Murid Aktif
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
        setSelectedApp(null);
      } else {
        toast.error(res.error);
      }
    });
  };

  // Handler Unduh / Lihat Berkas Signed URL
  const handleViewDocument = async (filePath: string) => {
    setDocumentLoading(true);
    try {
      const res = await getRegistrationDocumentSignedUrlAction(filePath);
      if (res.success) {
        window.open(res.data.signedUrl, '_blank', 'noopener,noreferrer');
      } else {
        toast.error((res as { error?: string }).error || 'Gagal memuat tautan berkas.');
      }
    } catch {
      toast.error('Gagal mengakses penyimpanan berkas.');
    } finally {
      setDocumentLoading(false);
    }
  };

  // Definisi Kolom Tabel (Zebra Cross)
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
      header: 'NIK (Tersamarkan)',
      isMono: true,
      cell: (item) => (
        <span className="font-mono text-xs text-muted-foreground">
          {maskNik(item.nik)}
        </span>
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
      header: 'Tanggal Masuk',
      isMono: true,
      cell: (item) => (
        <span className="font-mono text-[11px] text-muted-foreground">
          {new Date(item.created_at).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      header: 'Status Berkas',
      cell: (item) => renderStatusBadge(item.status),
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
      {/* Filter Bar Toolbar Responsif */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-3 sm:p-3.5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Controls: Search + Select Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 min-w-0">
            {/* Search Input dengan Ikon Lega & Tombol Clear */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Cari nama calon murid, no. registrasi, wali..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10 pr-9 text-xs h-9 bg-background/80 w-full"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => setLocalSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                  title="Hapus pencarian"
                  aria-label="Hapus kata kunci pencarian"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns - 2 kolom seimbang di mobile, horizontal di layar sm+ */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 shrink-0">
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[135px] text-xs h-9 bg-background/80">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="submitted">Diajukan</SelectItem>
                  <SelectItem value="under_review">Diverifikasi</SelectItem>
                  <SelectItem value="approved">Diterima</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={waveFilter}
                onValueChange={(val) => {
                  setWaveFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[150px] text-xs h-9 bg-background/80">
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

              {/* Tombol Reset Filter jika ada filter aktif */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="col-span-2 sm:col-span-1 h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5"
                  title="Reset seluruh filter"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset</span>
                </Button>
              )}
            </div>
          </div>

          {/* Total Count Badge */}
          <div className="flex items-center justify-between md:justify-end gap-2 text-xs border-t md:border-t-0 pt-2 md:pt-0 border-border/50 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border/60 text-muted-foreground font-mono text-[11px]">
              Total: <strong className="text-foreground font-semibold">{totalCount}</strong> pendaftar
            </span>
          </div>
        </div>
      </div>

      {/* Tabel Data Zebra Cross */}
      <ZebraDataTable
        data={applications}
        columns={columns}
        emptyText="Tidak ada formulir pendaftaran yang sesuai dengan kriteria filter."
      />

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t border-border/60">
        <div>
          Halaman <strong className="text-foreground font-mono">{page}</strong> dari{' '}
          <strong className="text-foreground font-mono">{totalPages}</strong>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="h-8 px-3 text-xs gap-1"
          >
            <ChevronLeft className="size-3.5" />
            <span>Sebelumnya</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="h-8 px-3 text-xs gap-1"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Modal Detail Pendaftar & Verifikasi Status */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader className="pr-6 space-y-1.5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <FileText className="size-4" />
              </span>
              <DialogTitle className="text-sm sm:text-base font-semibold text-foreground">
                Detail Berkas Pendaftaran
              </DialogTitle>
              {selectedApp && (
                <Badge variant="outline" className="font-mono text-[11px] bg-primary/5 text-primary border-primary/20">
                  {selectedApp.registration_number}
                </Badge>
              )}
            </div>
            <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground">
              Tanggal masuk: {selectedApp && new Date(selectedApp.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4 py-1 text-xs">
              {/* Ringkasan Status & Gelombang */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-border/70 bg-muted/30">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-muted-foreground font-medium">Status Berkas:</span>
                  {renderStatusBadge(selectedApp.status)}
                </div>
                {selectedApp.admission_waves && (
                  <div className="text-[11px] text-muted-foreground">
                    Gelombang: <span className="font-semibold text-foreground">{selectedApp.admission_waves.title}</span>
                  </div>
                )}
              </div>

              {/* Biodata Calon Murid (NIK Lengkap Tanpa Sensor untuk Verifikator) */}
              <div className="rounded-xl border border-border/80 p-3.5 space-y-3 bg-card shadow-2xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <User className="size-3.5 text-primary" />
                    Biodata Calon Murid
                  </h4>
                  <span className="text-[10px] text-muted-foreground font-medium">Data Calon Siswa</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Nama Lengkap</span>
                    <span className="text-sm font-semibold text-foreground">{selectedApp.student_name}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">NIK Calon Murid</span>
                    <span className="font-mono text-xs font-semibold text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/60 inline-block">
                      {selectedApp.nik || '-'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">NISN</span>
                    <span className="font-mono text-xs font-medium text-foreground">
                      {selectedApp.nisn || '-'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Jenis Kelamin</span>
                    <span className="text-xs font-medium text-foreground">
                      {selectedApp.gender === 'L' || selectedApp.gender === 'male'
                        ? 'Laki-laki (Ikhwan)'
                        : 'Perempuan (Akhwat)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Tempat, Tanggal Lahir</span>
                    <span className="text-xs font-medium text-foreground flex items-center gap-1">
                      <Calendar className="size-3 text-muted-foreground shrink-0" />
                      {selectedApp.birth_place}, {selectedApp.birth_date}
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Alamat Tinggal</span>
                    <span className="text-xs font-medium text-foreground flex items-start gap-1.5 mt-0.5">
                      <MapPin className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <span>{selectedApp.address}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Biodata Orang Tua / Wali */}
              <div className="rounded-xl border border-border/80 p-3.5 space-y-3 bg-card shadow-2xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-primary" />
                    Data Orang Tua / Wali
                  </h4>
                  <span className="text-[10px] text-muted-foreground font-medium">Kontak & Pekerjaan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Nama Ayah</span>
                    <span className="text-xs font-medium text-foreground">
                      {selectedApp.father_name || selectedApp.parent_name}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">No. WhatsApp Ayah / Wali</span>
                    <a
                      href={`https://wa.me/${selectedApp.parent_phone.replace(/^0/, '62').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="size-3" />
                      {selectedApp.parent_phone}
                      <ExternalLink className="size-2.5 opacity-70" />
                    </a>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Pekerjaan Ayah</span>
                    <span className="text-xs font-medium text-foreground">
                      {selectedApp.father_occupation || '-'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Nama Ibu</span>
                    <span className="text-xs font-medium text-foreground">
                      {selectedApp.mother_name || '-'}
                    </span>
                  </div>

                  {selectedApp.mother_occupation && (
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Pekerjaan Ibu</span>
                      <span className="text-xs font-medium text-foreground">
                        {selectedApp.mother_occupation}
                      </span>
                    </div>
                  )}

                  {selectedApp.parent_email && (
                    <div className="sm:col-span-2">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Email Orang Tua</span>
                      <span className="text-xs font-medium text-foreground">
                        {selectedApp.parent_email}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Berkas Lampiran Persyaratan */}
              <div className="rounded-xl border border-border/80 p-3.5 space-y-2.5 bg-card shadow-2xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="size-3.5 text-primary" />
                    Berkas Lampiran Persyaratan
                  </h4>
                  <span className="text-[10px] text-muted-foreground font-medium">KK / Akta Kelahiran</span>
                </div>

                {selectedApp.student_registration_documents && selectedApp.student_registration_documents.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    {selectedApp.student_registration_documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2.5 rounded-lg border border-border/60 bg-muted/20"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-1.5 rounded bg-primary/10 text-primary shrink-0">
                            <FileText className="size-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-medium text-foreground truncate block">
                              {doc.original_filename || 'Dokumen Persyaratan'}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase">
                              {doc.document_type.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={documentLoading}
                          onClick={() => handleViewDocument(doc.file_path)}
                          className="h-7 text-[11px] gap-1.5 w-full sm:w-auto shrink-0"
                        >
                          {documentLoading ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <Download className="size-3" />
                          )}
                          <span>Buka Berkas</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground py-1 italic">
                    Tidak ada lampiran berkas fisik yang diunggah saat pendaftaran.
                  </p>
                )}
              </div>

              {/* Catatan Verifikator & Aksi Status */}
              <div className="rounded-xl border border-border/80 p-3.5 space-y-3 bg-card shadow-2xs">
                <div className="space-y-1.5">
                  <Label htmlFor="admin-notes-input" className="text-xs font-semibold text-foreground">
                    Catatan Administrator / Verifikator
                  </Label>
                  <Input
                    id="admin-notes-input"
                    placeholder="Catatan kelengkapan dokumen atau alasan penolakan..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleUpdateStatus('under_review')}
                    className="text-xs h-8 flex-1 w-full"
                  >
                    Tandai Diverifikasi
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleUpdateStatus('rejected')}
                    className="text-xs h-8 flex-1 w-full text-rose-600 hover:text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
                  >
                    Tolak Berkas
                  </Button>
                </div>
              </div>

              {/* Promosi Murid Aktif jika Belum Approved */}
              {selectedApp.status !== 'approved' && (
                <div className="rounded-xl border-2 border-primary/30 p-3.5 space-y-3 bg-primary/5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-primary">
                    <UserCheck className="size-4 shrink-0" />
                    <h4 className="font-bold text-xs uppercase tracking-wider">
                      Penerimaan & Promosi Menjadi Murid Aktif
                    </h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Sistem akan otomatis membuat akun Auth murid (NIS + password format tempatddmmyyyy) serta menghubungkan akun wali murid.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-foreground">Rombel Kelas *</Label>
                      <Select value={promoteClassroomId} onValueChange={setPromoteClassroomId}>
                        <SelectTrigger className="text-xs h-8 bg-background">
                          <SelectValue placeholder="Pilih Kelas" />
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
                      <Label className="text-[11px] font-medium text-foreground">Kustom NIS (Opsional)</Label>
                      <Input
                        placeholder="Otomatis jika kosong"
                        value={customNis}
                        onChange={(e) => setCustomNis(e.target.value)}
                        className="text-xs h-8 font-mono bg-background"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    disabled={isPending}
                    onClick={handlePromote}
                    className="w-full text-xs font-bold bg-primary text-primary-foreground h-9 shadow-sm"
                  >
                    {isPending ? 'Memproses Promosi...' : 'Terima & Promosikan Jadi Murid Aktif'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
