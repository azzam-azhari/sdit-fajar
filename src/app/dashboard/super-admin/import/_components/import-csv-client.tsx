'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ZebraDataTable, ZebraColumn } from '@/components/common/zebra-data-table';
import { toast } from 'sonner';
import {
  validateCsvDataAction,
  commitCsvBatchAction,
  CsvValidationError,
  ImportCsvRow,
} from '@/actions/import.actions';
import {
  Download,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Database,
} from 'lucide-react';

export interface BatchHistoryItem {
  id: string;
  entity_type: string;
  total_rows: number;
  success_rows: number;
  failed_rows: number;
  created_at: string;
  profiles?: {
    name: string;
  };
}

export function ImportCsvClient({ initialBatches }: { initialBatches: BatchHistoryItem[] }) {
  const [batches] = React.useState<BatchHistoryItem[]>(initialBatches);
  const [entityType, setEntityType] = React.useState<'siswa' | 'guru' | 'wali_murid'>('siswa');
  const [csvContent, setCsvContent] = React.useState('');
  const [filename, setFilename] = React.useState('');
  const [isPending, startTransition] = React.useTransition();

  // Hasil Validasi
  const [validationResult, setValidationResult] = React.useState<{
    isValid: boolean;
    totalRows: number;
    validRows: ImportCsvRow[];
    errors: CsvValidationError[];
  } | null>(null);

  // File Upload Reader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Berkas wajib berekstensi .csv');
      return;
    }

    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      setValidationResult(null);
    };
    reader.readAsText(file);
  };

  // Validasi Baris Data
  const handleValidate = () => {
    if (!csvContent.trim()) {
      toast.error('Pilih berkas CSV atau tempelkan teks CSV terlebih dahulu.');
      return;
    }

    startTransition(async () => {
      const res = await validateCsvDataAction(entityType, csvContent);
      if (res.success) {
        setValidationResult(res.data);
        if (res.data.isValid) {
          toast.success(`Validasi berhasil: ${res.data.validRows.length} baris siap diimpor.`);
        } else {
          toast.error(`Ditemukan ${res.data.errors.length} kesalahan validasi pada berkas CSV.`);
        }
      } else {
        toast.error(res.error);
      }
    });
  };

  // Komit Transaksi Database
  const handleCommit = () => {
    if (!validationResult || !validationResult.isValid || validationResult.validRows.length === 0) {
      toast.error('Tidak dapat melakukan komit. Pastikan seluruh baris telah valid.');
      return;
    }

    startTransition(async () => {
      const res = await commitCsvBatchAction(entityType, validationResult.validRows);
      if (res.success) {
        toast.success(res.message);
        setCsvContent('');
        setFilename('');
        setValidationResult(null);
        window.location.reload();
      } else {
        toast.error(res.error);
      }
    });
  };

  const errorColumns: ZebraColumn<CsvValidationError>[] = [
    {
      header: 'No. Baris CSV',
      isMono: true,
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-rose-600">
          Baris {item.rowNumber}
        </span>
      ),
    },
    {
      header: 'Kolom / Field',
      isMono: true,
      cell: (item) => (
        <Badge variant="outline" className="border-rose-400 text-rose-600 font-mono text-[11px]">
          {item.field || 'Format'}
        </Badge>
      ),
    },
    {
      header: 'Keterangan Kesalahan Validasi',
      accessorKey: 'message',
    },
  ];

  const batchColumns: ZebraColumn<BatchHistoryItem>[] = [
    {
      header: 'Waktu Import (WIB)',
      isMono: true,
      cell: (item) => (
        <span className="font-mono text-xs text-muted-foreground">
          {new Date(item.created_at).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      header: 'Entitas Data',
      cell: (item) => (
        <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[11px]">
          {item.entity_type}
        </Badge>
      ),
    },
    {
      header: 'Eksekutor',
      cell: (item) => (
        <span className="text-xs text-foreground font-medium">
          {item.profiles?.name || 'Super Admin'}
        </span>
      ),
    },
    {
      header: 'Hasil Eksekusi',
      cell: (item) => (
        <span className="text-xs font-mono font-semibold text-emerald-600">
          {item.success_rows} / {item.total_rows} Berhasil
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-border/80">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileSpreadsheet className="size-4 text-primary" />
                Formulir Impor Data Massal
              </CardTitle>
              <CardDescription className="text-xs">
                Pilih jenis entitas master, unduh template resmi, dan unggah berkas CSV.
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="text-xs h-8">
              <a href={`/api/import/template?type=${entityType}`} download>
                <Download className="size-3 mr-1.5" />
                Unduh Template Resmi ({entityType})
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Target Entitas Master</Label>
              <Select
                value={entityType}
                onValueChange={(v: 'siswa' | 'guru' | 'wali_murid') => {
                  setEntityType(v);
                  setValidationResult(null);
                }}
              >
                <SelectTrigger className="text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="siswa">Data Siswa (Murid)</SelectItem>
                  <SelectItem value="guru">Tenaga Pendidik (Guru)</SelectItem>
                  <SelectItem value="wali_murid">Wali Murid & Relasi Anak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <Label className="text-xs">Unggah Berkas CSV</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="text-xs h-9 cursor-pointer"
                />
                {filename && (
                  <span className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">
                    {filename}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Atau Tempelkan (Paste) Teks CSV Langsung</Label>
            <textarea
              rows={4}
              value={csvContent}
              onChange={(e) => {
                setCsvContent(e.target.value);
                setValidationResult(null);
              }}
              placeholder="nis,name,gender,birth_place,birth_date,address,classroom_name..."
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs font-mono shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-border/60 pt-3">
          <span className="text-xs text-muted-foreground italic">
            * Transaksi atomik: Komit ditolak penuh jika ada baris duplikat atau kolom tidak valid.
          </span>
          <Button
            size="sm"
            className="text-xs h-8"
            disabled={isPending || !csvContent.trim()}
            onClick={handleValidate}
          >
            <CheckCircle2 className="size-3.5 mr-1.5" />
            {isPending ? 'Memeriksa...' : 'Validasi Format & Baris CSV'}
          </Button>
        </CardFooter>
      </Card>

      {/* Tampilan Hasil Validasi */}
      {validationResult && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/80 bg-card">
            <div className="flex items-center gap-3">
              {validationResult.isValid ? (
                <div className="size-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="size-5" />
                </div>
              ) : (
                <div className="size-8 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  <AlertCircle className="size-5" />
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {validationResult.isValid
                    ? `Seluruh Data Valid (${validationResult.validRows.length} Baris)`
                    : `Ditemukan ${validationResult.errors.length} Kesalahan Baris Data`}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {validationResult.isValid
                    ? 'Format header, encoding, tipe data, dan relasi foreign key telah lolos uji.'
                    : 'Perbaiki baris data yang bermasalah pada berkas CSV Anda sebelum mengeksekusi import.'}
                </p>
              </div>
            </div>

            {validationResult.isValid && (
              <Button
                size="sm"
                className="text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                disabled={isPending}
                onClick={handleCommit}
              >
                <Database className="size-3.5 mr-1.5" />
                {isPending ? 'Mengimpor Data...' : `Komit Import (${validationResult.validRows.length} Baris)`}
              </Button>
            )}
          </div>

          {/* Tabel Error Jika Ada */}
          {!validationResult.isValid && validationResult.errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                Daftar Baris Korup / Tidak Sesuai Skema
              </h4>
              <ZebraDataTable
                data={validationResult.errors}
                columns={errorColumns}
                emptyText="Tidak ada error."
              />
            </div>
          )}
        </div>
      )}

      {/* Riwayat Batch Import Sebelumnya */}
      <div className="space-y-3 pt-4 border-t border-border/80">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          Riwayat Batch Import Data Sebelumnya (`import_batches`)
        </h2>
        <ZebraDataTable
          data={batches}
          columns={batchColumns}
          emptyText="Belum ada riwayat batch import data."
        />
      </div>
    </div>
  );
}
